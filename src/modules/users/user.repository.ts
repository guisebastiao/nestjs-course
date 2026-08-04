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

  async save(user: DeepPartial<UserEntity>): Promise<UserEntity> {
    const saved = await this.repository.save(user);

    await this.invalidateUserCaches(saved.id);

    return saved;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.getCachedUserOrDatabase(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async findAllUsers(skip: number, take: number): Promise<[UserEntity[], number]> {
    return await this.repository.findAndCount({ skip, take });
  }

  async delete(user: UserEntity): Promise<void> {
    await this.repository.softDelete({
      id: user.id,
    });
  }

  private async getCachedUserOrDatabase(id: string): Promise<UserEntity | null> {
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
