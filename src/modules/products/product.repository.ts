import { ProductEntity } from "@/modules/products/entities/product.entity";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async save(product: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    return await this.repository.save(product);
  }

  async saveAll(products: DeepPartial<ProductEntity>[]): Promise<ProductEntity[]> {
    return this.repository.save(products);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findProductsByIds(ids: string[]): Promise<ProductEntity[]> {
    const products = await Promise.all(ids.map((id) => this.getCachedProduct(id, false)));
    return products.filter((product): product is ProductEntity => product !== null);
  }

  async findAllProducts(page: number, limit: number): Promise<[ProductEntity[], number]> {
    const pageKey = `products:page:${page}:limit:${limit}`;

    const cached = await this.cacheManager.get<{
      ids: string[];
      total: number;
    }>(pageKey);

    if (cached) {
      const products = await Promise.all(cached.ids.map((id) => this.getCachedProduct(id, true)));

      return [
        products.filter((product): product is ProductEntity => product !== null),
        cached.total,
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await this.repository.findAndCount({
      relations: {
        images: true,
        attributes: true,
      },
      take: limit,
      skip,
    });

    await Promise.all(
      products.map((product) =>
        this.cacheManager.set(`product:${product.id}`, product, 5 * 60 * 1000),
      ),
    );

    await this.cacheManager.set(
      pageKey,
      {
        ids: products.map((product) => product.id),
        total,
      },
      5 * 60 * 1000,
    );

    return [products, total];
  }

  async delete(product: ProductEntity): Promise<void> {
    await this.repository.softDelete({
      id: product.id,
    });
  }

  private async getCachedProduct(
    id: string,
    withRelations: boolean,
  ): Promise<ProductEntity | null> {
    const key = `product:${id}`;

    const cached = await this.cacheManager.get<ProductEntity>(key);

    if (cached) {
      return cached;
    }

    const product = await this.repository.findOne({
      where: { id },
      relations: {
        images: withRelations,
        attributes: withRelations,
      },
    });

    if (product) {
      await this.cacheManager.set(key, product, 5 * 60 * 1000);
    }

    return product;
  }
}
