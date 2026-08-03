import { CategoryEntity } from "@/modules/categories/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, In, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async save(category: DeepPartial<CategoryEntity>): Promise<CategoryEntity> {
    return await this.repository.save(category);
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

  async findAll(
    page: number,
    limit: number,
    order: "ASC" | "DESC",
  ): Promise<[CategoryEntity[], number]> {
    const skip = (page - 1) * limit;

    return await this.repository.findAndCount({
      take: limit,
      skip,
      order: {
        name: order,
      },
    });
  }

  async delete(category: CategoryEntity): Promise<void> {
    await this.repository.delete(category.id);
  }
}
