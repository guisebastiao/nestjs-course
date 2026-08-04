import { InventoryRepository } from "@/modules/inventories/inventory.repository";
import { InventoryEntity } from "@/modules/inventories/inventory.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity])],
  providers: [InventoryRepository],
  exports: [InventoryRepository],
})
export class InventoriesModule {}
