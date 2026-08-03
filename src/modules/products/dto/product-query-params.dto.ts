import { PaginationQuery } from "@/common/dto/pagination-query";
import { toUpperCase } from "@/common/utils/to-upper-case";
import { Transform, Type } from "class-transformer";
import { toArray } from "@/common/utils/toArray";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

const PRODUCT_SORT_FIELDS = ["NAME", "PRICE", "CREATED"] as const;

export class ProductQueryParams extends PaginationQuery {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  search?: string;

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  @IsArray()
  @IsUUID(undefined, { each: true })
  categories?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => toUpperCase(value))
  @IsIn(PRODUCT_SORT_FIELDS)
  sort: (typeof PRODUCT_SORT_FIELDS)[number] = "CREATED";

  @IsOptional()
  @Transform(({ value }) => toUpperCase(value))
  @IsIn(["ASC", "DESC"])
  order: "ASC" | "DESC" = "DESC";
}
