import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { ProductImageDTO } from "@/modules/product-image/dto/product-image.dto";
import { StorageService } from "@/common/storage/storage.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductImageMapper {
  constructor(private readonly storageService: StorageService) {}

  toResponse(entity: ProductImageEntity): ProductImageDTO {
    const dto = new ProductImageDTO();
    dto.id = entity.id;
    dto.position = entity.position;
    dto.altText = entity.altText;
    dto.url = this.storageService.getUrl(entity.path);
    return dto;
  }
}
