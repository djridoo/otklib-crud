import { UseCase, RecordAction } from '@otklib/core'
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
    const template = await this.templatePort.get()

    if (!template) {
      throw new Error('Template not found')
    }

    const hasAccess = template.access.some((rule) => rule.role === user.role && rule.actions.includes(RecordAction.READ))

    if (!hasAccess) {
      throw new Error('Access denied')
    }

    const safeInput: FindInput = {}

    if (input.filter !== undefined) safeInput.filter = input.filter
    if (input.page !== undefined) safeInput.page = input.page
    if (input.limit !== undefined) safeInput.limit = input.limit
    if (input.sortField !== undefined) safeInput.sortField = input.sortField
    if (input.sortDirection !== undefined) safeInput.sortDirection = input.sortDirection

    return this.repositoryPort.find(safeInput)
  }
}
