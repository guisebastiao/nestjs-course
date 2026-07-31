import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductEntity } from "@/modules/products/entities/product.entity";
import { ProductRepository } from "@/modules/products/product.repository";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { ProductMapper } from "@/modules/products/product.mapper";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { LoggerService } from "@/common/logger/logger.service";
import { Pagination } from "@/common/dto/pagination";
import { Request } from "express";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productMapper: ProductMapper,
    private readonly logger: LoggerService,
  ) {}

  async createProduct(user: UserEntity, dto: CreateProductDTO): Promise<ProductDTO> {
    const productEntity = this.productMapper.toEntity(dto);
    productEntity.userId = user.id;

    const product = await this.productRepository.save(productEntity);

    return this.productMapper.toResponse(product);
  }

  async listAllProducts({
    page,
    limit,
  }: PaginationQuery): Promise<{ products: ProductDTO[]; pagination: Pagination }> {
    const [products, total] = await this.productRepository.findAllProducts(page, limit);

    return {
      products: products.map((product) => this.productMapper.toResponse(product)),
      pagination: new Pagination(page, limit, total, Math.ceil(total / limit)),
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

    const productMapperUpdate = this.productMapper.update(product, dto);
    const updatedProduct = await this.productRepository.save(productMapperUpdate);
    return this.productMapper.toResponse(updatedProduct);
  }

  async deleteProduct(req: Request, user: UserEntity, productId: string): Promise<void> {
    const product = await this.findProductById(productId, req);

    this.ensureProductOwnership(user.id, req, product);

    await this.productRepository.delete(product);
  }

  private ensureProductOwnership(userId: string, req: Request, product: ProductEntity): void {
    if (userId !== product.user.id) {
      this.logger.warn({
        message: "User attempted to manipulate a product they do not own.",
        path: req.path,
        class: ProductService.name,
        method: this.ensureProductOwnership.name,
        data: {
          userId,
          productId: product.id,
          ownerId: product.user.id,
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
