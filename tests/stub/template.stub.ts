import { AccessibleFieldTemplate, AccessibleTemplate, FieldTemplate, PropValue, ValidFieldTemplate } from '@otklib/core'
import { TemplatePort } from '../../src/core/ports/template.port'

export class TemplateStub implements TemplatePort {
  public template: Promise<AccessibleTemplate<FieldTemplate & ValidFieldTemplate & AccessibleFieldTemplate>>

  public get(templateName: PropValue): Promise<AccessibleTemplate<FieldTemplate & ValidFieldTemplate & AccessibleFieldTemplate>> {
    return this.template
  }
}
