import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll()

    return products.map(({ dataValues }) => {
      return new Product({
        id: new Id(dataValues.id),
        name: dataValues.name,
        description: dataValues.description,
        salesPrice: dataValues.salesPrice
      })
    })
  }

  async find(id: string): Promise<Product> {
    const { dataValues } = await ProductModel.findOne({ where: { id: id } })

    return new Product({
      id: new Id(dataValues.id),
      name: dataValues.name,
      description: dataValues.description,
      salesPrice: dataValues.salesPrice,
    })
  }

}