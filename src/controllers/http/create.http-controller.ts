import { DI } from '@otklib/core'
import { HttpController, HttpRequest } from '@otklib/http-server'
import { CreateOutput } from '../../core/use-cases/create/interfaces/create.output'
import { CreateUseCase } from '../../core/use-cases/create/create.use-case'
import { CrudDi } from '../../crud.di'

export class CreateHttpController implements HttpController<CreateOutput> {
  public async handle(request: HttpRequest): Promise<CreateOutput> {
    const useCase = new CreateUseCase(new DI<CrudDi, any>(), request.query as any)
    return useCase.execute(request.body)
  }
}
