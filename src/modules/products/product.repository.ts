import { ProductQueryParams } from "@/modules/products/dto/product-query-params.dto";
import { ProductEntity } from "@/modules/products/product.entity";
import { CacheService } from "@/common/cache/app-cache.service";
import { CACHE } from "@/common/cache/app-cache.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async save(product: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    const saved = await this.repository.save(product);

    await this.invalidateProductCaches(saved.id);

    return saved;
  }

  async saveAll(products: DeepPartial<ProductEntity>[]): Promise<ProductEntity[]> {
    const saved = await this.repository.save(products);

    await this.invalidateProductCaches(saved.map((product) => product.id));

    return saved;
  }

  async existsThisSku(sku: string): Promise<boolean> {
    return await this.repository.existsBy({ sku });
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        images: true,
        inventory: true,
        categories: {
          category: true,
        },
      },
    });
  }

  async findProductsByIds(ids: string[]): Promise<ProductEntity[]> {
    const products = await Promise.all(ids.map((id) => this.getCachedProduct(id, false)));
    return products.filter((product): product is ProductEntity => product !== null);
  }

  async findAllProducts(params: ProductQueryParams): Promise<[ProductEntity[], number]> {
    const pageKey = `${CACHE.PRODUCT.PRODUCT_LIST_CACHE_PREFIX}${JSON.stringify(params)}`;

    const cached = await this.cacheService.get<{
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

    const skip = (params.page - 1) * params.limit;

    const qb = this.repository
      .createQueryBuilder("product")
      .where("product.deletedAt IS NULL")
      .leftJoinAndSelect("product.images", "image")
      .leftJoinAndSelect("product.inventory", "inventory")
      .leftJoinAndSelect("product.categories", "productCategory")
      .leftJoinAndSelect("productCategory.category", "category")
      .take(params.limit)
      .skip(skip);

    if (params.search) {
      qb.andWhere(
        `(LOWER(product.name) LIKE LOWER(:search)
        OR LOWER(product.description) LIKE LOWER(:search)
        OR LOWER(product.sku) LIKE LOWER(:search))`,
        {
          search: `%${params.search}%`,
        },
      );
    }

    if (params.categories?.length) {
      qb.andWhere("category.id IN (:...categories)", {
        categories: params.categories,
      });
    }

    if (params.minPrice !== undefined) {
      qb.andWhere("product.price >= :minPrice", {
        minPrice: params.minPrice,
      });
    }

    if (params.maxPrice !== undefined) {
      qb.andWhere("product.price <= :maxPrice", {
        maxPrice: params.maxPrice,
      });
    }

    const sortMap = {
      NAME: "product.name",
      PRICE: "product.price",
      CREATED: "product.createdAt",
    } satisfies Record<string, string>;

    qb.orderBy(sortMap[params.sort], params.order);

    const [products, total] = await qb.getManyAndCount();

    await Promise.all(
      products.map((product) =>
        this.cacheService.set(
          `${CACHE.PRODUCT.PRODUCT_CACHE_PREFIX}${product.id}`,
          product,
          CACHE.PRODUCT.PRODUCT_CACHE_TTL_MS,
        ),
      ),
    );

    await this.cacheService.set(
      pageKey,
      {
        ids: products.map((product) => product.id),
        total,
      },
      CACHE.PRODUCT.PRODUCT_CACHE_TTL_MS,
    );

    return [products, total];
  }

  async delete(product: ProductEntity): Promise<void> {
    await this.repository.softRemove({
      id: product.id,
    });

    await this.invalidateProductCaches(product.id);
  }

  private async getCachedProduct(
    id: string,
    withRelations: boolean,
  ): Promise<ProductEntity | null> {
    const key = `${CACHE.PRODUCT.PRODUCT_CACHE_PREFIX}${id}`;

    const cached = await this.cacheService.get<ProductEntity>(key);

    if (cached) {
      return cached;
    }

    const product = await this.repository.findOne({
      where: { id },
      relations: {
        images: withRelations,
        attributes: withRelations,
        inventory: withRelations,
      },
    });

    if (product) {
      await this.cacheService.set(key, product, CACHE.PRODUCT.PRODUCT_CACHE_TTL_MS);
    }

    return product;
  }

  private async invalidateProductCaches(id?: string | string[]): Promise<void> {
    const ids = id ? (Array.isArray(id) ? id : [id]) : [];

    await this.cacheService.deleteByPrefix(CACHE.PRODUCT.PRODUCT_LIST_CACHE_PREFIX);

    await this.cacheService.deleteMany(
      ids.map((productId) => `${CACHE.PRODUCT.PRODUCT_CACHE_PREFIX}${productId}`),
    );
  }
}
