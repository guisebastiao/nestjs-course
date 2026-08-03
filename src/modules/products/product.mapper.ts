import { ProductImageDTO } from "@/modules/product-image/dto/product-image.dto";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductEntity } from "@/modules/products/product.entity";
import { CategoryDTO } from "@/modules/categories/dto/category.dto";
import { StorageService } from "@/common/storage/storage.service";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class ProductMapper {
  constructor(private readonly storageService: StorageService) {}

  toResponse(entity: ProductEntity): ProductDTO {
    const productDTO = new ProductDTO();
    productDTO.id = entity.id;
    productDTO.sku = entity.sku;
    productDTO.slug = entity.slug;
    productDTO.name = entity.name;
    productDTO.description = entity.description;
    productDTO.price = entity.price;
    productDTO.brand = entity.brand;
    productDTO.attributes = entity.attributes;

    productDTO.categories = entity.categories.map(({ category }) => {
      const dto = new CategoryDTO();
      dto.id = category.id;
      dto.slug = category.slug;
      dto.name = category.name;
      dto.description = category.description;
      return dto;
    });

    productDTO.images = entity.images.map((image) => {
      const dto = new ProductImageDTO();
      dto.id = image.id;
      dto.url = this.storageService.getUrl(image.path);
      dto.position = image.position;
      dto.altText = image.altText;
      return dto;
    });
    return productDTO;
  }

  toEntity(dto: CreateProductDTO): ProductEntity {
    const entity = new ProductEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    entity.price = dto.price;
    entity.brand = dto.brand;
    entity.attributes = dto.attributes;
    return entity;
  }

  update(entity: ProductEntity, newData: UpdateProductDTO): DeepPartial<ProductEntity> {
    return Object.assign(entity, newData);
  }
}
