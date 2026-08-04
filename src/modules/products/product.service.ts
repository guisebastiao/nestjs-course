import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { ProductQueryParams } from "@/modules/products/dto/product-query-params.dto";
import { CategoryRepository } from "@/modules/categories/category.repository";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductEntity } from "@/modules/products/product.entity";
import { ProductRepository } from "@/modules/products/product.repository";
import { UserEntity } from "@/modules/users/user.entity";
import { StorageService } from "@/common/storage/storage.service";
import { ProductMapper } from "@/common/mappers/product.mapper";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { LoggerService } from "@/common/logger/logger.service";
import { STORAGE } from "@/common/storage/storage.constants";
import { generateSku } from "@/common/utils/generate-sku";
import { Pagination } from "@/common/dto/pagination";
import { toSlug } from "@/common/utils/to-slug";
import { randomBytes } from "crypto";
import { Request } from "express";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

const MAX_SKU_RETRIES = 10;

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly storageService: StorageService,
    private readonly productMapper: ProductMapper,
    private readonly logger: LoggerService,
  ) {}

  async createProduct(req: Request, user: UserEntity, dto: CreateProductDTO): Promise<ProductDTO> {
    const categories = await this.categoryRepository.findAllByIds(dto.categories);

    if (categories.length !== dto.categories.length) {
      const foundIds = new Set(categories.map((category) => category.id));
      const missingIds = dto.categories.filter((id) => !foundIds.has(id));

      this.logger.warn({
        message: "Product creation failed because one or more category IDs do not exist.",
        path: req.path,
        class: ProductService.name,
        method: this.createProduct.name,
        data: {
          userId: user.id,
          missingIds,
          requestedCategoryIds: dto.categories,
        },
      });

      throw new BadRequestException("One or more categories were not found.");
    }

    const productEntity = this.productMapper.toEntity(dto);
    productEntity.userId = user.id;
    productEntity.slug = toSlug(dto.name);
    productEntity.categories = categories.map((category) => {
      const productCategory = new ProductCategoryEntity();
      productCategory.product = productEntity;
      productCategory.category = category;
      return productCategory;
    });

    let sku: string | undefined;

    for (let i = 1; i <= MAX_SKU_RETRIES; i++) {
      const generatedSku = generateSku();

      const exists = await this.productRepository.existsThisSku(generatedSku);

      if (!exists) {
        sku = generatedSku;
        break;
      }
    }

    if (!sku) {
      throw new InternalServerErrorException("Failed to generate a unique SKU.");
    }

    productEntity.sku = sku;

    const images = dto.images.map((image) => ({
      data: image.data,
      mimetype: image.mimetype,
    }));

    const uploadedImages = await this.storageService.uploadMany({
      folder: `products/${productEntity.sku}`,
      images,
    });

    productEntity.images = dto.images.map((image, index) => {
      const entity = new ProductImageEntity();
      entity.position = image.position;
      entity.altText = productEntity.sku + "_" + randomBytes(8).toString("hex");
      entity.path = uploadedImages[index].path;
      return entity;
    });

    const { id } = await this.productRepository.save(productEntity);

    return await this.findProduct(id, req);
  }

  async findProduct(productId: string, req: Request): Promise<ProductDTO> {
    const product = await this.findProductById(productId, req);
    return this.productMapper.toResponse(product);
  }

  async listAllProducts(
    params: ProductQueryParams,
  ): Promise<{ products: ProductDTO[]; pagination: Pagination }> {
    const [products, total] = await this.productRepository.findAllProducts(params);

    return {
      products: products.map((product) => this.productMapper.toResponse(product)),
      pagination: new Pagination(params.page, params.limit, total, Math.ceil(total / params.limit)),
    };
  }

  async updateProduct(
    req: Request,
    user: UserEntity,
    productId: string,
    dto: UpdateProductDTO,
  ): Promise<ProductDTO> {
    const product = await this.findProductById(productId, req);

    this.ensureProductOwnership(user.id, req, product);

    const productToUpdate = this.productMapper.update(product, dto);

    if (dto.name) {
      productToUpdate.slug = toSlug(dto.name);
    }

    const deleteImageIds = dto.deleteImages ?? [];

    const imagesToDelete = product.images.filter((image) => deleteImageIds.includes(image.id));

    if (imagesToDelete.length !== deleteImageIds.length) {
      const foundIds = new Set(imagesToDelete.map((image) => image.id));

      const missingIds = deleteImageIds.filter((id) => !foundIds.has(id));

      this.logger.warn({
        message: "Attempted to delete one or more images that do not exist for the product.",
        class: ProductService.name,
        method: this.updateProduct.name,
        data: {
          userId: user.id,
          productId: product.id,
          missingIds,
          requestedDeleteIds: deleteImageIds,
        },
      });

      throw new BadRequestException("One or more images to delete were not found.");
    }

    const newImages = dto.newImages ?? [];

    const finalImageCount = product.images.length - deleteImageIds.length + newImages.length;

    if (finalImageCount < 1) {
      throw new BadRequestException("The product must have at least one image.");
    }

    if (finalImageCount > STORAGE.PRODUCT_IMAGES.MAX_FILES) {
      throw new BadRequestException(
        `A maximum of ${STORAGE.PRODUCT_IMAGES.MAX_FILES} images is allowed.`,
      );
    }

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((image) => this.storageService.delete(image.path)));

      product.images = product.images.filter((image) => !deleteImageIds.includes(image.id));
    }

    if (newImages.length > 0) {
      const uploadedImages = await this.storageService.uploadMany({
        folder: `products/${productToUpdate.sku}`,
        images: newImages.map((image) => ({
          data: image.data,
          mimetype: image.mimetype,
        })),
      });

      uploadedImages.forEach((uploaded) => {
        const entity = new ProductImageEntity();

        entity.path = uploaded.path;

        product.images.push(entity);
      });
    }

    product.images.forEach((image, index) => {
      image.position = index;
      image.altText = `${productToUpdate.sku}_${index}`;
    });

    productToUpdate.images = product.images;

    const { id } = await this.productRepository.save(productToUpdate);

    const updatedProduct = await this.findProductById(id, req);

    return this.productMapper.toResponse(updatedProduct);
  }

  async deleteProduct(req: Request, user: UserEntity, productId: string): Promise<void> {
    const product = await this.findProductById(productId, req);

    this.ensureProductOwnership(user.id, req, product);

    const paths = product.images.map((img) => img.path);

    await this.storageService.deleteMany(paths);

    await this.productRepository.delete(product);
  }

  private ensureProductOwnership(userId: string, req: Request, product: ProductEntity): void {
    if (userId !== product.userId) {
      this.logger.warn({
        message: "User attempted to manipulate a product they do not own.",
        path: req.path,
        class: ProductService.name,
        method: this.ensureProductOwnership.name,
        data: {
          userId,
          productId: product.id,
          ownerId: product.userId,
        },
      });

      throw new ForbiddenException("You do not have permission to manipulate this product.");
    }
  }

  private async findProductById(productId: string, req: Request): Promise<ProductEntity> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      this.logger.warn({
        message: "Requested product was not found.",
        class: ProductService.name,
        method: this.findProductById.name,
        path: req.path,
        data: { productId },
      });

      throw new NotFoundException("Product not found");
    }

    return product;
  }
}
