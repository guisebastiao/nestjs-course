import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductService } from "@/modules/products/product.service";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { SuccessResponse } from "@/common/dto/success-response";
import { Public } from "@/common/decorators/auth.decorator";
import { ListResponse } from "@/common/dto/list-response";
import { type Request } from "express";
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

@Controller("/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@AuthUser() user: UserEntity, @Body() dto: CreateProductDTO) {
    const data = await this.productService.createProduct(user, dto);
    return SuccessResponse.of(data);
  }

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  async listAllProducts(@Query() paginationQuery: PaginationQuery) {
    const { products, pagination } = await this.productService.listAllProducts(paginationQuery);
    const data = ListResponse.of(products, pagination);
    return SuccessResponse.of(data);
  }

  @Patch("/:id")
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Param("id") id: string,
    @Body() dto: UpdateProductDTO,
  ) {
    const data = await this.productService.updateProduct(req, user, id, dto);
    return SuccessResponse.of(data);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Req() req: Request, @AuthUser() user: UserEntity, @Param("id") id: string) {
    await this.productService.deleteProduct(req, user, id);
    return SuccessResponse.of();
  }
}
