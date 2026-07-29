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

  @Column({ name: "token", length: 255, nullable: false, unique: true })
  token: string;

  @Column({ name: "expires_at", nullable: false })
  expiresAt: Date;

  @Column({ name: "used_at", nullable: true })
  usedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.recoverPasswords, {
    nullable: false,
    cascade: ["insert", "update"],
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
