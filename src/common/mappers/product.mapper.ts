import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { UpdateProductDTO } from "@/modules/products/dto/update-product.dto";
import { ProductImageMapper } from "@/common/mappers/product-image.mapper";
import { InventoryMapper } from "@/common/mappers/inventory.mapper";
import { ProductEntity } from "@/modules/products/product.entity";
import { CategoryMapper } from "@/common/mappers/category.mapper";
import { ProductDTO } from "@/modules/products/dto/product.dto";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class ProductMapper {
  constructor(
    private readonly productImageMapper: ProductImageMapper,
    private readonly inventoryMapper: InventoryMapper,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  toResponse(entity: ProductEntity): ProductDTO {
    const dto = new ProductDTO();
    dto.id = entity.id;
    dto.sku = entity.sku;
    dto.slug = entity.slug;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.brand = entity.brand;
    dto.attributes = entity.attributes;
    dto.inventory = this.inventoryMapper.toResponse(entity.inventory);

    dto.categories = entity.categories.map(({ category }) => {
      return this.categoryMapper.toResponse(category);
    });

    dto.images = entity.images.map((imageEntity) => {
      return this.productImageMapper.toResponse(imageEntity);
    });

    return dto;
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
