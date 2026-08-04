import { ProductImageMapper } from "@/common/mappers/product-image.mapper";
import { UserPictureMapper } from "@/common/mappers/user-picture.mapper";
import { InventoryMapper } from "@/common/mappers/inventory.mapper";
import { CategoryMapper } from "@/common/mappers/category.mapper";
import { ProductMapper } from "@/common/mappers/product.mapper";
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
    OrderMapper,
    RoleMapper,
    UserMapper,
    InventoryMapper,
  ],
  exports: [
    ProductImageMapper,
    UserPictureMapper,
    CategoryMapper,
    ProductMapper,
    OrderMapper,
    RoleMapper,
    UserMapper,
    InventoryMapper,
  ],
})
export class MapperModule {}
