import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  hash(password: string): Promise<string> {
    const rounds = Number(this.configService.getOrThrow("BCRYPT_ROUNDS"));
    return bcrypt.hash(password, rounds);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
