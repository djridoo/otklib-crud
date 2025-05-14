import { DirectController } from '@otklib/direct-server'
import { FindOutput } from '../../core/use-cases/find/interfaces/find.output'
import { FindUseCase } from '../../core/use-cases/find/find.use-case'
import { FindInput } from '../../core/use-cases/find/interfaces/find.input'

export class FindDirectController implements DirectController<FindInput, FindOutput> {
  public async handle(input: FindInput): Promise<FindOutput> {
    const useCase = new FindUseCase()
    return useCase.execute(input)
  }
}
