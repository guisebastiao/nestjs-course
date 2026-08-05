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

  async findByProductId(productId): Promise<CartItemEntity | null> {
    return await this.repository.findOneBy({ productId });
  }

  async findById(cartItemId: string): Promise<CartItemEntity | null> {
    return await this.repository.findOne({
      where: {
        id: cartItemId,
      },
      relations: {
        product: {
          images: true,
          inventory: true,
          categories: {
            category: true,
          },
        },
      },
    });
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
      relations: {
        product: {
          images: true,
          inventory: true,
          categories: {
            category: true,
          },
        },
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
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(CartItemEntity)
      .where(`cart_id IN (SELECT id FROM carts WHERE user_id = :userId)`, { userId })
      .execute();
  }
}
