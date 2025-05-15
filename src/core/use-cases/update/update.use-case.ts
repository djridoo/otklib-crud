import { AccessibleTemplate, FieldTemplate, RecordAction, UseCase } from '@otklib/core'
import { UpdateInput } from './interfaces/update.input'
import { UpdateOutput } from './interfaces/update.output'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'
import { di } from '../../../di'

export class UpdateUseCase extends UseCase<UpdateInput, UpdateOutput> {
  private authorizerPort: AuthorizerPort = di.get('authorizerPort')
  private repositoryPort: RepositoryPort = di.get('repositoryPort')
  private templatePort: TemplatePort = di.get('templatePort')

  public async execute(input: UpdateInput): Promise<UpdateOutput> {
    const user = await this.authorizerPort.getUser()
    const template = await this.templatePort.get()

    if (!template) {
      throw new Error('Template not found')
    }

    if (!(await this.hasAccess(template, user.role as string))) {
      throw new Error('Access denied')
    }

    this.validateData(template.fields, input.data)

    return this.repositoryPort.update(input.id, input.data)
  }

  private async hasAccess(template: AccessibleTemplate<FieldTemplate>, role: string): Promise<boolean> {
    const rule = template.access.find((r) => r.role === role)
    return !!rule && rule.actions.includes(RecordAction.UPDATE)
  }

  private validateData(fields: FieldTemplate[], data: Record<string, any>): void {
    const fieldMap = Object.fromEntries(fields.map((f) => [f.name, f]))

    // eslint-disable-next-line guard-for-in
    for (const key in data) {
      if (!fieldMap[key]) {
        throw new Error(`Field "${key}" is not defined in the template`)
      }

      const field = fieldMap[key]
      const value = data[key]

      if (value === undefined) continue

      switch (field.type) {
        case 'text':
          if (typeof value !== 'string') {
            throw new Error(`Field "${key}" must be a string`)
          }
          break
        case 'number':
          if (typeof value !== 'number') {
            throw new Error(`Field "${key}" must be a number`)
          }
          break
        case 'boolean':
          if (typeof value !== 'boolean') {
            throw new Error(`Field "${key}" must be a boolean`)
          }
          break
        default:
          break
      }
    }
  }
}
