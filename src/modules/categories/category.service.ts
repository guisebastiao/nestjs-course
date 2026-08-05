import { CategoryQueryParams } from "@/modules/categories/dto/category-query-params";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDTO } from "@/modules/categories/dto/create-category.dto";
import { UpdateCategoryDTO } from "@/modules/categories/dto/update-category.dto";
import { CategoryRepository } from "@/modules/categories/category.repository";
import { CategoryDTO } from "@/modules/categories/dto/category.dto";
import { CategoryMapper } from "@/common/mappers/category.mapper";
import { LoggerService } from "@/common/logger/logger.service";
import { Pagination } from "@/common/dto/pagination";
import { toSlug } from "@/common/utils/to-slug";
import { Request } from "express";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryMapper: CategoryMapper,
    private readonly logger: LoggerService,
  ) {}

  async create(req: Request, dto: CreateCategoryDTO): Promise<CategoryDTO> {
    const slug = toSlug(dto.name);

    const existsCategory = await this.categoryRepository.findBySlug(slug);

    if (existsCategory) {
      this.logger.warn({
        message: "Category already exists.",
        path: req.path,
        class: CategoryService.name,
        method: this.create.name,
        data: { slug },
      });

      throw new ConflictException("Category already exists.");
    }

    const category = this.categoryMapper.toEntity(dto);
    category.slug = slug;

    const saved = await this.categoryRepository.save(category);

    return this.categoryMapper.toResponse(saved);
  }

  async findAll(
    params: CategoryQueryParams,
  ): Promise<{ categories: CategoryDTO[]; pagination: Pagination }> {
    const [categories, total] = await this.categoryRepository.findAll(params);

    return {
      categories: categories.map((category) => this.categoryMapper.toResponse(category)),
      pagination: new Pagination(params.page, params.limit, total, Math.ceil(total / params.limit)),
    };
  }

  async update(req: Request, categoryId: string, dto: UpdateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      this.logger.warn({
        message: "Category not found during category update",
        path: req.path,
        class: CategoryService.name,
        method: this.update.name,
        data: { categoryId },
      });

      throw new NotFoundException("Category not found.");
    }

    const updated = this.categoryMapper.update(category, dto);

    if (dto.name) {
      const slug = toSlug(dto.name);

      const existsCategory = await this.categoryRepository.findBySlug(slug);

      if (existsCategory) {
        this.logger.warn({
          message: "Category already exists in update category.",
          path: req.path,
          class: CategoryService.name,
          method: this.create.name,
          data: { slug },
        });

        throw new ConflictException("Category already exists.");
      }

      updated.slug = slug;
    }

    const saved = await this.categoryRepository.save(updated);

    return this.categoryMapper.toResponse(saved);
  }

  async delete(req: Request, categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      this.logger.warn({
        message: "Category not found during category update",
        path: req.path,
        class: CategoryService.name,
        method: this.update.name,
        data: { categoryId },
      });

      throw new NotFoundException("Category not found.");
    }

    await this.categoryRepository.softRemove(category);
  }
}
