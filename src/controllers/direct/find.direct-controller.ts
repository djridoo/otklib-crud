import { DI, Props } from '@otklib/core'
import { DirectController } from '@otklib/direct-server'
import { FindOutput } from '../../core/use-cases/find/interfaces/find.output'
import { FindUseCase } from '../../core/use-cases/find/find.use-case'
import { FindInput } from '../../core/use-cases/find/interfaces/find.input'
import { CrudDi } from '../../crud.di'

export class FindDirectController implements DirectController<FindInput, FindOutput> {
  public async handle(input: FindInput): Promise<FindOutput> {
    const useCase = new FindUseCase(new DI<CrudDi, any>(), input as unknown as Props)
    return useCase.execute(input)
  }
}
