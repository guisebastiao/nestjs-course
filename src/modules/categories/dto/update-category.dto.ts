import { CreateCategoryDTO } from "@/modules/categories/dto/create-category.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
