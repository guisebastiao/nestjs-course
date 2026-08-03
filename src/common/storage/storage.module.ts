import { StorageService } from "@/common/storage/storage.service";
import { MINIO_CLIENT } from "@/common/storage/storage.constants";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "minio";

@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Client({
          endPoint: config.getOrThrow("MINIO_HOST"),
          port: config.getOrThrow<number>("MINIO_PORT"),
          useSSL: config.getOrThrow("MINIO_USE_SSL") === "true",
          accessKey: config.getOrThrow("MINIO_USERNAME"),
          secretKey: config.getOrThrow("MINIO_PASSWORD"),
        }),
    },
    StorageService,
  ],
  exports: [MINIO_CLIENT, StorageService],
})
export class StorageModule {}
