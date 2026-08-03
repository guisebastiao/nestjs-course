import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "@/modules/products/product.entity";

@Entity("product_images")
export class ProductImageEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ name: "position", type: "int", nullable: false, default: 0 })
  position: number;

  @Column({ name: "alt_text", length: 150, nullable: true })
  altText: string;

  @Column({ name: "path", length: 255, nullable: false })
  path: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;
}
