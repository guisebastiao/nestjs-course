import { CartRepository } from "@/modules/carts/cart.repository";
import { CartEntity } from "@/modules/carts/cart.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  providers: [CartRepository],
  exports: [CartRepository],
})
export class CartModule {}
