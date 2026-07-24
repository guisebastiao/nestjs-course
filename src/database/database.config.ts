import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { databaseOptions } from "@/database/database-options";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return databaseOptions;
  }
}
