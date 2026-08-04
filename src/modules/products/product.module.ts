import { ProductController } from "@/modules/products/product.controller";
import { ProductRepository } from "@/modules/products/product.repository";
import { CategoryModule } from "@/modules/categories/category.module";
import { ProductService } from "@/modules/products/product.service";
import { ProductEntity } from "@/modules/products/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
