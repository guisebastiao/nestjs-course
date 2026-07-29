import { MailEvent } from "@/common/mail-queue/mail-queue-events.enum";
import { SendMailDTO } from "@/common/mail-queue/dto/send-mail.dto";
import { LoggerService } from "@/common/logger/logger.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MailService } from "@/common/mail/mail.service";
import { Controller } from "@nestjs/common";

@Controller()
export class MailConsumer {
  constructor(
    private readonly mailService: MailService,
    private readonly loggerService: LoggerService,
  ) {}

  @EventPattern(MailEvent.SEND)
  async sendMailRecoverPasswordConsumer(
    @Payload() { to, subject, template, context }: SendMailDTO,
  ): Promise<void> {
    await this.mailService.sendRecoverPasswordMail(to, subject, template, context);

    this.loggerService.log({
      message: "An email has been sent to the user to reset their password.",
      class: MailConsumer.name,
      method: this.sendMailRecoverPasswordConsumer.name,
      data: { to, subject, template, context },
    });
  }
}
