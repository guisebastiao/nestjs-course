import { ProductAttributeEntity } from "@/modules/products/entities/product-attribute.entity";
import { ProductImageEntity } from "@/modules/products/entities/product-image.entity";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductEntity } from "@/modules/products/entities/product.entity";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class ProductMapper {
  toResponse(entity: ProductEntity): ProductDTO {
    const productDTO = new ProductDTO();
    productDTO.id = entity.id;
    productDTO.name = entity.name;
    productDTO.description = entity.description;
    productDTO.price = entity.price;
    productDTO.availableQuantity = entity.availableQuantity;
    productDTO.category = entity.category;
    productDTO.attributes = entity.attributes.map(({ name, description }) => ({
      name,
      description,
    }));
    productDTO.images = entity.images.map(({ url }) => ({ url }));

    return productDTO;
  }

  toEntity(dto: CreateProductDTO): ProductEntity {
    const productEntity = new ProductEntity();
    productEntity.name = dto.name;
    productEntity.description = dto.description;
    productEntity.price = dto.price;
    productEntity.availableQuantity = dto.availableQuantity;
    productEntity.category = dto.category;

    productEntity.attributes = dto.attributes.map(({ name, description }) => {
      const attributeEntity = new ProductAttributeEntity();
      attributeEntity.name = name;
      attributeEntity.description = description;
      return attributeEntity;
    });

    productEntity.images = dto.images.map(({ url }) => {
      const imageEntity = new ProductImageEntity();
      imageEntity.url = url;
      return imageEntity;
    });

    return productEntity;
  }

  update(entity: ProductEntity, newData: UpdateProductDTO): DeepPartial<ProductEntity> {
    return Object.assign(entity, newData);
  }
}
