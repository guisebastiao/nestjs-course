import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  async save(order: DeepPartial<OrderEntity>): Promise<OrderEntity> {
    return await this.repository.save(order);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAllByUser(
    userId: string,
    page: number,
    limit: number,
  ): Promise<[OrderEntity[], number]> {
    const skip = (page - 1) * limit;

    return await this.repository.findAndCount({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: true,
      },
      take: limit,
      skip,
    });
  }

  async findAllProducts(skip: number, take: number): Promise<[OrderEntity[], number]> {
    return await this.repository.findAndCount({
      relations: {
        items: true,
      },
      skip,
      take,
    });
  }

  async delete(order: OrderEntity): Promise<void> {
    await this.repository.softDelete(order);
  }
}
