import { CategoryQueryParams } from "@/modules/categories/dto/category-query-params";
import { CreateCategoryDTO } from "@/modules/categories/dto/create-category.dto";
import { UpdateCategoryDTO } from "@/modules/categories/dto/update-category.dto";
import { CategoryService } from "@/modules/categories/category.service";
import { DefaultRoleName } from "@/common/types/default-role-names";
import { HasRoles } from "@/common/decorators/has-roles.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import { Public } from "@/common/decorators/auth.decorator";
import { ListResponse } from "@/common/dto/list-response";
import type { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";

@HasRoles(DefaultRoleName.ADMIN)
@Controller("/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() dto: CreateCategoryDTO) {
    const data = await this.categoryService.create(req, dto);
    return SuccessResponse.of(data);
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: CategoryQueryParams) {
    const { categories, pagination } = await this.categoryService.findAll(params);
    const data = ListResponse.of(categories, pagination);
    return SuccessResponse.of(data);
  }

  @Patch("/:categoryId")
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateCategoryDTO,
  ) {
    const data = await this.categoryService.update(req, categoryId, dto);
    return SuccessResponse.of(data);
  }

  @Delete("/:categoryId")
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: Request, @Param("categoryId") categoryId: string) {
    const data = await this.categoryService.delete(req, categoryId);
    return SuccessResponse.of(data);
  }
}
