import { CategoryEntity } from "@/modules/categories/category.entity";
import { ProductEntity } from "@/modules/products/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("product_categories")
@Unique(["productId", "categoryId"])
@Index("IDX_product_categories_category_id", ["categoryId"])
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "product_id", nullable: false })
  productId: string;

  @Column({ type: "uuid", name: "category_id", nullable: false })
  categoryId: string;

  @ManyToOne(() => ProductEntity, (product) => product.categories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.productCategories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
