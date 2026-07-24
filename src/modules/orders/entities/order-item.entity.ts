import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "@/modules/products/entities/product.entity";
import { OrderEntity } from "@/modules/orders/entities/order.entity";

@Entity({ name: "order_items" })
export class OrderItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "quantity", nullable: false })
  quantity: number;

  @Column({ name: "unit_price", type: "decimal", precision: 10, scale: 2, nullable: false })
  unitPrice: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.items, {
    nullable: false,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
