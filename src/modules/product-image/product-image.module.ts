import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { ProductModule } from "@/modules/products/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageEntity]), ProductModule],
})
export class ProductImageModule {}
