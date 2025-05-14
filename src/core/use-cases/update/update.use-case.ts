import { /* RecordAction, */ UseCase } from '@otklib/core'
import { UpdateInput } from './interfaces/update.input'
import { UpdateOutput } from './interfaces/update.output'
import { di } from './di'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'

export class UpdateUseCase extends UseCase<UpdateInput, UpdateOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')
  private templatePort: TemplatePort = di.get('templatePort')

  public async execute(input: UpdateInput): Promise<UpdateOutput> {
    const user = await this.authorizerPort.getUser()
    // const template = await this.templatePort.get()
    // if (!template) return { id: '' }
    // const entity = new RecordAccessibleEntity(input.id, input.data, template)
    // this.checkRecordAccess(entity, user.role, RecordAction.UPDATE)
    return this.repositoryPort.update(input.id, input.data)
  }
}
