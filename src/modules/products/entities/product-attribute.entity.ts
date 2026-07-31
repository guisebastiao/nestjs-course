import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "@/modules/products/entities/product.entity";

@Entity("product_attributes")
export class ProductAttributeEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "description", length: 1000, nullable: false })
  description: string;

  @ManyToOne(() => ProductEntity, (product) => product.attributes, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
