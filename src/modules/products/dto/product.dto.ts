import { ProductImageDTO } from "@/modules/product-image/dto/product-image.dto";
import { InventoryDTO } from "@/modules/inventories/dto/inventory.dto";
import { ProductAttributes } from "@/common/types/product-attributes";
import { CategoryDTO } from "@/modules/categories/dto/category.dto";

export class ProductDTO {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  brand: string;
  inventory: InventoryDTO;
  categories: CategoryDTO[];
  attributes?: ProductAttributes[];
  images: ProductImageDTO[];
}
