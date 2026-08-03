import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { CreateOrderDTO } from "@/modules/orders/dto/create-order.dto";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { UserEntity } from "@/modules/users/user.entity";
import { SuccessResponse } from "@/common/dto/success-response";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { OrderService } from "@/modules/orders/order.service";
import { ListResponse } from "@/common/dto/list-response";
import { type Request } from "express";

@Controller("/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Body() dto: CreateOrderDTO,
  ) {
    const data = await this.orderService.createOrder(req, user, dto);
    return SuccessResponse.of(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllOrders(@AuthUser() user: UserEntity, @Query() paginationQuery: PaginationQuery) {
    const { orders, pagination } = await this.orderService.findAllOrders(user, paginationQuery);
    const data = ListResponse.of(orders, pagination);
    return SuccessResponse.of(data);
  }
}
