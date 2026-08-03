import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    return (await this.cacheManager.get<T>(key)) ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deleteMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const keyv = this.cacheManager.stores[0];
    const keysToDelete: string[] = [];

    for await (const [key] of keyv.iterator?.(undefined) ?? []) {
      if (typeof key === "string" && key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    await Promise.all(keysToDelete.map((key) => keyv.delete(key)));
  }
}
