import { CreateInventoryDTO } from "@/modules/inventories/dto/create-inventory.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateInventoryDTO extends PartialType(CreateInventoryDTO) {}
