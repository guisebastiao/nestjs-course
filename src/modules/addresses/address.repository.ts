import { AddressQueryParams } from "@/modules/addresses/dto/address-query-params.dto";
import { AddressEntity } from "@/modules/addresses/address.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

export class AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
  ) {}

  async save(entity: DeepPartial<AddressEntity>): Promise<AddressEntity> {
    return this.repository.save(entity);
  }

  async saveAll(entities: DeepPartial<AddressEntity>[]): Promise<AddressEntity[]> {
    return this.repository.save(entities);
  }

  async findByDefaultsByUser(userId: string): Promise<AddressEntity[]> {
    return await this.repository.findBy({ userId, isDefault: true });
  }

  async findById(id: string, userId: string): Promise<AddressEntity | null> {
    return await this.repository.findOneBy({ id, userId });
  }

  async findAll(params: AddressQueryParams, userId: string): Promise<[AddressEntity[], number]> {
    const skip = (params.page - 1) * params.limit;

    return await this.repository.findAndCount({
      where: { userId },
      order: {
        isDefault: "DESC",
        street: params.order,
      },
      skip,
      take: params.limit,
    });
  }

  async delete(entity: AddressEntity): Promise<void> {
    await this.repository.delete(entity.id);
  }
}
