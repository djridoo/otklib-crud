import { HttpController, HttpRequest } from '@otklib/http-server'
import { FindOutput } from '../../core/use-cases/find/interfaces/find.output'
import { FindUseCase } from '../../core/use-cases/find/find.use-case'

export class FindHttpController implements HttpController<FindOutput> {
  public async handle(request: HttpRequest): Promise<FindOutput> {
    const useCase = new FindUseCase()
    return useCase.execute(request.query as any) // todo parse filter from query string
  }
}
