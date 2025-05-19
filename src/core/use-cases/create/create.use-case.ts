import { DI, FieldsAccessibleValueObject, Props, RecordAccessibleValueObject, RecordAction, UseCase, ValidValueObject } from '@otklib/core'
import { CreateInput } from './interfaces/create.input'
import { CreateOutput } from './interfaces/create.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { CrudDi } from '../../../crud.di'

export class CreateUseCase extends UseCase<CreateInput, CreateOutput> {
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

  public async execute(input: CreateInput): Promise<CreateOutput> {
    const user = await this.authorizerPort.getUser()
    const template = await this.templatePort.get(this.options.createTemplate)

    if (!template) {
      throw new Error('Template not found')
    }

    const validEntity = new ValidValueObject(input, template)
    this.validate(validEntity)

    const recordAccessibleEntity = new RecordAccessibleValueObject(input, template)
    this.checkRecordAccess(recordAccessibleEntity, user.role as string, RecordAction.CREATE)

    const fieldsAccessibleEntity = new FieldsAccessibleValueObject(input, template)
    this.checkFieldsAccess(fieldsAccessibleEntity, user.role as string, RecordAction.CREATE)

    const createdEntity = await this.repositoryPort.create(input)

    return {
      id: createdEntity.id,
    }
  }
}
