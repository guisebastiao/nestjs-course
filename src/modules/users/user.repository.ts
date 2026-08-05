import { PaginationQuery } from "@/common/dto/pagination-query";
import { CacheService } from "@/common/cache/app-cache.service";
import { CACHE } from "@/common/cache/app-cache.constants";
import { UserEntity } from "@/modules/users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async save(entity: DeepPartial<UserEntity>): Promise<UserEntity> {
    const saved = await this.repository.save(entity);
    await this.invalidateUserCaches(saved.id);
    return saved;
  }

  async userHasProduct(entity: UserEntity): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder("user")
      .innerJoin("user.products", "product")
      .where("user.id = :userId", { userId: entity.id })
      .getCount();

    return count > 0;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.getCachedUserOrFromDatabase(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async findAllUsers(params: PaginationQuery): Promise<[UserEntity[], number]> {
    const skip = (params.page - 1) * params.limit;

    return await this.repository.findAndCount({
      skip,
      take: params.limit,
      order: {
        name: "ASC",
      },
    });
  }

  async softRemove(entity: UserEntity): Promise<void> {
    await this.repository.softRemove({
      id: entity.id,
    });
  }

  private async getCachedUserOrFromDatabase(id: string): Promise<UserEntity | null> {
    const key = `${CACHE.USER.USER_CACHE_PREFIX}${id}`;

    const cached = await this.cacheService.get<UserEntity>(key);

    if (cached) {
      return cached;
    }

    const user = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        roles: {
          role: true,
        },
        picture: true,
      },
    });

    if (user) {
      await this.cacheService.set(key, user, CACHE.USER.USER_CACHE_TTL_MS);
    }

    return user;
  }

  private async invalidateUserCaches(id?: string | string[]): Promise<void> {
    const ids = id ? (Array.isArray(id) ? id : [id]) : [];

    await this.cacheService.deleteByPrefix(CACHE.USER.USER_LIST_CACHE_PREFIX);

    await this.cacheService.deleteMany(
      ids.map((userId) => `${CACHE.USER.USER_CACHE_PREFIX}${userId}`),
    );
  }
}
