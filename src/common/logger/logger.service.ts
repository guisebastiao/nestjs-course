import { Injectable, Logger } from "@nestjs/common";

export type LogContext = {
  message: string;
  path?: string;
  class?: string;
  method?: string;
  data?: unknown;
  error?: unknown;
};

@Injectable()
export class LoggerService {
  private readonly logger = new Logger();

  log(context: LogContext) {
    this.logger.log(this.format(context));
  }

  warn(context: LogContext) {
    this.logger.warn(this.format(context));
  }

  debug(context: LogContext) {
    this.logger.debug(this.format(context));
  }

  verbose(context: LogContext) {
    this.logger.verbose(this.format(context));
  }

  error(context: LogContext) {
    const trace = context.error instanceof Error ? context.error.stack : undefined;
    this.logger.error(this.format(context), trace);
  }

  private format(context: LogContext, trace?: string): string {
    return JSON.stringify({
      message: context.message,
      path: context.path,
      class: context.class,
      method: context.method,
      data: context.data,
      trace,
      timestamp: new Date().toISOString(),
    });
  }
}
