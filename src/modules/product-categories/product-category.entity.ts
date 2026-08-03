import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { CategoryEntity } from "@/modules/categories/category.entity";
import { ProductEntity } from "@/modules/products/product.entity";

@Entity("product_categories")
@Unique(["productId", "categoryId"])
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ type: "uuid", name: "category_id", nullable: false })
  categoryId: string;

  @ManyToOne(() => ProductEntity, (product) => product.categories, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.categories, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;
}
