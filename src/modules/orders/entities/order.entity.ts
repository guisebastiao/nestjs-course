import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { UserEntity } from "@/modules/users/entities/user.entity";
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    nullable: false,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: ["insert", "update"],
  })
  items: OrderItemEntity[];

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
