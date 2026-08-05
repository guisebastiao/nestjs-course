import { UpdateCartItemDTO } from "@/modules/cart-items/dto/update-cart-item.dto";
import { AddCartItemDTO } from "@/modules/cart-items/dto/add-cart-item.dto";
import { CartItemService } from "@/modules/cart-items/cart-item.service";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { UserEntity } from "@/modules/users/user.entity";
import type { Request } from "express";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

@Controller("/cart-items")
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @AuthUser() user: UserEntity, @Body() dto: AddCartItemDTO) {
    const data = await this.cartItemsService.addCartItem(req, user, dto);
    return SuccessResponse.of(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@AuthUser() user: UserEntity, @Query() params: PaginationQuery) {
    const data = await this.cartItemsService.findAllItems(user, params);
    return SuccessResponse.of(data);
  }

  @Patch(":cartItemId")
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Param("cartItemId") cartItemId: string,
    @Body() dto: UpdateCartItemDTO,
  ) {
    const data = await this.cartItemsService.update(req, user, cartItemId, dto);
    SuccessResponse.of(data);
  }

  @Delete("/:itemId")
  @HttpCode(HttpStatus.OK)
  async removeCartItem(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Param("cartItemId") cartItemId: string,
  ) {
    await this.cartItemsService.removeCartItem(req, user, cartItemId);
    SuccessResponse.of();
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeAllItems(@AuthUser() user: UserEntity) {
    await this.cartItemsService.removeAllItems(user);
    SuccessResponse.of();
  }
}
