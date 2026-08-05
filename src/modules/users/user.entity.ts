import { RecoverPasswordEntity } from "@/modules/recover-passwords/recover-password.entity";
import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { UserRoleEntity } from "@/modules/user-roles/user-role.entity";
import { OrderEntity } from "@/modules/orders/entities/order.entity";
import { RefreshEntity } from "@/modules/refreshes/refresh.entity";
import { AddressEntity } from "@/modules/addresses/address.entity";
import { ProductEntity } from "@/modules/products/product.entity";
import { CartEntity } from "@/modules/carts/cart.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "email", length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: "password", length: 255, nullable: false })
  password: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  roles: UserRoleEntity[];

  @OneToOne(() => UserPictureEntity, (picture) => picture.user, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  picture: UserPictureEntity;

  @OneToOne(() => CartEntity, (cart) => cart.user, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  cart: CartEntity;

  @OneToMany(() => RecoverPasswordEntity, (recoverPassword) => recoverPassword.user, {
    cascade: true,
  })
  recoverPasswords: RecoverPasswordEntity[];

  @OneToMany(() => RefreshEntity, (refresh) => refresh.user, {
    cascade: true,
  })
  refreshes: RefreshEntity[];

  @OneToMany(() => AddressEntity, (address) => address.user, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  addresses: AddressEntity[];

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
