export class ItemOrderDTO {
  id: string;
  quantity: number;
  unitPrice: number;
}

export class OrderDTO {
  id: string;
  items: ItemOrderDTO[];
}
