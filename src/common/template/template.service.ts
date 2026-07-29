import { Injectable } from "@nestjs/common";
import { readFile } from "node:fs/promises";
import Handlebars from "handlebars";
import { join } from "node:path";

@Injectable()
export class TemplateService {
  private readonly templatesPath = join(process.cwd(), "src", "common", "template", "templates");

  async render(template: string, context: Record<string, unknown>): Promise<string> {
    const source = await readFile(join(this.templatesPath, `${template}.hbs`), "utf-8");
    const compiled = Handlebars.compile(source);
    return compiled(context);
  }
}
