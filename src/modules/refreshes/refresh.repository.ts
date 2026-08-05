import { RefreshEntity } from "@/modules/refreshes/refresh.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshRepository {
  constructor(
    @InjectRepository(RefreshEntity)
    private readonly repository: Repository<RefreshEntity>,
  ) {}

  async save(entity: DeepPartial<RefreshEntity>): Promise<RefreshEntity> {
    return await this.repository.save(entity);
  }

  async findById(id: string): Promise<RefreshEntity | null> {
    return await this.repository.findOneBy({ id });
  }
}
