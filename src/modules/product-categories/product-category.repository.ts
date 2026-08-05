import { ProductCategoryEntity } from "./product-category.entity";
import { CacheService } from "@/common/cache/app-cache.service";
import { CACHE } from "@/common/cache/app-cache.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly repository: Repository<ProductCategoryEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async save(entity: DeepPartial<ProductCategoryEntity>): Promise<ProductCategoryEntity> {
    const saved = await this.repository.save(entity);
    await this.invalidateProductCaches(saved.productId);
    return saved;
  }

  async findByProductAndCategory(
    productId: string,
    categoryId: string,
  ): Promise<ProductCategoryEntity | null> {
    return await this.repository.findOneBy({ productId, categoryId });
  }

  async delete(entity: ProductCategoryEntity): Promise<void> {
    await this.repository.delete(entity.id);
  }

  private async invalidateProductCaches(productId: string): Promise<void> {
    await this.cacheService.deleteByPrefix(CACHE.PRODUCT.PRODUCT_LIST_CACHE_PREFIX);
    await this.cacheService.delete(`${CACHE.PRODUCT.PRODUCT_CACHE_PREFIX}${productId}`);
  }
}
