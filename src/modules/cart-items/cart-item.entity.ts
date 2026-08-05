import { ProductEntity } from "@/modules/products/product.entity";
import { CartEntity } from "@/modules/carts/cart.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "cart_items" })
export class CartItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cart_id", type: "uuid", nullable: false })
  cartId: string;

  @Column({ name: "product_id", type: "uuid", nullable: false })
  productId: string;

  @Column({ name: "quantity", type: "int", nullable: false })
  quantity: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cart_id" })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;
}
