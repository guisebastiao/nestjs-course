export class SendMailDTO {
  to: string;
  subject: string;
  template: string;
  context: Record<string, string>;

  constructor(to: string, subject: string, template: string, context: Record<string, string>) {
    this.to = to;
    this.subject = subject;
    this.template = template;
    this.context = context;
  }
}
