import { UpdateUserDTO } from "@/modules/users/dto/update-user.dto";
import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { UserRepository } from "@/modules/users/user.repository";
import { ConflictException, Injectable } from "@nestjs/common";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { UserMapper } from "@/modules/users/user.mapper";
import { UserDTO } from "@/modules/users/dto/user.dto";
import { Request } from "express";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly userMapper: UserMapper,
    private readonly logger: LoggerService,
  ) {}

  async createUser(req: Request, dto: CreateUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (user) {
      this.sendLogger("Requested product was already exists.", req, this.createUser.name, {
        email: dto.email,
      });

      throw new ConflictException("User already exists.");
    }

    const passwordHash = await this.bcryptService.hash(dto.password);

    const userEntity = this.userMapper.toEntity(dto);
    userEntity.password = passwordHash;

    const newUser = await this.userRepository.save(userEntity);

    return this.userMapper.toResponse(newUser);
  }

  me(user: UserEntity): UserDTO {
    return this.userMapper.toResponse(user);
  }

  async updateUser(user: UserEntity, dto: UpdateUserDTO): Promise<UserDTO> {
    const userMapperUpdate = this.userMapper.update(user, dto);
    const updatedUser = await this.userRepository.save(userMapperUpdate);

    return this.userMapper.toResponse(updatedUser);
  }

  async deleteUser(user: UserEntity): Promise<void> {
    await this.userRepository.delete(user);
  }

  private sendLogger(
    message: string,
    req: Request,
    method: string,
    data?: Record<string, unknown>,
  ): void {
    this.logger.warn({
      message,
      path: req.path,
      class: UserService.name,
      method,
      data,
    });
  }
}
