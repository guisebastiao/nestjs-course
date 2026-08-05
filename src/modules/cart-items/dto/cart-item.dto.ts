import { ProductDTO } from "@/modules/products/dto/product.dto";

export class CartItemDTO {
  id: string;
  quantity: number;
  product: ProductDTO;
}
