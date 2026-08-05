import { RoleEntity } from "@/modules/roles/role.entity";
import { UserEntity } from "@/modules/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_roles")
@Unique(["user", "role"])
export class UserRoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
  userId: string;

  @Column({ type: "uuid", name: "role_id", nullable: false })
  roleId: string;

  @ManyToOne(() => UserEntity, (user) => user.roles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
