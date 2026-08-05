export class AddressDTO {
  id: string;
  label?: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  complement?: string;
  isDefault?: boolean;
}
