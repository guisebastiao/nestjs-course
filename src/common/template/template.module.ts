import { TemplateService } from "@/common/template/template.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
