import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "@/modules/products/entities/product.entity";
import { OrderEntity } from "@/modules/orders/entities/order.entity";

@Entity({ name: "order_items" })
export class OrderItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ type: "uuid", name: "order_id", nullable: false })
  orderId: string;

  @Column({ name: "quantity", nullable: false })
  quantity: number;

  @Column({ name: "unit_price", type: "decimal", precision: 10, scale: 2, nullable: false })
  unitPrice: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.items, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
