import { AddressQueryParams } from "@/modules/addresses/dto/address-query-params.dto";
import { UpdateAddressDTO } from "@/modules/addresses/dto/update-address.dto";
import { CreateAddressDTO } from "@/modules/addresses/dto/create-address.dto";
import { AddressRepository } from "@/modules/addresses/address.repository";
import { AddressDTO } from "@/modules/addresses/dto/address.dto";
import { AddressMapper } from "@/common/mappers/address.mapper";
import { LoggerService } from "@/common/logger/logger.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "@/modules/users/user.entity";
import { Pagination } from "@/common/dto/pagination";
import { Request } from "express";

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly addressMapper: AddressMapper,
    private readonly logger: LoggerService,
  ) {}

  async create(user: UserEntity, dto: CreateAddressDTO): Promise<AddressDTO> {
    if (dto.isDefault) {
      this.deselectIsDefaults(user.id);
    }

    const entity = this.addressMapper.toEntity(dto);
    entity.userId = user.id;

    const saved = await this.addressRepository.save(entity);

    return this.addressMapper.toResponse(saved);
  }

  async findAll(
    user: UserEntity,
    params: AddressQueryParams,
  ): Promise<{ addresses: AddressDTO[]; pagination: Pagination }> {
    const [addresses, total] = await this.addressRepository.findAll(params, user.id);

    return {
      addresses: addresses.map((address) => this.addressMapper.toResponse(address)),
      pagination: new Pagination(params.page, params.limit, total, Math.ceil(total / params.limit)),
    };
  }

  async update(
    req: Request,
    user: UserEntity,
    addressId: string,
    dto: UpdateAddressDTO,
  ): Promise<AddressDTO> {
    const entity = await this.addressRepository.findById(addressId, user.id);

    if (!entity) {
      this.logger.warn({
        message: "Address not found with this user id",
        path: req.path,
        class: AddressService.name,
        method: this.update.name,
        data: { userId: user.id, addressId },
      });

      throw new NotFoundException("Address not found.");
    }

    if (dto.isDefault && !entity.isDefault) {
      await this.deselectIsDefaults(user.id);
    }

    const entityUpdated = this.addressMapper.update(entity, dto);

    const updated = await this.addressRepository.save(entityUpdated);

    return this.addressMapper.toResponse(updated);
  }

  async delete(req: Request, user: UserEntity, addressId: string): Promise<void> {
    const entity = await this.addressRepository.findById(addressId, user.id);

    if (!entity) {
      this.logger.warn({
        message: "Address not found with this user id",
        path: req.path,
        class: AddressService.name,
        method: this.update.name,
        data: { userId: user.id, addressId },
      });

      throw new NotFoundException("Address not found.");
    }

    await this.addressRepository.softRemove(entity);
  }

  async deselectIsDefaults(userId: string): Promise<void> {
    const defaults = await this.addressRepository.findByDefaultsByUser(userId);

    if (defaults.length === 0) {
      return;
    }

    const deselected = defaults.map((entity) => ({
      ...entity,
      isDefault: false,
    }));

    await this.addressRepository.saveAll(deselected);
  }
}
