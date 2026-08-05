import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import { ProductQueryParams } from "@/modules/products/dto/product-query-params.dto";
import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { CategoryRepository } from "@/modules/categories/category.repository";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductRepository } from "@/modules/products/product.repository";
import { InventoryEntity } from "@/modules/inventories/inventory.entity";
import { ProductEntity } from "@/modules/products/product.entity";
import { StorageService } from "@/common/storage/storage.service";
import { ProductMapper } from "@/common/mappers/product.mapper";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { LoggerService } from "@/common/logger/logger.service";
import { STORAGE } from "@/common/storage/storage.constants";
import { generateSku } from "@/common/utils/generate-sku";
import { UserEntity } from "@/modules/users/user.entity";
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

    const entity = this.productMapper.toEntity(dto);
    entity.userId = user.id;
    entity.slug = toSlug(dto.name);
    entity.categories = categories.map((category) => {
      const entityCategory = new ProductCategoryEntity();
      entityCategory.product = entity;
      entityCategory.category = category;
      return entityCategory;
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

    entity.sku = sku;

    const entityInventory = new InventoryEntity();
    entityInventory.quantityAvailable = dto.inventory.quantityAvailable;
    entityInventory.lowStockThreshold = dto.inventory.lowStockThreshold;
    entity.inventory = entityInventory;

    const images = dto.images.map((image) => ({
      data: image.data,
      mimetype: image.mimetype,
    }));

    const uploadedImages = await this.storageService.uploadMany({
      folder: `products/${entity.sku}`,
      images,
    });

    entity.images = dto.images.map((image, index) => {
      const entityImage = new ProductImageEntity();
      entityImage.position = image.position;
      entityImage.altText = entity.sku + "_" + randomBytes(8).toString("hex");
      entityImage.path = uploadedImages[index].path;
      return entityImage;
    });

    const { id } = await this.productRepository.save(entity);

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

    const entity = this.productMapper.update(product, dto);

    if (dto.name) {
      entity.slug = toSlug(dto.name);
    }

    if (dto.inventory && entity.inventory) {
      const inventory = entity.inventory;
      inventory.quantityAvailable = dto.inventory.quantityAvailable;
      inventory.lowStockThreshold = dto.inventory.lowStockThreshold;
      entity.inventory = inventory;
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
        folder: `products/${entity.sku}`,
        images: newImages.map((image) => ({
          data: image.data,
          mimetype: image.mimetype,
        })),
      });

      uploadedImages.forEach((uploaded) => {
        const entityImage = new ProductImageEntity();
        entityImage.path = uploaded.path;
        product.images.push(entityImage);
      });
    }

    product.images.forEach((image, index) => {
      image.position = index;
      image.altText = `${entity.sku}_${index}`;
    });

    entity.images = product.images;

    const { id } = await this.productRepository.save(entity);
    const updatedProduct = await this.findProductById(id, req);

    return this.productMapper.toResponse(updatedProduct);
  }

  async deleteProduct(req: Request, user: UserEntity, productId: string): Promise<void> {
    const entity = await this.findProductById(productId, req);
    this.ensureProductOwnership(user.id, req, entity);
    await this.productRepository.softRemove(entity);
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
