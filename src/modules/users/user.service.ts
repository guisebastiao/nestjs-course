import { UpdateUserDTO } from "@/modules/users/dto/update-user.dto";
import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { UserRepository } from "@/modules/users/user.repository";
import { ConflictException, Injectable } from "@nestjs/common";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { UserMapper } from "@/common/mappers/user.mapper";
import { UserEntity } from "@/modules/users/user.entity";
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
      this.logger.warn({
        message: "Requested user was already exists.",
        path: req.path,
        class: UserService.name,
        method: this.createUser.name,
        data: { email: dto.email },
      });

      throw new ConflictException("User already exists.");
    }

    const passwordHash = await this.bcryptService.hash(dto.password);

    const entity = this.userMapper.toEntity(dto);
    entity.password = passwordHash;

    const saved = await this.userRepository.save(entity);

    this.logger.log({
      message: "User created successfully.",
      path: req.path,
      class: UserService.name,
      method: this.createUser.name,
      data: {
        userId: saved.id,
        email: saved.email,
      },
    });

    return this.userMapper.toResponse(saved);
  }

  me(user: UserEntity): UserDTO {
    return this.userMapper.toResponse(user);
  }

  async updateUser(user: UserEntity, dto: UpdateUserDTO): Promise<UserDTO> {
    const updated = this.userMapper.update(user, dto);
    const saved = await this.userRepository.save(updated);

    this.logger.log({
      message: "User updated successfully.",
      class: UserService.name,
      method: this.updateUser.name,
      data: {
        userId: updated.id,
      },
    });

    return this.userMapper.toResponse(saved);
  }

  async deleteUser(req: Request, user: UserEntity): Promise<void> {
    const hasProducts = await this.userRepository.userHasProduct(user);

    if (hasProducts) {
      this.logger.warn({
        message: "Account deletion blocked because the user has registered products.",
        path: req.path,
        class: UserEntity.name,
        method: this.deleteUser.name,
        data: { userId: user.id },
      });

      throw new ConflictException(
        "Account cannot be deleted while products are still associated with it.",
      );
    }

    await this.userRepository.softRemove(user);

    this.logger.log({
      message: "User deleted successfully.",
      class: UserService.name,
      method: this.deleteUser.name,
      data: {
        userId: user.id,
      },
    });
  }
}
