import { CacheService } from "@/common/cache/app-cache.service";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createKeyv } from "@keyv/redis";

@Global()
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
  providers: [CacheService],
  exports: [CacheService],
})
export class AppCacheModule {}
