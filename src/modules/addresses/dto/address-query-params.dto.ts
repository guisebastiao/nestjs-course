import { PaginationQuery } from "@/common/dto/pagination-query";
import { toUpperCase } from "@/common/utils/to-upper-case";
import { IsIn, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class AddressQueryParams extends PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => toUpperCase(value))
  @IsIn(["ASC", "DESC"])
  order: "ASC" | "DESC" = "DESC";
}
