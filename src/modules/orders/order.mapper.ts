import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { CreateOrderDTO } from "@/modules/orders/dto/create-order.dto";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { OrderDTO } from "@/modules/orders/dto/order.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderMapper {
  toResponse(entity: OrderEntity): OrderDTO {
    const orderDTO = new OrderDTO();
    orderDTO.id = entity.id;
    orderDTO.items = entity.items.map(({ id, quantity, unitPrice }) => ({
      id,
      quantity,
      unitPrice,
    }));

    return orderDTO;
  }

  toEntity(dto: CreateOrderDTO): OrderEntity {
    const orderEntity = new OrderEntity();
    orderEntity.items = dto.items.map(({ productId, quantity }) => {
      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.order = orderEntity;
      orderItemEntity.product.id = productId;
      orderItemEntity.quantity = quantity;
      return orderItemEntity;
    });

    return orderEntity;
  }
}
