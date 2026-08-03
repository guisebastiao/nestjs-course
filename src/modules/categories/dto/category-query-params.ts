import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { toUpperCase } from "@/common/utils/to-upper-case";
import { Transform } from "class-transformer";

export class CategoryQueryParams extends PaginationQuery {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  search?: string;

  @IsOptional()
  @Transform(({ value }) => toUpperCase(value))
  @IsIn(["ASC", "DESC"])
  order: "ASC" | "DESC" = "ASC";
}
