import { MaxBase64Size } from "@/common/decorators/max-base64-size";
import { IsBase64, IsMimeType, IsNotEmpty } from "class-validator";

export class UploadUserPictureDTO {
  @IsNotEmpty()
  @IsBase64()
  @MaxBase64Size({ MB: 10 })
  data: string;

  @IsNotEmpty()
  @IsMimeType()
  mimetype: string;
}
