import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel, InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.entity";
import Product from "../domain/product.entity";


describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const repository = new InvoiceRepository()
    const generateUseCase = new GenerateInvoiceUseCase(repository)

    const facade = new InvoiceFacade({
      generateUsecase: generateUseCase,
      findUsecase: undefined
    })

    const input = {
      name: "teste",
      document: "12345678901",
      street: "Rua Teste",
      number: "123",
      complement: "complemento",
      city: "Teste",
      state: "Teste",
      zipCode: "12345678",
      items: [{
        id: "1",
        name: "Teste",
        price: 10,
      },{
        id: "2",
        name: "Teste 2",
        price: 20,
      }]
    }

    const result = await facade.generate(input)

    const { dataValues: invoice } = await InvoiceModel.findOne({ where: { id: result.id },  include: [InvoiceItemModel] })


    expect(invoice.id).toBeDefined()
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipcode).toBe(input.zipCode);
    expect(invoice.items[0].dataValues.id).toBe(input.items[0].id);
    expect(invoice.items[0].dataValues.name).toBe(input.items[0].name);
    expect(invoice.items[0].dataValues.price).toBe(input.items[0].price);
    expect(invoice.items[1].dataValues.id).toBe(input.items[1].id);
    expect(invoice.items[1].dataValues.name).toBe(input.items[1].name);
    expect(invoice.items[1].dataValues.price).toBe(input.items[1].price);
    expect(invoice.total).toBe(30);
  })

  it("should find a invoice", async () => {

    const facade = InvoiceFacadeFactory.create()

    const input = new Invoice({
      id: new Id("1"),
      name: "Teste",
      document: "12345678901",
      address: new Address({
        street: "Rua Teste",
        number: "123",
        complement: "complemento",
        city: "Teste",
        state: "Teste",
        zipCode: "12345678",
      }),
      items: [
        new Product({
          id: new Id("1"),
          name: "Teste",
          price: 10,
        }),
        new Product({
          id: new Id("2"),
          name: "Teste 2",
          price: 20,
        }),
      ],
    });

    await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipcode: input.address.zipCode,
        items: input.items.map((item: Product) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: input.total,
        createdAt: input.createdAt,
      },
      {
        include: [InvoiceItemModel],
      }
    )

    const invoice = await facade.find({ id: "1" })

    expect(invoice.id).toBeDefined()
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.address.street).toBe(input.address.street);
    expect(invoice.address.number).toBe(input.address.number);
    expect(invoice.address.complement).toBe(input.address.complement);
    expect(invoice.address.city).toBe(input.address.city);
    expect(invoice.address.state).toBe(input.address.state);
    expect(invoice.address.zipCode).toBe(input.address.zipCode);
    expect(invoice.items[0].id).toBe(input.items[0].id.id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id.id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
    expect(invoice.total).toBe(30);
  })
});