import { UserEntity } from "@/modules/users/user.entity";
import { Request } from "express";

export type RequestWithUser = Request & {
  user: UserEntity;
};
