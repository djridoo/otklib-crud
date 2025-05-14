import { HttpController, HttpRequest } from '@otklib/http-server'
import { CreateOutput } from '../../core/use-cases/create/interfaces/create.output'
import { CreateUseCase } from '../../core/use-cases/create/create.use-case'

export class CreateHttpController implements HttpController<CreateOutput> {
  public async handle(request: HttpRequest): Promise<CreateOutput> {
    const useCase = new CreateUseCase()
    return useCase.execute(request.body)
  }
}
