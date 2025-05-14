import { DirectController } from '@otklib/direct-server'
import { UpdateOutput } from '../../core/use-cases/update/interfaces/update.output'
import { UpdateUseCase } from '../../core/use-cases/update/update.use-case'
import { UpdateInput } from '../../core/use-cases/update/interfaces/update.input'

export class UpdateDirectController implements DirectController<UpdateInput, UpdateOutput> {
  public async handle(input: UpdateInput): Promise<UpdateOutput> {
    const useCase = new UpdateUseCase()
    return useCase.execute({
      id: input.id,
      data: input.data,
    })
  }
}
