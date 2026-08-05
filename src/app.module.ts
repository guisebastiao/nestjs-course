import { ProductCategoryModule } from "@/modules/product-categories/product-category.module";
import { RecoverPasswordModule } from "@/modules/recover-passwords/recover-password.module";
import { UserPictureModule } from "@/modules/user-picture/user-picture.module";
import { InventoriesModule } from "@/modules/inventories/inventory.module";
import { CartItemsModule } from "@/modules/cart-items/cart-item.module";
import { UserRoleModule } from "@/modules/user-roles/user-role.module";
import { CategoryModule } from "@/modules/categories/category.module";
import { AddressModule } from "@/modules/addresses/address.module";
import { RefreshModule } from "@/modules/refreshes/refresh.module";
import { ProductModule } from "@/modules/products/product.module";
import { AppCacheModule } from "@/common/cache/app-cache.module";
import { StorageModule } from "@/common/storage/storage.module";
import { CookieModule } from "@/common/cookies/cookie.module";
import { MapperModule } from "@/common/mappers/mapper.module";
import { LoggerModule } from "@/common/logger/logger.module";
import { DatabaseConfig } from "@/database/database.config";
import { OrderModule } from "@/modules/orders/order.module";
import { UserModule } from "@/modules/users/user.module";
import { CartModule } from "@/modules/carts/cart.module";
import { RoleModule } from "@/modules/roles/role.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "@/common/guards/auth.guard";
import { MailModule } from "@/common/mail/mail.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TokenModule } from "@/modules/tokens/token.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
      inject: [DatabaseConfig],
    }),
    StorageModule,
    AppCacheModule,
    LoggerModule,
    MapperModule,
    AuthModule,
    TokenModule,
    RecoverPasswordModule,
    UserModule,
    ProductModule,
    CategoryModule,
    ProductCategoryModule,
    OrderModule,
    MailModule,
    RefreshModule,
    CookieModule,
    RoleModule,
    UserRoleModule,
    UserPictureModule,
    InventoriesModule,
    AddressModule,
    CartModule,
    CartItemsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
