import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { createKeyv } from "@keyv/redis";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [createKeyv(config.getOrThrow<string>("REDIS_URL"))],
      }),
    }),
  ],
})
export class AppCacheModule {}
