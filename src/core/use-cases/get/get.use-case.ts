import { AccessException, DI, NotFoundException, Props, RecordAccessibleValueObject, RecordAction, UseCase } from '@otklib/core'
import { GetInput } from './interfaces/get.input'
import { GetOutput } from './interfaces/get.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { CrudDi } from '../../../crud.di'

export class GetUseCase extends UseCase<GetInput, GetOutput> {
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

  public async execute(input: GetInput): Promise<GetOutput> {
    const user = await this.authorizerPort.getUser()
    if (!user) {
      throw new AccessException('User not authenticated')
    }

    const template = await this.templatePort.get(this.options.getTemplate)
    if (!template) {
      throw new Error('Template not found')
    }

    const flatProps = { id: input.id }

    const recordAccessibleEntity = new RecordAccessibleValueObject(flatProps, template)
    this.checkRecordAccess(recordAccessibleEntity, user.role as string, RecordAction.READ)

    const data = await this.repositoryPort.get(input.id)
    if (!data) {
      throw new NotFoundException('Record not found')
    }

    return data
  }
}
