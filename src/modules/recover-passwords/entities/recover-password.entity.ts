import { UserEntity } from "@/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "recover_passwords" })
export class RecoverPasswordEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
  userId: string;

  @Column({ name: "token", length: 255, nullable: false, unique: true })
  token: string;

  @Column({ type: "timestamptz", name: "expires_at", nullable: false })
  expiresAt: Date;

  @Column({ type: "timestamptz", name: "used_at", nullable: true })
  usedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.recoverPasswords, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;
}
