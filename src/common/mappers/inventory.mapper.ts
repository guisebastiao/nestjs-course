import { InventoryDTO } from "@/modules/inventories/dto/inventory.dto";
import { InventoryEntity } from "@/modules/inventories/inventory.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoryMapper {
  toResponse(entity: InventoryEntity): InventoryDTO {
    const dto = new InventoryDTO();
    dto.id = entity.id;
    dto.quantityAvailable = entity.quantityAvailable;
    return dto;
  }
}
