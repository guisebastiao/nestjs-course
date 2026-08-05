import { CategoryQueryParams } from "@/modules/categories/dto/category-query-params";
import { CategoryEntity } from "@/modules/categories/category.entity";
import { DeepPartial, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async save(entity: DeepPartial<CategoryEntity>): Promise<CategoryEntity> {
    return await this.repository.save(entity);
  }

  async findById(categoryId: string): Promise<CategoryEntity | null> {
    return await this.repository.findOneBy({
      id: categoryId,
    });
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    return await this.repository.findOneBy({ slug });
  }

  async findAllByIds(ids: string[]): Promise<CategoryEntity[]> {
    return await this.repository.findBy({
      id: In(ids),
    });
  }

  async findAll(params: CategoryQueryParams): Promise<[CategoryEntity[], number]> {
    const skip = (params.page - 1) * params.limit;

    return await this.repository.findAndCount({
      take: params.limit,
      skip,
      order: {
        name: params.order,
      },
    });
  }

  async softRemove(category: CategoryEntity): Promise<void> {
    await this.repository.softRemove(category);
  }
}
