import { CookieService } from "@/common/cookies/cookie.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
