import { UserEntity } from "@/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "refreshes" })
export class RefreshEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "token_hash", nullable: false, unique: true })
  tokenHash: string;

  @Column({ name: "revoked_at", nullable: true, type: "timestamp without time zone" })
  revokedAt: Date;

  @OneToOne(() => RefreshEntity, (refresh) => refresh.replacedBy, {
    nullable: true,
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "replaced_by_id" })
  replacedBy: RefreshEntity;

  @ManyToOne(() => UserEntity, (user) => user.refreshes, {
    nullable: false,
    cascade: false,
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
