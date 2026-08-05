import { AddressQueryParams } from "@/modules/addresses/dto/address-query-params.dto";
import { CreateAddressDTO } from "@/modules/addresses/dto/create-address.dto";
import { UpdateAddressDTO } from "@/modules/addresses/dto/update-address.dto";
import { AddressService } from "@/modules/addresses/address.service";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import { ListResponse } from "@/common/dto/list-response";
import { UserEntity } from "@/modules/users/user.entity";
import type { Request } from "express";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

@Controller("/addresses")
export class AddressController {
  constructor(private readonly addressesService: AddressService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@AuthUser() user: UserEntity, @Body() dto: CreateAddressDTO) {
    const data = await this.addressesService.create(user, dto);
    return SuccessResponse.of(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@AuthUser() user: UserEntity, @Query() params: AddressQueryParams) {
    const { addresses, pagination } = await this.addressesService.findAll(user, params);
    const data = ListResponse.of(addresses, pagination);
    return SuccessResponse.of(data);
  }

  @HttpCode(HttpStatus.OK)
  @Patch("/:addressId")
  async update(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Param("addressId") addressId: string,
    @Body() dto: UpdateAddressDTO,
  ) {
    const data = await this.addressesService.update(req, user, addressId, dto);
    return SuccessResponse.of(data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("/:addressId")
  async delete(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Param("addressId") addressId: string,
  ) {
    await this.addressesService.delete(req, user, addressId);
    return SuccessResponse.of();
  }
}
