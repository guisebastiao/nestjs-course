import { UserEntity } from "@/modules/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Index("IDX_recover_passwords_user_id", ["userId"])
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
  usedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.recoverPasswords, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
