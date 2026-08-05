import { CartItemsController } from "@/modules/cart-items/cart-item.controller";
import { CartItemRepository } from "@/modules/cart-items/cart-item.repository";
import { CartItemService } from "@/modules/cart-items/cart-item.service";
import { CartItemEntity } from "@/modules/cart-items/cart-item.entity";
import { ProductModule } from "@/modules/products/product.module";
import { CartModule } from "@/modules/carts/cart.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity]), CartModule, ProductModule],
  controllers: [CartItemsController],
  providers: [CartItemService, CartItemRepository],
  exports: [CartItemRepository],
})
export class CartItemsModule {}
