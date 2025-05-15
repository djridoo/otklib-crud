import { RecordAction } from '@otklib/core'
import { CreateUseCase } from '../../src/core/use-cases/create/create.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'
import { di } from '../../src'
import { template } from '../assets/template'

describe('CreateUseCase', () => {
  let useCase: CreateUseCase
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

    templatePort.template = template

    useCase = new CreateUseCase()
  })

  it('должен успешно создать запись при наличии прав', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'template',
      title: 'template-title',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    }

    const input = { name: 'New Company' }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')
    const saved = await repositoryPort.get(output.id as string)
    expect(saved?.name).toBe(input.name)
  })

  it('должен успешно создать запись с несколькими полями и корректными значениями', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
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
          name: 'employees',
          type: 'number',
          title: 'Количество сотрудников',
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
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    }

    const input = { name: 'Company', employees: 50, active: true }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')
    const saved = await repositoryPort.get(output.id as string)
    expect(saved?.name).toBe(input.name)
    expect(saved?.employees).toBe(input.employees)
    expect(saved?.active).toBe(input.active)
  })

  it('должен выбросить ошибку при отсутствии прав на create', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = {
      name: 'template',
      title: 'template-title',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    }

    const input = { name: 'New Company' }

    await expect(useCase.execute(input)).rejects.toThrow('Access denied')
  })

  it('должен выбросить ошибку, если шаблон не найден', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = null as any

    const input = { name: 'New Company' }

    await expect(useCase.execute(input)).rejects.toThrow('Template not found')
  })
})
