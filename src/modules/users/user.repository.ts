import { UserEntity } from "@/modules/users/entities/user.entity";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async save(user: DeepPartial<UserEntity>): Promise<UserEntity> {
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const key = `user:${id}`;

    const cached = await this.cache.get<UserEntity>(key);

    if (cached) {
      return cached;
    }

    const user = await this.repository.findOneBy({ id });

    if (user) {
      await this.cache.set(key, user, 300_000);
    }

    return user;
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
}
