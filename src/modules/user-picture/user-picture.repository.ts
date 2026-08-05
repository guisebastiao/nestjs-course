import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { CacheService } from "@/common/cache/app-cache.service";
import { CACHE } from "@/common/cache/app-cache.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class UserPictureRepository {
  constructor(
    @InjectRepository(UserPictureEntity)
    private readonly repository: Repository<UserPictureEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async save(entity: UserPictureEntity): Promise<UserPictureEntity> {
    const saved = await this.repository.save(entity);
    await this.invalidateUserCaches(entity.userId);
    return saved;
  }

  async findByUserId(userId: string): Promise<UserPictureEntity | null> {
    return await this.repository.findOneBy({ userId });
  }

  async delete(entity: UserPictureEntity): Promise<void> {
    await this.repository.delete(entity.id);
    await this.invalidateUserCaches(entity.userId);
  }

  private async invalidateUserCaches(id?: string | string[]): Promise<void> {
    const ids = id ? (Array.isArray(id) ? id : [id]) : [];

    await this.cacheService.deleteByPrefix(CACHE.USER.USER_LIST_CACHE_PREFIX);

    await this.cacheService.deleteMany(
      ids.map((userId) => `${CACHE.USER.USER_CACHE_PREFIX}${userId}`),
    );
  }
}
