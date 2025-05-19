import { DI, Props } from '@otklib/core'
import { DirectController } from '@otklib/direct-server'
import { UpdateOutput } from '../../core/use-cases/update/interfaces/update.output'
import { UpdateUseCase } from '../../core/use-cases/update/update.use-case'
import { UpdateInput } from '../../core/use-cases/update/interfaces/update.input'
import { CrudDi } from '../../crud.di'

export class UpdateDirectController implements DirectController<UpdateInput, UpdateOutput> {
  public async handle(input: UpdateInput): Promise<UpdateOutput> {
    const useCase = new UpdateUseCase(new DI<CrudDi, any>(), input as unknown as Props)
    return useCase.execute({
      id: input.id,
      data: input.data,
    })
  }
}
