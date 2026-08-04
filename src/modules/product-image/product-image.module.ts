import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity])],
})
export class ProductImageModule {}
