import { UserEntity } from "@/modules/users/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Index("IDX_addresses_user_id_is_default", ["userId", "isDefault"])
@Entity({ name: "addresses" })
export class AddressEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId: string;

  @Column({ name: "label", length: 50, nullable: true })
  label?: string;

  @Column({ name: "street", length: 255, nullable: false })
  street: string;

  @Column({ name: "number", length: 10, nullable: false })
  number: string;

  @Column({ name: "neighborhood", length: 100, nullable: false })
  neighborhood: string;

  @Column({ name: "city", length: 150, nullable: false })
  city: string;

  @Column({ name: "state", length: 150, nullable: false })
  state: string;

  @Column({ name: "country", length: 150, nullable: false })
  country: string;

  @Column({ name: "complement", length: 300, nullable: true })
  complement?: string;

  @Column({ name: "is_default", type: "bool", default: false })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
