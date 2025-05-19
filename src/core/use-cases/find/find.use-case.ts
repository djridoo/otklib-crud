import { UseCase, RecordAction, DI, Props, RecordAccessibleValueObject, FieldsAccessibleValueObject, ValidValueObject } from '@otklib/core'
import { FindInput } from './interfaces/find.input'
import { FindOutput } from './interfaces/find.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { CrudDi } from '../../../crud.di'

export class FindUseCase extends UseCase<FindInput, FindOutput> {
  private authorizerPort: AuthorizerPort
  private repositoryPort: RepositoryPort
  private templatePort: TemplatePort

  constructor(
    di: DI<CrudDi>,
    private options: Props,
  ) {
    super()

    this.authorizerPort = di.get('authorizerPort')
    this.repositoryPort = di.get('repositoryPort')
    this.templatePort = di.get('templatePort')
  }

  public async execute(input: FindInput): Promise<FindOutput> {
    const user = await this.authorizerPort.getUser()
    const template = await this.templatePort.get(this.options.findTemplate)

    if (!template) {
      throw new Error('Template not found')
    }

    const validEntity = new ValidValueObject(input as unknown as Props, template)
    this.validate(validEntity)

    const fieldsAccessibleEntity = new FieldsAccessibleValueObject(input as unknown as Props, template)
    this.checkFieldsAccess(fieldsAccessibleEntity, user.role as string, RecordAction.READ)

    const safeInput: FindInput = {}

    if (input.filter !== undefined) safeInput.filter = input.filter
    if (input.page !== undefined) safeInput.page = input.page
    if (input.limit !== undefined) safeInput.limit = input.limit
    if (input.sortField !== undefined) safeInput.sortField = input.sortField
    if (input.sortDirection !== undefined) safeInput.sortDirection = input.sortDirection

    return this.repositoryPort.find(safeInput)
  }
}
