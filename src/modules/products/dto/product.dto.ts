export class ProductAttributeDTO {
  name: string;
  description: string;
}

export class ProductImageDTO {
  url: string;
}

export class ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  availableQuantity: number;
  category: string;
  attributes: ProductAttributeDTO[];
  images: ProductImageDTO[];
}
