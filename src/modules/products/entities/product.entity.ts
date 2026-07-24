import { ProductAttributeEntity } from "@/modules/products/entities/product-attribute.entity";
import { ProductImageEntity } from "@/modules/products/entities/product-image.entity";
import { OrderItemEntity } from "@/modules/orders/entities/order-item.entity";
import { UserEntity } from "@/modules/users/entities/user.entity";
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
} from "typeorm";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "price", type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ name: "available_quantity", nullable: false })
  availableQuantity: number;

  @Column({ name: "description", length: 1000, nullable: false })
  description: string;

  @Column({ name: "category", length: 100, nullable: false })
  category: string;

  @OneToMany(() => ProductImageEntity, (productImageEntity) => productImageEntity.product, {
    cascade: ["insert", "update"],
  })
  images: ProductImageEntity[];

  @OneToMany(
    () => ProductAttributeEntity,
    (productAttributeEntity) => productAttributeEntity.product,
    {
      cascade: ["insert", "update"],
    },
  )
  attributes: ProductAttributeEntity[];

  @ManyToOne(() => UserEntity, (user) => user.products, {
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.product)
  items: OrderItemEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: string;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: string;
}
