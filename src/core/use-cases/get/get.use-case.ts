import { AccessException, NotFoundException, UseCase } from '@otklib/core'
import { GetInput } from './interfaces/get.input'
import { GetOutput } from './interfaces/get.output'
import { di } from './di'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
// import { TemplatePort } from '../../ports/template.port' // TODO доступы к полям и доступы к записи

export class GetUseCase extends UseCase<GetInput, GetOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')

  public async execute(input: GetInput): Promise<GetOutput> {
    await this.checkAccess()
    const data = await this.repositoryPort.get(input.id)
    if (!data) throw new NotFoundException('Company is not exists')
    return data
  }

  private async checkAccess() {
    const user = await this.authorizerPort.getUser()
    if (!user /* || user.role === UserRol.UNAUTHORIZED */) throw new AccessException('Forbidden')
  }
}
