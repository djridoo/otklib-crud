import { DI } from '@otklib/core'
import { HttpController, HttpRequest } from '@otklib/http-server'
import { UpdateOutput } from '../../core/use-cases/update/interfaces/update.output'
import { UpdateUseCase } from '../../core/use-cases/update/update.use-case'
import { CrudDi } from '../../crud.di'

export class UpdateHttpController implements HttpController<UpdateOutput> {
  public async handle(request: HttpRequest): Promise<UpdateOutput> {
    const useCase = new UpdateUseCase(new DI<CrudDi, any>(), request.query as any)
    return useCase.execute({
      id: request.params.id,
      data: request.body,
    })
  }
}
