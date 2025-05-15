import { AccessibleTemplate, FieldTemplate } from '@otklib/core'
import { TemplatePort } from '../../src/core/ports/template.port'

export class TemplateStub implements TemplatePort {
  public template: AccessibleTemplate<FieldTemplate>

  public async get(): Promise<AccessibleTemplate<FieldTemplate>> {
    return this.template
  }
}
