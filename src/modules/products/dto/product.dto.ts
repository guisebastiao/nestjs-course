import { ProductAttributes } from "@/common/types/product-attributes";
import { ProductImageDTO } from "@/modules/product-image/dto/product-image.dto";
import { CategoryDTO } from "@/modules/categories/dto/category.dto";

export class ProductDTO {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  brand: string;
  categories: CategoryDTO[];
  attributes?: ProductAttributes[];
  images: ProductImageDTO[];
}
