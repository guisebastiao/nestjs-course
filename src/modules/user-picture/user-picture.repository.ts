import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { CacheService } from "@/common/cache/app-cache.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CACHE } from "@/common/cache/app-cache.constants";

@Injectable()
export class UserPictureRepository {
  constructor(
    @InjectRepository(UserPictureEntity)
    private readonly repository: Repository<UserPictureEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async save(picture: UserPictureEntity): Promise<UserPictureEntity> {
    const saved = await this.repository.save(picture);
    await this.invalidateUserCaches(picture.userId);
    return saved;
  }

  async findByUserId(userId: string): Promise<UserPictureEntity | null> {
    return await this.repository.findOneBy({ userId });
  }

  async delete(picture: UserPictureEntity): Promise<void> {
    await this.repository.delete(picture.id);
    await this.invalidateUserCaches(picture.userId);
  }

  private async invalidateUserCaches(id?: string | string[]): Promise<void> {
    const ids = id ? (Array.isArray(id) ? id : [id]) : [];

    await this.cacheService.deleteByPrefix(CACHE.USER.USER_LIST_CACHE_PREFIX);

    await this.cacheService.deleteMany(
      ids.map((userId) => `${CACHE.USER.USER_CACHE_PREFIX}${userId}`),
    );
  }
}
