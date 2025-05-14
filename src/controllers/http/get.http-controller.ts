import { HttpController, HttpRequest } from '@otklib/http-server'
import { GetOutput } from '../../core/use-cases/get/interfaces/get.output'
import { GetUseCase } from '../../core/use-cases/get/get.use-case'

export class GetHttpController implements HttpController<GetOutput> {
  public async handle(request: HttpRequest): Promise<GetOutput> {
    const useCase = new GetUseCase()
    return useCase.execute({
      id: request.params.id,
    })
  }
}
