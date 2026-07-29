import { TemplateService } from "@/common/template/template.service";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
  ) {}

  async sendRecoverPasswordMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, string>,
  ): Promise<void> {
    const recoverUrl = `${this.configService.getOrThrow<string>(
      "FRONTEND_URL",
    )}/recover-password/${context.token}`;

    const html = await this.templateService.render(template, {
      name: context.name,
      recoverUrl,
    });

    await this.mailerService.sendMail({ to, subject, html });
  }
}
