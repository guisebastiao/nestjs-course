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

  async save(productCategory: DeepPartial<ProductCategoryEntity>): Promise<ProductCategoryEntity> {
    const saved = await this.repository.save(productCategory);

    await this.invalidateProductCaches(saved.productId);

    return saved;
  }

  async findByProductAndCategory(
    productId: string,
    categoryId: string,
  ): Promise<ProductCategoryEntity | null> {
    return await this.repository.findOneBy({ productId, categoryId });
  }

  async delete(productCategory: ProductCategoryEntity): Promise<void> {
    await this.repository.delete(productCategory.id);
    await this.repository.delete(productCategory);
  }

  private async invalidateProductCaches(productId: string): Promise<void> {
    await this.cacheService.deleteByPrefix(CACHE.PRODUCT.PRODUCT_LIST_CACHE_PREFIX);
    await this.cacheService.delete(`${CACHE.PRODUCT.PRODUCT_CACHE_PREFIX}${productId}`);
  }
}
