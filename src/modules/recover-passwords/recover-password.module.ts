import { RecoverPasswordEntity } from "@/modules/recover-passwords/recover-password.entity";
import { RecoverPasswordController } from "@/modules/recover-passwords/recover-password.controller";
import { RecoverPasswordRepository } from "@/modules/recover-passwords/recover-password.repository";
import { RecoverPasswordService } from "@/modules/recover-passwords/recover-password.service";
import { MailQueueModule } from "@/common/mail-queue/mail-queue.module";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { UserModule } from "@/modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TypeOrmModule.forFeature([RecoverPasswordEntity]),
    UserModule,
    BcryptModule,
    MailQueueModule,
  ],
  controllers: [RecoverPasswordController],
  providers: [RecoverPasswordService, RecoverPasswordRepository],
})
export class RecoverPasswordModule {}
