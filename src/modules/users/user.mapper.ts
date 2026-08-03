import { UpdateUserDTO } from "@/modules/users/dto/update-user.dto";
import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { UserEntity } from "@/modules/users/user.entity";
import { UserDTO } from "@/modules/users/dto/user.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class UserMapper {
  toResponse(entity: UserEntity): UserDTO {
    const userDTO = new UserDTO();
    userDTO.id = entity.id;
    userDTO.name = entity.name;
    return userDTO;
  }

  toEntity(dto: CreateUserDTO): UserEntity {
    const userEntity = new UserEntity();
    userEntity.name = dto.name;
    userEntity.email = dto.email;
    userEntity.password = dto.password;
    return userEntity;
  }

  update(entity: UserEntity, newData: UpdateUserDTO): DeepPartial<UserEntity> {
    return Object.assign(entity, newData);
  }
}
