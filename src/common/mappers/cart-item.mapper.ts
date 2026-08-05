import { UpdateCartItemDTO } from "@/modules/cart-items/dto/update-cart-item.dto";
import { CartItemEntity } from "@/modules/cart-items/cart-item.entity";
import { CartItemDTO } from "@/modules/cart-items/dto/cart-item.dto";
import { ProductMapper } from "@/common/mappers/product.mapper";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class CartItemMapper {
  constructor(private readonly productMapper: ProductMapper) {}

  toResponse(entity: CartItemEntity): CartItemDTO {
    const dto = new CartItemDTO();
    dto.id = entity.id;
    dto.quantity = entity.quantity;
    dto.product = this.productMapper.toResponse(entity.product);
    return dto;
  }

  update(entity: CartItemEntity, newData: UpdateCartItemDTO): DeepPartial<CartItemEntity> {
    return Object.assign(entity, newData);
  }
}
