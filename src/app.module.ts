import { ProductCategoryModule } from "@/modules/product-categories/product-category.module";
import { RecoverPasswordModule } from "@/modules/recover-passwords/recover-password.module";
import { UserRoleModule } from "@/modules/user-roles/user-role.module";
import { CategoryModule } from "@/modules/categories/category.module";
import { RefreshModule } from "@/modules/refreshes/refresh.module";
import { ProductModule } from "@/modules/products/product.module";
import { AppCacheModule } from "@/common/cache/app-cache.module";
import { StorageModule } from "@/common/storage/storage.module";
import { CookieModule } from "@/common/cookies/cookie.module";
import { LoggerModule } from "@/common/logger/logger.module";
import { DatabaseConfig } from "@/database/database.config";
import { OrderModule } from "@/modules/orders/order.module";
import { TokenModule } from "@/common/tokens/token.module";
import { UserModule } from "@/modules/users/user.module";
import { RoleModule } from "@/modules/roles/role.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "@/common/guards/auth.guard";
import { MailModule } from "@/common/mail/mail.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";

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
    AuthModule,
    RecoverPasswordModule,
    UserModule,
    ProductModule,
    CategoryModule,
    ProductCategoryModule,
    OrderModule,
    MailModule,
    RefreshModule,
    TokenModule,
    CookieModule,
    RoleModule,
    UserRoleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
