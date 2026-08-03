import { CreateCategoryDTO } from "@/modules/categories/dto/create-category.dto";
import { UpdateCategoryDTO } from "@/modules/categories/dto/update-category.dto";
import { CategoryEntity } from "@/modules/categories/category.entity";
import { CategoryDTO } from "@/modules/categories/dto/category.dto";
import { DeepPartial } from "typeorm";

export class CategoryMapper {
  toResponse(entity: CategoryEntity): CategoryDTO {
    const dto = new CategoryDTO();
    dto.id = entity.id;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }

  toEntity(dto: CreateCategoryDTO): CategoryEntity {
    const entity = new CategoryEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  update(entity: CategoryEntity, newData: UpdateCategoryDTO): DeepPartial<CategoryEntity> {
    return Object.assign(entity, newData);
  }
}
