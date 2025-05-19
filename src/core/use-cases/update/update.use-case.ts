import { DI, FieldsAccessibleValueObject, Props, RecordAccessibleValueObject, RecordAction, UseCase, ValidValueObject } from '@otklib/core'
import { UpdateInput } from './interfaces/update.input'
import { UpdateOutput } from './interfaces/update.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { CrudDi } from '../../../crud.di'

export class UpdateUseCase extends UseCase<UpdateInput, UpdateOutput> {
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

  public async execute(input: UpdateInput): Promise<UpdateOutput> {
    const user = await this.authorizerPort.getUser()
    const template = await this.templatePort.get(this.options.updateTemplate)

    if (!template) {
      throw new Error('Template not found')
    }

    const existing = await this.repositoryPort.get(input.id)
    if (!existing) {
      throw new Error('Record not found')
    }

    const flatInput: Props = { ...existing, ...input.data, id: input.id }

    const recordAccessibleEntity = new RecordAccessibleValueObject(flatInput, template)
    this.checkRecordAccess(recordAccessibleEntity, user.role as string, RecordAction.UPDATE)

    const fieldsAccessibleEntity = new FieldsAccessibleValueObject(flatInput, template)
    this.checkFieldsAccess(fieldsAccessibleEntity, user.role as string, RecordAction.UPDATE)

    const validEntity = new ValidValueObject(flatInput, template)
    this.validate(validEntity)

    return this.repositoryPort.update(input.id, input.data)
  }
}
