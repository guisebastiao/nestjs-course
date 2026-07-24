import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { OrderRepository } from "@/modules/orders/order.repository";
import { OrderController } from "@/modules/orders/order.controller";
import { ProductModule } from "@/modules/products/product.module";
import { OrderService } from "@/modules/orders/order.service";
import { OrderMapper } from "@/modules/orders/order.mapper";
import { UserModule } from "@/modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]), UserModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderMapper],
  exports: [OrderRepository],
})
export class OrderModule {}
