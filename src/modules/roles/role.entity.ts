import { UserRoleEntity } from "@/modules/user-roles/user-role.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "roles" })
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  roles: UserRoleEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;
}
