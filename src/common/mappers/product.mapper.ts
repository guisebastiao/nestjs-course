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
    const productDTO = new ProductDTO();
    productDTO.id = entity.id;
    productDTO.sku = entity.sku;
    productDTO.slug = entity.slug;
    productDTO.name = entity.name;
    productDTO.description = entity.description;
    productDTO.price = entity.price;
    productDTO.brand = entity.brand;
    productDTO.attributes = entity.attributes;
    productDTO.inventory = this.inventoryMapper.toResponse(entity.inventory);

    productDTO.categories = entity.categories.map(({ category }) => {
      return this.categoryMapper.toResponse(category);
    });

    productDTO.images = entity.images.map((imageEntity) => {
      return this.productImageMapper.toResponse(imageEntity);
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
