import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RoleEntity } from "@/modules/roles/role.entity";
import { UserEntity } from "@/modules/users/user.entity";

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

  @ManyToOne(() => RoleEntity, (role) => role.roles, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;
}
