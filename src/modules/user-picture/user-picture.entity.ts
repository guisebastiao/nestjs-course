import { UserEntity } from "@/modules/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user_pictures" })
export class UserPictureEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false, unique: true })
  userId: string;

  @Column({ name: "alt_text", length: 150, nullable: true })
  altText: string;

  @Column({ name: "path", length: 255, nullable: false })
  path: string;

  @OneToOne(() => UserEntity, (user) => user.picture, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
