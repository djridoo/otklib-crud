import { AccessibleFieldTemplate, AccessibleTemplate, ValidFieldTemplate } from '@otklib/core'

export interface TemplatePort {
  get(id: string): Promise<AccessibleTemplate<AccessibleFieldTemplate & ValidFieldTemplate>>
}
