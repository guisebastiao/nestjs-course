import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
