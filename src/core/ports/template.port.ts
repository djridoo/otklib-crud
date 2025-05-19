import { AccessibleFieldTemplate, AccessibleTemplate, FieldTemplate, PropValue, ValidFieldTemplate } from '@otklib/core'

export interface TemplatePort {
  get(templateName: PropValue): Promise<AccessibleTemplate<FieldTemplate & ValidFieldTemplate & AccessibleFieldTemplate>>
}
