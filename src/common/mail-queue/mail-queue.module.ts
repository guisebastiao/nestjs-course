import { MailQueueService } from "@/common/mail-queue/mail-queue.service";
import { MAIL_QUEUE } from "@/common/mail-queue/mail-queue.constants";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MAIL_QUEUE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (cfg: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [cfg.getOrThrow<string>("RABBITMQ_URL")],
            queue: cfg.getOrThrow<string>("MAIL_QUEUE_NAME"),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [MailQueueService],
  exports: [MailQueueService],
})
export class MailQueueModule {}
