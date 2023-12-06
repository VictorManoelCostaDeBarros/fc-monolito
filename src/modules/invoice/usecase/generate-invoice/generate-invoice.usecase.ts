import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.entity";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDTO, GenerateInvoiceUseCaseOutputDTO } from "./generate-invoice.usecase.dto";


export default class GenerateInvoiceUseCase {
  constructor(
    private _invoiceRepository: InvoiceGateway
  ) {}

  async execute(input: GenerateInvoiceUseCaseInputDTO): Promise<GenerateInvoiceUseCaseOutputDTO> {
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      }),
      items: input.items.map((item) => new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
    })

    await this._invoiceRepository.generate(invoice)

    return {
      id: invoice.id.id,
      name: invoice.name,
      street: invoice.address.street,
      number: invoice.address.number,
      state: invoice.address.state,
      complement:invoice.address.complement,
      city: invoice.address.city,
      zipCode: invoice.address.zipCode,
      document: invoice.document,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: invoice.items.reduce((acc, current) => acc += current.price,0)
    }
  }
}