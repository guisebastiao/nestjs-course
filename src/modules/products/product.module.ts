import { ProductAttributeEntity } from "@/modules/products/entities/product-attribute.entity";
import { ProductImageEntity } from "@/modules/products/entities/product-image.entity";
import { ProductEntity } from "@/modules/products/entities/product.entity";
import { ProductController } from "@/modules/products/product.controller";
import { ProductRepository } from "@/modules/products/product.repository";
import { ProductService } from "@/modules/products/product.service";
import { ProductMapper } from "@/modules/products/product.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity, ProductAttributeEntity])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductMapper],
  exports: [ProductRepository],
})
export class ProductModule {}
