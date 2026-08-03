import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { DeepPartial, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly repository: Repository<ProductImageEntity>,
  ) {}

  async saveAll(productImages: DeepPartial<ProductImageEntity>[]): Promise<ProductImageEntity[]> {
    return await this.repository.save(productImages);
  }

  async findAllByIds(ids: string[]): Promise<ProductImageEntity[]> {
    return this.repository.findBy({
      id: In(ids),
    });
  }

  async findAllByProductId(productId: string): Promise<ProductImageEntity[]> {
    return await this.repository.findBy({
      product: {
        id: productId,
      },
    });
  }

  async delete(productImages: ProductImageEntity[]): Promise<void> {
    await this.repository.delete(productImages);
  }
}
