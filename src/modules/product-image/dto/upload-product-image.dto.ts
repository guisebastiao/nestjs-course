import { IsBase64, IsInt, IsMimeType, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { MaxBase64Size } from "@/common/decorators/max-base64-size";

export class UploadImageDTO {
  @IsNotEmpty()
  @IsBase64()
  @MaxBase64Size({ MB: 10 })
  data: string;

  @IsNotEmpty()
  @IsMimeType()
  mimetype: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  position: number;
}
