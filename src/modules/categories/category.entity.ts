import { ProductCategoryEntity } from "@/modules/product-categories/product-category.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "slug", length: 120, nullable: false, unique: true })
  slug: string;

  @Column({ name: "name", length: 100, nullable: false, unique: true })
  name: string;

  @Column({ name: "description", length: 1000, nullable: true })
  description?: string;

  @OneToMany(() => ProductCategoryEntity, (category) => category.category, {
    orphanedRowAction: "delete",
    cascade: true,
  })
  productCategories: ProductCategoryEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
