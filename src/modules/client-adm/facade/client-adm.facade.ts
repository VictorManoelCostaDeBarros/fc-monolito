import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface
  addUsecase: UseCaseInterface
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: UseCaseInterface
  private _addUsecase: UseCaseInterface
  constructor(props: UseCaseProps) {
    this._findUsecase = props.findUsecase
    this._addUsecase = props.addUsecase
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input)
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input)
  }

}