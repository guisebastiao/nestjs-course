import { UploadUserPictureDTO } from "@/modules/user-picture/dto/upload-user-picture.dto";
import { UserPictureRepository } from "@/modules/user-picture/user-picture.repository";
import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { UserPictureDTO } from "@/modules/user-picture/dto/user-picture.dto";
import { UserPictureMapper } from "@/common/mappers/user-picture.mapper";
import { StorageService } from "@/common/storage/storage.service";
import { UserRepository } from "@/modules/users/user.repository";
import { LoggerService } from "@/common/logger/logger.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "@/modules/users/user.entity";
import { randomBytes } from "crypto";
import { Request } from "express";

@Injectable()
export class UserPictureService {
  constructor(
    private readonly userPictureRepository: UserPictureRepository,
    private readonly profilePictureMapper: UserPictureMapper,
    private readonly storageService: StorageService,
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async upload(req: Request, userId: string, dto: UploadUserPictureDTO): Promise<UserPictureDTO> {
    const user = await this.findUserById(userId, req);

    if (user.picture) {
      await Promise.all([
        this.storageService.delete(user.picture.path),
        this.userPictureRepository.delete(user.picture),
      ]);
    }

    const nameReplaced = user.name.replace(/\s+/g, "-").toLowerCase();

    const { path } = await this.storageService.upload(
      dto.data,
      dto.mimetype,
      `profile-pictures/${nameReplaced + "_" + randomBytes(8).toString("hex")}`,
    );

    const pictureEntity = new UserPictureEntity();
    pictureEntity.userId = user.id;
    pictureEntity.path = path;
    pictureEntity.altText = nameReplaced;

    const savedPicture = await this.userPictureRepository.save(pictureEntity);

    return this.profilePictureMapper.toResponse(savedPicture);
  }

  async findByUser(req: Request, userId: string): Promise<UserPictureDTO> {
    const user = await this.findUserById(userId, req);

    if (!user.picture) {
      this.logger.warn({
        message: "User does not have a profile picture.",
        path: req.path,
        class: UserPictureService.name,
        method: this.findByUser.name,
        data: { userId },
      });

      throw new NotFoundException("User does not have a profile picture.");
    }

    return this.profilePictureMapper.toResponse(user.picture);
  }

  async delete(req: Request, userId: string): Promise<void> {
    const user = await this.findUserById(userId, req);

    if (!user.picture) {
      this.logger.warn({
        message: "User does not have a profile picture to delete.",
        path: req.path,
        class: UserPictureService.name,
        method: this.delete.name,
        data: { userId },
      });
    }

    await Promise.all([
      this.storageService.delete(user.picture.path),
      this.userPictureRepository.delete(user.picture),
    ]);
  }

  private async findUserById(userId: string, req: Request): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      this.logger.warn({
        message: "User not found, cannot upload profile picture.",
        path: req.path,
        class: UserPictureService.name,
        method: this.findUserById.name,
        data: { userId },
      });

      throw new NotFoundException("User not found.");
    }

    return user;
  }
}
