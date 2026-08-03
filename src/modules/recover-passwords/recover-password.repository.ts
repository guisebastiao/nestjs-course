import { RecoverPasswordEntity } from "@/modules/recover-passwords/recover-password.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RecoverPasswordRepository {
  constructor(
    @InjectRepository(RecoverPasswordEntity)
    private readonly repository: Repository<RecoverPasswordEntity>,
  ) {}

  async save(recoverPassword: DeepPartial<RecoverPasswordEntity>): Promise<RecoverPasswordEntity> {
    return await this.repository.save(recoverPassword);
  }

  async findByToken(token: string): Promise<RecoverPasswordEntity | null> {
    return await this.repository.findOne({
      where: {
        token,
      },
      relations: {
        user: true,
      },
    });
  }
}
