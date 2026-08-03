import { CategoryEntity } from "@/modules/categories/category.entity";
import { CategoryController } from "@/modules/categories/category.controller";
import { CategoryRepository } from "@/modules/categories/category.repository";
import { CategoryService } from "@/modules/categories/category.service";
import { CategoryMapper } from "@/modules/categories/category.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryMapper],
  exports: [CategoryRepository],
})
export class CategoryModule {}
