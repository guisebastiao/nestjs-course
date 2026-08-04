import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { CreateOrderDTO } from "@/modules/orders/dto/create-order.dto";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { OrderDTO } from "@/modules/orders/dto/order.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderMapper {
  toResponse(entity: OrderEntity): OrderDTO {
    const dto = new OrderDTO();
    dto.id = entity.id;
    dto.items = entity.items.map(({ id, quantity, unitPrice }) => ({
      id,
      quantity,
      unitPrice,
    }));

    return dto;
  }

  toEntity(dto: CreateOrderDTO): OrderEntity {
    const entity = new OrderEntity();
    entity.items = dto.items.map(({ productId, quantity }) => {
      const itemEntity = new OrderItemEntity();
      itemEntity.order = entity;
      itemEntity.product.id = productId;
      itemEntity.quantity = quantity;
      return itemEntity;
    });

    return entity;
  }
}
