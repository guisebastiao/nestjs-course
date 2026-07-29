import { MailEvent, MailTemplate } from "@/common/mail-queue/mail-queue-events.enum";
import { MAIL_QUEUE } from "@/common/mail-queue/mail-queue.constants";
import { SendMailDTO } from "@/common/mail-queue/dto/send-mail.dto";
import { LoggerService } from "@/common/logger/logger.service";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MailQueueService {
  constructor(
    @Inject(MAIL_QUEUE)
    private readonly client: ClientProxy,
    private readonly logger: LoggerService,
  ) {}

  async sendRecoverPasswordMail(to: string, token: string, name: string): Promise<void> {
    await this.send({
      to,
      subject: "Recover Password",
      template: MailTemplate.PASSWORD_RESET,
      context: {
        token,
        name,
      },
    });

    this.logger.log({
      message: "The object for the user to recover their password has been added to the queue.",
      class: MailQueueService.name,
      method: this.sendRecoverPasswordMail.name,
      data: { token, name },
    });
  }

  private async send(data: SendMailDTO): Promise<void> {
    await firstValueFrom(this.client.emit(MailEvent.SEND, data));
  }
}
