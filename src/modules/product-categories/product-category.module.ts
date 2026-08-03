import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import { ProductCategoryRepository } from "@/modules/product-categories/product-category.repository";
import { CategoryModule } from "@/modules/categories/category.module";
import { ProductModule } from "@/modules/products/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity]), CategoryModule, ProductModule],
  providers: [ProductCategoryRepository],
  exports: [ProductCategoryRepository],
})
export class ProductCategoryModule {}
