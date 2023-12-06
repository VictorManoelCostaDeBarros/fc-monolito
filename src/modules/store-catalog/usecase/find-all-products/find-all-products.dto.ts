export interface FindAllProductsDto {
  product: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[]
}