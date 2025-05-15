import { AccessibleTemplate, FieldTemplate, RecordAction } from '@otklib/core'

export const template: AccessibleTemplate<FieldTemplate> = {
  name: 'template',
  title: 'template-title',
  fields: [
    {
      name: 'name',
      type: 'text',
      title: 'Название',
      example: 'ООО "Рога и копыта"',
    },
    {
      name: 'inn',
      type: 'text',
      title: 'ИНН компании',
      example: '',
    },
    {
      name: 'kpp',
      type: 'text',
      title: 'КПП',
      example: '',
    },
    {
      name: 'ogrn',
      type: 'text',
      title: 'ОГРН',
      example: '',
    },
    {
      name: 'businessAddress',
      type: 'text',
      title: 'Юридический адрес',
      example: '',
    },
    {
      name: 'postalAddress',
      type: 'text',
      title: 'Адрес для корреспонденции',
      example: '',
    },
    {
      name: 'account',
      type: 'text',
      title: 'Расчётный счёт',
      example: '',
    },
    {
      name: 'correspondentAccount',
      type: 'text',
      title: 'Корреспондентский счёт',
      example: '',
    },
    {
      name: 'bic',
      type: 'text',
      title: 'БИК',
      example: '',
    },
    {
      name: 'agreementName',
      type: 'text',
      title: 'Название договора',
      example: 'ДОГОВОР об оказании информационных услуг',
    },
    {
      name: 'agreementNumber',
      type: 'text',
      title: 'Номер договора',
      example: '10-1/10СБ-2023',
    },
    {
      name: 'agreementDate',
      type: 'text',
      title: 'Дата подписания договора',
      example: '10.10.2023',
    },
  ],
  access: [
    {
      role: 'admin',
      actions: [RecordAction.CREATE, RecordAction.READ, RecordAction.UPDATE],
      condition: {},
    },
  ],
}
