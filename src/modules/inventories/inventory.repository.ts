import { InventoryEntity } from "@/modules/inventories/inventory.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

export class InventoryRepository {
  constructor(
    @InjectRepository(InventoryEntity)
    private readonly repository: Repository<InventoryEntity>,
  ) {}

  async save(entity: DeepPartial<InventoryEntity>): Promise<InventoryEntity> {
    return await this.repository.save(entity);
  }
}
