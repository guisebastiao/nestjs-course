import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "@/modules/products/entities/product.entity";

@Entity("product_images")
export class ProductImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ name: "url", length: 1000, nullable: false })
  url: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
