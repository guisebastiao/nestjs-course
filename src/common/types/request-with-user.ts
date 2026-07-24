import { UserEntity } from "@/modules/users/entities/user.entity";
import { Request } from "express";

export type RequestWithUser = Request & {
  user: UserEntity;
};
