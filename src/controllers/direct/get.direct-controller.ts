import { DirectController } from '@otklib/direct-server'
import { GetOutput } from '../../core/use-cases/get/interfaces/get.output'
import { GetUseCase } from '../../core/use-cases/get/get.use-case'
import { GetInput } from '../../core/use-cases/get/interfaces/get.input'

export class GetDirectController implements DirectController<GetInput, GetOutput> {
  public async handle(input: GetInput): Promise<GetOutput> {
    const useCase = new GetUseCase()
    return useCase.execute({
      id: input.id ? `${input.id}` : '',
    })
  }
}
