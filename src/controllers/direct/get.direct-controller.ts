import { DI, Props } from '@otklib/core'
import { DirectController } from '@otklib/direct-server'
import { GetOutput } from '../../core/use-cases/get/interfaces/get.output'
import { GetUseCase } from '../../core/use-cases/get/get.use-case'
import { GetInput } from '../../core/use-cases/get/interfaces/get.input'
import { CrudDi } from '../../crud.di'

export class GetDirectController implements DirectController<GetInput, GetOutput> {
  public async handle(input: GetInput): Promise<GetOutput> {
    const useCase = new GetUseCase(new DI<CrudDi, any>(), input as unknown as Props)
    return useCase.execute({
      id: input.id ? `${input.id}` : '',
    })
  }
}
