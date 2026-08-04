import { UserPictureDTO } from "@/modules/user-picture/dto/user-picture.dto";

export class UserDTO {
  id: string;
  name: string;
  picture: UserPictureDTO | null;
}
