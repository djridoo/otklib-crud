import { DirectController } from '@otklib/direct-server'
import { CreateOutput } from '../../core/use-cases/create/interfaces/create.output'
import { CreateUseCase } from '../../core/use-cases/create/create.use-case'
import { CreateInput } from '../../core/use-cases/create/interfaces/create.input'

export class CreateDirectController implements DirectController<CreateInput, CreateOutput> {
  public async handle(input: CreateInput): Promise<CreateOutput> {
    const useCase = new CreateUseCase()
    return useCase.execute(input)
  }
}
