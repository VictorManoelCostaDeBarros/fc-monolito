import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase {
  constructor(
    private _invoiceRepository: InvoiceGateway
  ) {}

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {

    const invoice = await this._invoiceRepository.find(input.id)

    return {
      id: invoice.id.id,
      name: invoice.name,
      address: invoice.address,
      document: invoice.document,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      createdAt: invoice.createdAt,
      total: invoice.items.reduce((acc, current) => acc += current.price,0)
    }
  }
}