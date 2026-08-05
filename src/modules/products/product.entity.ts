import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import { ProductImageEntity } from "@/modules/product-image/product-image.entity";
import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import type { ProductAttributes } from "@/common/types/product-attributes";
import { InventoryEntity } from "@/modules/inventories/inventory.entity";
import { UserEntity } from "@/modules/users/user.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from "typeorm";
import { CartItemEntity } from "@/modules/cart-items/cart-item.entity";

@Index("IDX_products_user_id", ["userId"])
@Index("IDX_products_price", ["price"])
@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id", nullable: false })
  userId: string;

  @Column({ name: "sku", nullable: false, length: 30, unique: true })
  sku: string;

  @Column({ name: "slug", length: 1200, nullable: false })
  slug: string;

  @Column({ name: "name", length: 1000, nullable: false })
  name: string;

  @Column({ type: "text", name: "description", nullable: true })
  description?: string;

  @Column({ name: "price", type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ name: "brand", length: 500, nullable: false })
  brand: string;

  @OneToOne(() => InventoryEntity, (inventory) => inventory.product, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  inventory: InventoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.products, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => ProductImageEntity, (productImageEntity) => productImageEntity.product, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  images: ProductImageEntity[];

  @OneToMany(() => CartItemEntity, (item) => item.product, {
    cascade: false,
  })
  cartItems: CartItemEntity[];

  @Column({ name: "attributes", type: "json", nullable: true })
  attributes?: ProductAttributes[];

  @OneToMany(() => ProductCategoryEntity, (category) => category.product, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  categories: ProductCategoryEntity[];

  @OneToMany(() => OrderItemEntity, (item) => item.product, {
    cascade: false,
  })
  items: OrderItemEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
