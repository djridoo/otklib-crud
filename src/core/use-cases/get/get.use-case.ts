import { AccessException, NotFoundException, RecordAction, UseCase } from '@otklib/core'
import { GetInput } from './interfaces/get.input'
import { GetOutput } from './interfaces/get.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { di } from '../create/di'

export class GetUseCase extends UseCase<GetInput, GetOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')
  private templatePort: TemplatePort = di.get('templatePort')

  public async execute(input: GetInput): Promise<GetOutput> {
    const user = await this.authorizerPort.getUser()
    if (!user) {
      throw new AccessException('User not authenticated')
    }

    const template = await this.templatePort.get()
    if (!template) {
      throw new NotFoundException('Template not found')
    }

    const accessRule = template.access.find((rule) => rule.role === user.role)
    if (!accessRule || !accessRule.actions.includes(RecordAction.READ)) {
      throw new AccessException('Access denied')
    }

    const data = await this.repositoryPort.get(input.id)
    if (!data) {
      throw new NotFoundException('Record not found')
    }

    return data
  }
}
