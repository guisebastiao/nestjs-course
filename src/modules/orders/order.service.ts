import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { ProductRepository } from "@/modules/products/product.repository";
import { CreateOrderDTO } from "@/modules/orders/dto/create-order.dto";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { OrderRepository } from "@/modules/orders/order.repository";
import { UserEntity } from "@/modules/users/user.entity";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { LoggerService } from "@/common/logger/logger.service";
import { OrderMapper } from "@/modules/orders/order.mapper";
import { OrderDTO } from "@/modules/orders/dto/order.dto";
import { Pagination } from "@/common/dto/pagination";
import { Request } from "express";

@Injectable()
export class OrderService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly OrderRepository: OrderRepository,
    private readonly orderMapper: OrderMapper,
    private readonly logger: LoggerService,
  ) {}

  async createOrder(req: Request, user: UserEntity, { items }: CreateOrderDTO): Promise<OrderDTO> {
    const productsIds = items.map((item) => item.productId);

    const products = await this.productRepository.findProductsByIds(productsIds);

    if (products.length !== productsIds.length) {
      this.logger.warn({
        message: "Order creation failed: one or more requested products were not found.",
        path: req.path,
        class: OrderService.name,
        method: this.createOrder.name,
        data: {
          requestedProductIds: productsIds,
          foundProducts: products.map((p) => p.id),
        },
      });

      throw new NotFoundException("One or more products were not found.");
    }

    const productsMap = new Map(products.map((product) => [product.id, product]));

    // const orderItems: OrderItemEntity[] = items.map(({ productId, quantity }) => {
    //   const product = productsMap.get(productId);

    //   if (!product) {
    //     this.logger.warn({
    //       message:
    //         "Order creation failed: product was not found in the loaded products collection.",
    //       path: req.path,
    //       class: OrderService.name,
    //       method: this.createOrder.name,
    //       data: { productId },
    //     });

    //     throw new NotFoundException("Product not found.");
    //   }

    //   if (product.availableQuantity < quantity) {
    //     this.logger.warn({
    //       message: "Order creation failed: insufficient stock for requested product.",
    //       path: req.path,
    //       class: OrderService.name,
    //       method: this.createOrder.name,
    //       data: {
    //         productId: product.id,
    //         requestedQuantity: quantity,
    //         availableQuantity: product.availableQuantity,
    //       },
    //     });

    //     throw new ConflictException("One or more products do not have sufficient stock.");
    //   }

    //   product.availableQuantity -= quantity;

    //   const item = new OrderItemEntity();
    //   item.productId = product.id;
    //   item.quantity = quantity;
    //   item.unitPrice = product.price;

    //   return item;
    // });

    await this.productRepository.saveAll(products);

    const order = new OrderEntity();
    order.userId = user.id;
    // order.items = orderItems;

    const newOrder = await this.OrderRepository.save(order);

    this.logger.log({
      message: "Order created successfully.",
      path: req.path,
      class: OrderService.name,
      method: this.createOrder.name,
      data: {
        orderId: newOrder.id,
        userId: user.id,
      },
    });

    return this.orderMapper.toResponse(newOrder);
  }

  async findAllOrders(
    user: UserEntity,
    { page, limit }: PaginationQuery,
  ): Promise<{ orders: OrderDTO[]; pagination: Pagination }> {
    const [orders, total] = await this.OrderRepository.findAllByUser(user.id, page, limit);

    return {
      orders: orders.map((order) => this.orderMapper.toResponse(order)),
      pagination: new Pagination(page, limit, total, Math.ceil(total / limit)),
    };
  }
}
