import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { MINIO_CLIENT } from "@/common/storage/storage.constants";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { extension } from "mime-types";
import { Client } from "minio";
import "multer";

export type UploadManyParams = {
  images: { data: string; mimetype: string }[];
  folder: string;
};

@Injectable()
export class StorageService {
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(
    @Inject(MINIO_CLIENT)
    private readonly client: Client,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.getOrThrow("MINIO_BUCKET");
    this.publicUrl = this.config.getOrThrow("MINIO_PUBLIC_URL");
  }

  async upload(base64: string, mimeType: string, folder: string) {
    const ext = extension(mimeType);

    if (!ext) {
      throw new BadRequestException("Unsupported mime type.");
    }

    const filename = `${randomUUID()}.${ext}`;
    const objectName = `${folder}/${filename}`;

    const cleanBase64 = base64.replace(/^data:.+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    await this.client.putObject(this.bucket, objectName, buffer, buffer.length, {
      "Content-Type": mimeType,
    });

    return {
      path: objectName,
    };
  }

  async uploadMany({ images, folder }: UploadManyParams) {
    return Promise.all(images.map((image) => this.upload(image.data, image.mimetype, folder)));
  }

  getUrl(path: string): string {
    return `${this.publicUrl}/${this.bucket}/${path}`;
  }

  async delete(path: string) {
    await this.client.removeObject(this.bucket, path);
  }

  async deleteMany(paths: string[]) {
    await Promise.all(paths.map((path) => this.delete(path)));
  }
}
