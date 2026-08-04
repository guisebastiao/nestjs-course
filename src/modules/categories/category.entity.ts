import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "slug", length: 120, nullable: false })
  slug: string;

  @Column({ name: "name", length: 100, nullable: false })
  name: string;

  @Column({ name: "description", length: 1000, nullable: true })
  description?: string;

  @OneToMany(() => ProductCategoryEntity, (category) => category.category, {
    cascade: true,
  })
  categories: ProductCategoryEntity[];
}
