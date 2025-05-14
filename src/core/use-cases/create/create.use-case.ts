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
    // const template = await this.templatePort.get()
    // if (!template) return { id: '' }
    // const entity = new RecordAccessibleEntity('', input, template)
    // this.checkRecordAccess(entity, user.role, RecordAction.CREATE)
    return this.repositoryPort.create(input)
  }
}
