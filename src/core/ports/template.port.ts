import { AccessibleTemplate, FieldTemplate } from '@otklib/core'

export interface TemplatePort {
  get(): Promise<AccessibleTemplate<FieldTemplate>>
}
