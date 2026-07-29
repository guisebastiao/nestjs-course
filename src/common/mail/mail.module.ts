import { MailQueueModule } from "@/common/mail-queue/mail-queue.module";
import { TemplateModule } from "@/common/template/template.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailConsumer } from "@/common/mail/mail.consumer";
import { MailService } from "@/common/mail/mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.getOrThrow<string>("MAIL_HOST"),
          port: cfg.getOrThrow<number>("MAIL_PORT"),
          auth: {
            user: cfg.getOrThrow<string>("MAIL_USER"),
            pass: cfg.getOrThrow<string>("MAIL_PASS"),
          },
        },
      }),
    }),
    TemplateModule,
    MailQueueModule,
  ],
  controllers: [MailConsumer],
  providers: [MailService],
})
export class MailModule {}
