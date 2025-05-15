import { RecordAction } from '@otklib/core'
import { UpdateUseCase } from '../../src/core/use-cases/update/update.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'
import { di } from '../../src'

describe('UpdateUseCase', () => {
  let useCase: UpdateUseCase
  let authorizerPort: AuthorizerStub
  let templatePort: TemplateStub
  let repositoryPort: InMemoryRepository

  beforeEach(() => {
    authorizerPort = new AuthorizerStub()
    templatePort = new TemplateStub()
    repositoryPort = new InMemoryRepository()

    di.set('authorizerPort', authorizerPort)
    di.set('templatePort', templatePort)
    di.set('repositoryPort', repositoryPort)

    repositoryPort.create({ id: '1', name: 'Company A', employees: 20 })

    useCase = new UpdateUseCase()
  })

  it('должен успешно обновить запись при наличии прав', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название компании',
          example: '',
        },
        {
          name: 'employees',
          type: 'number',
          title: 'Число сотрудников',
          example: '',
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    }

    const input = {
      id: '1',
      data: { name: 'Updated Company Name', employees: 30 },
    }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')
    expect(output.name).toBe('Updated Company Name')
    expect(output.employees).toBe(30)

    const updatedRecord = await repositoryPort.get('1')
    expect(updatedRecord?.name).toBe('Updated Company Name')
    expect(updatedRecord?.employees).toBe(30)
  })

  it('должен обновить только указанные поля, оставив остальные без изменений', async () => {
    authorizerPort.user.role = 'editor'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название компании',
          example: '',
        },
        {
          name: 'employees',
          type: 'number',
          title: 'Число сотрудников',
          example: '',
        },
        {
          name: 'active',
          type: 'boolean',
          title: 'Активный статус',
          example: '',
        },
      ],
      access: [
        {
          role: 'editor',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    }

    await repositoryPort.create({ id: '2', name: 'Old Name', employees: 20 })

    const input = {
      id: '2',
      data: { name: 'New Name Only' },
    }

    const output = await useCase.execute(input)

    expect(output.id).toBe('2')
    expect(output.name).toBe('New Name Only')
    expect(output.employees).toBe(20)
  })

  it('должен выбросить ошибку, если у пользователя нет прав на UPDATE', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    }

    const input = {
      id: '1',
      data: { name: 'Attempted Update' },
    }

    await expect(useCase.execute(input)).rejects.toThrow('Access denied')
  })

  it('должен выбросить ошибку, если шаблон не найден', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = null as any

    const input = {
      id: '1',
      data: { name: 'Attempted Update' },
    }

    await expect(useCase.execute(input)).rejects.toThrow('Template not found')
  })

  it('должен выбросить ошибку, если передано поле, которого нет в шаблоне', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название компании',
          example: '',
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    }

    const input = {
      id: '1',
      data: { name: 'Test', invalidField: 'value' },
    }

    await expect(useCase.execute(input)).rejects.toThrow(`Field "invalidField" is not defined in the template`)
  })

  it('должен выбросить ошибку, если тип данных не соответствует шаблону', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'employees',
          type: 'number',
          title: 'Число сотрудников',
          example: '',
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    }

    const input = {
      id: '1',
      data: { employees: 'not_a_number' },
    }

    await expect(useCase.execute(input)).rejects.toThrow(`Field "employees" must be a number`)
  })
})
