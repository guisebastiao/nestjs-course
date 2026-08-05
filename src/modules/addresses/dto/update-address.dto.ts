import { CreateAddressDTO } from "@/modules/addresses/dto/create-address.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateAddressDTO extends PartialType(CreateAddressDTO) {}
