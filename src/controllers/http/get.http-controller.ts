import { DI } from '@otklib/core'
import { HttpController, HttpRequest } from '@otklib/http-server'
import { GetOutput } from '../../core/use-cases/get/interfaces/get.output'
import { GetUseCase } from '../../core/use-cases/get/get.use-case'
import { CrudDi } from '../../crud.di'

export class GetHttpController implements HttpController<GetOutput> {
  public async handle(request: HttpRequest): Promise<GetOutput> {
    const useCase = new GetUseCase(new DI<CrudDi, any>(), request.query as any)
    return useCase.execute({
      id: request.params.id,
    })
  }
}
