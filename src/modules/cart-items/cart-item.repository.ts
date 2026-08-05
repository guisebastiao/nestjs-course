import { CartItemEntity } from "@/modules/cart-items/cart-item.entity";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

export class CartItemRepository {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly repository: Repository<CartItemEntity>,
  ) {}

  async save(entity: DeepPartial<CartItemEntity>): Promise<CartItemEntity> {
    return await this.repository.save(entity);
  }

  async findItemsByUserId(
    userId: string,
    params: PaginationQuery,
  ): Promise<[CartItemEntity[], number]> {
    const skip = (params.page - 1) * params.limit;

    return await this.repository.findAndCount({
      where: {
        cart: {
          userId,
        },
      },
      order: {
        createdAt: "ASC",
      },
      skip,
      take: params.limit,
    });
  }

  async findByIdAndUser(id: string, userId: string): Promise<CartItemEntity | null> {
    return await this.repository.findOneBy({
      id,
      cart: {
        userId,
      },
    });
  }

  async delete(entity: CartItemEntity): Promise<void> {
    await this.repository.delete(entity.id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.repository.delete({
      cart: {
        userId,
      },
    });
  }
}
