import { ProductEntity } from "@/modules/products/entities/product.entity";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "email", length: 255, nullable: false })
  email: string;

  @Column({ name: "password", length: 255, nullable: false })
  password: string;

  @OneToMany(() => ProductEntity, (product) => product.user, {
    cascade: false,
  })
  products: ProductEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user, {
    cascade: false,
  })
  orders: OrderEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;
}
