import { CreateRoleDTO } from "@/modules/roles/dto/create-role.dto";
import { UpdateRoleDTO } from "@/modules/roles/dto/update-role.dto";
import { RoleEntity } from "@/modules/roles/role.entity";
import { RoleDTO } from "@/modules/roles/dto/role.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class RoleMapper {
  toResponse(entity: RoleEntity): RoleDTO {
    const roleDTO = new RoleDTO();
    roleDTO.id = entity.id;
    roleDTO.name = entity.name;
    roleDTO.description = entity.description;
    return roleDTO;
  }

  toEntity(dto: CreateRoleDTO): RoleEntity {
    const roleEntity = new RoleEntity();
    roleEntity.name = dto.name;
    roleEntity.description = dto.description;
    return roleEntity;
  }

  update(entity: RoleEntity, newData: UpdateRoleDTO): DeepPartial<RoleEntity> {
    return Object.assign(entity, newData);
  }
}
