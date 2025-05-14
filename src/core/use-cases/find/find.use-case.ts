import { UseCase } from '@otklib/core'
import { FindInput } from './interfaces/find.input'
import { FindOutput } from './interfaces/find.output'
import { di } from './di'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'

export class FindUseCase extends UseCase<FindInput, FindOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')
  private templatePort: TemplatePort = di.get('templatePort')

  public async execute(input: FindInput): Promise<FindOutput> {
    const user = await this.authorizerPort.getUser()
    // const template = await this.templatePort.get()
    // if (!template) return []
    // const entity = new RecordAccessibleEntity('', {}, template)
    // this.checkRecordAccess(entity, user.role, RecordAction.READ)
    // return this.repositoryPort.getAll()
    // todo implement
    return []
  }
}
