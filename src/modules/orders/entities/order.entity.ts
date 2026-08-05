import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { UserEntity } from "@/modules/users/user.entity";
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Column,
  Index,
} from "typeorm";

@Index("IDX_orders_user_id", ["userId"])
@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: true,
  })
  items: OrderItemEntity[];

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
