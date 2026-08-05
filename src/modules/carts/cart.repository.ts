import { CartEntity } from "@/modules/carts/cart.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly repository: Repository<CartEntity>,
  ) {}

  async save(entity: DeepPartial<CartEntity>): Promise<CartEntity> {
    return await this.repository.save(entity);
  }

  async findByUserId(userId: string): Promise<CartEntity | null> {
    return await this.repository.findOneBy({ userId });
  }

  async delete(entity: CartEntity): Promise<void> {
    await this.repository.delete(entity);
  }
}
