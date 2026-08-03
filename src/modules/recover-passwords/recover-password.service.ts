import { CreateRecoverPasswordDTO } from "@/modules/recover-passwords/dto/create-recover-password.dto";
import { RecoverPasswordEntity } from "@/modules/recover-passwords/recover-password.entity";
import { RecoverPasswordRepository } from "@/modules/recover-passwords/recover-password.repository";
import { ConflictException, GoneException, Injectable, NotFoundException } from "@nestjs/common";
import { ResetPasswordDTO } from "@/modules/recover-passwords/dto/reset-password.dto";
import { MailQueueService } from "@/common/mail-queue/mail-queue.service";
import { UserRepository } from "@/modules/users/user.repository";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { randomUUID } from "node:crypto";
import { Request } from "express";

@Injectable()
export class RecoverPasswordService {
  constructor(
    private readonly recoverPasswordRepository: RecoverPasswordRepository,
    private readonly userRepository: UserRepository,
    private readonly mailQueueService: MailQueueService,
    private readonly bcryptService: BcryptService,
    private readonly logger: LoggerService,
  ) {}

  async createRecoverPassword(req: Request, dto: CreateRecoverPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      this.logger.warn({
        message: "User not found exception.",
        class: RecoverPasswordService.name,
        method: this.createRecoverPassword.name,
        path: req.path,
        data: {
          email: dto.email,
        },
      });

      return;
    }

    this.logger.log({
      message: "Request recover password.",
      class: RecoverPasswordService.name,
      method: this.createRecoverPassword.name,
      path: req.path,
      data: {
        userId: user.id,
      },
    });

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    const recoverPasswordEntity = new RecoverPasswordEntity();
    recoverPasswordEntity.userId = user.id;
    recoverPasswordEntity.token = randomUUID();
    recoverPasswordEntity.expiresAt = expiresAt;

    const { token } = await this.recoverPasswordRepository.save(recoverPasswordEntity);

    this.mailQueueService.sendRecoverPasswordMail(user.email, token, user.name);
  }

  async resetPassword(req: Request, dto: ResetPasswordDTO, token: string): Promise<void> {
    const recoverPassword = await this.recoverPasswordRepository.findByToken(token);

    if (!recoverPassword) {
      this.logger.warn({
        message: "Recover password not found.",
        class: RecoverPasswordService.name,
        method: this.resetPassword.name,
        path: req.path,
        data: { token },
      });

      throw new NotFoundException("Recover password not found.");
    }

    if (recoverPassword.usedAt !== null) {
      this.logger.warn({
        message: "Recover password already used.",
        class: RecoverPasswordService.name,
        method: this.resetPassword.name,
        path: req.path,
        data: { token },
      });

      throw new ConflictException("Recover password already used.");
    }

    if (recoverPassword.expiresAt < new Date()) {
      this.logger.warn({
        message: "Change of expired password.",
        class: RecoverPasswordService.name,
        method: this.resetPassword.name,
        path: req.path,
        data: { token },
      });

      throw new GoneException("Your password change request has expired.");
    }

    recoverPassword.user.password = await this.bcryptService.hash(dto.password);
    recoverPassword.usedAt = new Date();

    await this.recoverPasswordRepository.save(recoverPassword);

    this.logger.log({
      message: "User updated password.",
      class: RecoverPasswordService.name,
      method: this.resetPassword.name,
      path: req.path,
      data: {
        userId: recoverPassword.user.id,
      },
    });
  }
}
