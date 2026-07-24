import { ProductModule } from "@/modules/products/product.module";
import { AppCacheModule } from "@/common/cache/app-cache.module";
import { LoggerModule } from "@/common/logger/logger.module";
import { DatabaseConfig } from "@/database/database.config";
import { OrderModule } from "@/modules/orders/order.module";
import { UserModule } from "@/modules/users/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthGuard } from "@/common/guards/auth.guard";
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
    AppCacheModule,
    LoggerModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
