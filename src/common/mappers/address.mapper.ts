import { CreateAddressDTO } from "@/modules/addresses/dto/create-address.dto";
import { UpdateAddressDTO } from "@/modules/addresses/dto/update-address.dto";
import { AddressEntity } from "@/modules/addresses/address.entity";
import { AddressDTO } from "@/modules/addresses/dto/address.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class AddressMapper {
  toResponse(entity: AddressEntity): AddressDTO {
    const dto = new AddressDTO();
    dto.id = entity.id;
    dto.label = entity.label;
    dto.street = entity.street;
    dto.number = entity.number;
    dto.neighborhood = entity.neighborhood;
    dto.city = entity.city;
    dto.state = entity.state;
    dto.country = entity.country;
    dto.complement = entity.complement;
    dto.isDefault = entity.isDefault;
    return dto;
  }

  toEntity(dto: CreateAddressDTO): AddressEntity {
    const entity = new AddressEntity();
    entity.label = dto.label;
    entity.street = dto.street;
    entity.number = dto.number;
    entity.neighborhood = dto.neighborhood;
    entity.city = dto.city;
    entity.state = dto.state;
    entity.country = dto.country;
    entity.complement = dto.complement;
    entity.isDefault = dto.isDefault;
    return entity;
  }

  update(entity: AddressEntity, newData: UpdateAddressDTO): DeepPartial<AddressEntity> {
    return Object.assign(entity, newData);
  }
}
