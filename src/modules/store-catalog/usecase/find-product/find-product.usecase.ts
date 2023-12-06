import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export default class FindProductUsecase implements UseCaseInterface {
  constructor(private _productRepository: ProductGateway) {}

  async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
    const product = await this._productRepository.find(input.id)

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    }
  }
}