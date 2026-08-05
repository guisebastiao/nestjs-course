import { AddressController } from "@/modules/addresses/address.controller";
import { AddressRepository } from "@/modules/addresses/address.repository";
import { AddressService } from "@/modules/addresses/address.service";
import { AddressEntity } from "@/modules/addresses/address.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
  exports: [AddressRepository],
})
export class AddressModule {}
