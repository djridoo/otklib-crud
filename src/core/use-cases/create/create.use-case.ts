import { RecordAction, UseCase } from '@otklib/core'
import { CreateInput } from './interfaces/create.input'
import { CreateOutput } from './interfaces/create.output'
import { di } from './di'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'

export class CreateUseCase extends UseCase<CreateInput, CreateOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')
  private templatePort: TemplatePort = di.get('templatePort')

  public async execute(input: CreateInput): Promise<CreateOutput> {
    const user = await this.authorizerPort.getUser()
    const template = await this.templatePort.get()

    if (!template) {
      throw new Error('Template not found')
    }

    const accessRule = template.access.find((rule) => rule.role === user.role)

    if (!accessRule || !accessRule.actions.includes(RecordAction.CREATE)) {
      throw new Error('Access denied')
    }

    const createdEntity = await this.repositoryPort.create(input)

    return {
      id: createdEntity.id,
    }
  }
}
