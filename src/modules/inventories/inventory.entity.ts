import { ProductEntity } from "@/modules/products/product.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "inventories" })
export class InventoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "product_id", type: "uuid", unique: true, nullable: false })
  productId: string;

  @Column({ name: "quantity_available", type: "int", nullable: false })
  quantityAvailable: number;

  @Column({ name: "low_stock_threshold", type: "int", nullable: true })
  lowStockThreshold?: number;

  @OneToOne(() => ProductEntity, (product) => product.inventory, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
