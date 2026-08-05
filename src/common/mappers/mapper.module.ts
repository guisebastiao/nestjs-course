import { ProductImageMapper } from "@/common/mappers/product-image.mapper";
import { UserPictureMapper } from "@/common/mappers/user-picture.mapper";
import { InventoryMapper } from "@/common/mappers/inventory.mapper";
import { CartItemMapper } from "@/common/mappers/cart-item.mapper";
import { CategoryMapper } from "@/common/mappers/category.mapper";
import { ProductMapper } from "@/common/mappers/product.mapper";
import { AddressMapper } from "@/common/mappers/address.mapper";
import { OrderMapper } from "@/common/mappers/order.mapper";
import { RoleMapper } from "@/common/mappers/role.mapper";
import { UserMapper } from "@/common/mappers/user.mapper";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [
    ProductImageMapper,
    UserPictureMapper,
    CategoryMapper,
    ProductMapper,
    AddressMapper,
    OrderMapper,
    RoleMapper,
    UserMapper,
    InventoryMapper,
    CartItemMapper,
  ],
  exports: [
    ProductImageMapper,
    UserPictureMapper,
    CategoryMapper,
    ProductMapper,
    AddressMapper,
    OrderMapper,
    RoleMapper,
    UserMapper,
    InventoryMapper,
    CartItemMapper,
  ],
})
export class MapperModule {}
