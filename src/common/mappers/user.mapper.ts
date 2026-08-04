import { UpdateUserDTO } from "@/modules/users/dto/update-user.dto";
import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { StorageService } from "@/common/storage/storage.service";
import { UserEntity } from "@/modules/users/user.entity";
import { UserDTO } from "@/modules/users/dto/user.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class UserMapper {
  constructor(private readonly storageService: StorageService) {}

  toResponse(entity: UserEntity): UserDTO {
    const dto = new UserDTO();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.picture = entity.picture
      ? {
          id: entity.picture.id,
          url: this.storageService.getUrl(entity.picture.path),
          altText: entity.picture.altText,
        }
      : null;

    return dto;
  }

  toEntity(dto: CreateUserDTO): UserEntity {
    const entity = new UserEntity();
    entity.name = dto.name;
    entity.email = dto.email;
    entity.password = dto.password;
    return entity;
  }

  update(entity: UserEntity, newData: UpdateUserDTO): DeepPartial<UserEntity> {
    return Object.assign(entity, newData);
  }
}
