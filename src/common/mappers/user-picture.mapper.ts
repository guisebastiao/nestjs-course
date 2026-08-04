import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { UserPictureDTO } from "@/modules/user-picture/dto/user-picture.dto";
import { StorageService } from "@/common/storage/storage.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserPictureMapper {
  constructor(private readonly storageService: StorageService) {}

  toResponse(entity: UserPictureEntity): UserPictureDTO {
    const dto = new UserPictureDTO();
    dto.id = entity.id;
    dto.url = this.storageService.getUrl(entity.path);
    dto.altText = entity.altText;
    return dto;
  }
}
