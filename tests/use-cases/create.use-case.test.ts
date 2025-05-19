import { DI, RecordAction } from '@otklib/core'
import { CreateUseCase } from '../../src/core/use-cases/create/create.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'

describe('CreateUseCase', () => {
  let useCase: CreateUseCase
  let authorizerPort: AuthorizerStub
  let templatePort: TemplateStub
  let repositoryPort: InMemoryRepository
  let di: DI<any>

  beforeEach(() => {
    authorizerPort = new AuthorizerStub()
    templatePort = new TemplateStub()
    repositoryPort = new InMemoryRepository()

    di = new DI()
    di.set('authorizerPort', authorizerPort)
    di.set('templatePort', templatePort)
    di.set('repositoryPort', repositoryPort)

    useCase = new CreateUseCase(di, {
      createTemplate: 'template',
    })
  })

  it('should successfully create a record if you have permission', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      title: 'Test Template',
      name: 'template',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название',
          example: '',
          required: true,
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.CREATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    })

    const input = { name: 'New Company' }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')
    const saved = await repositoryPort.get(output.id as string)
    expect(saved?.name).toBe(input.name)
  })

  it('should successfully create a record with multiple fields and valid values', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      name: 'template',
      title: 'template-title',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название',
          example: '',
          required: true,
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.CREATE],
              condition: {},
            },
          ],
        },
        {
          name: 'employees',
          type: 'number',
          title: 'Количество сотрудников',
          example: '',
          required: false,
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.CREATE],
              condition: {},
            },
          ],
        },
        {
          name: 'active',
          type: 'boolean',
          title: 'Активный статус',
          example: '',
          required: false,
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.CREATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    })

    const input = { name: 'Company', employees: 50, active: true }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')
    const saved = await repositoryPort.get(output.id as string)
    expect(saved?.name).toBe(input.name)
    expect(saved?.employees).toBe(input.employees)
    expect(saved?.active).toBe(input.active)
  })

  it("should throw an error if you don't have permission to create", async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = Promise.resolve({
      title: 'Test Template',
      name: 'template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.CREATE],
          condition: {},
        },
      ],
    })

    const input = { name: 'New Company' }

    await expect(useCase.execute(input)).rejects.toThrow('Forbidden')
  })

  it('should throw an error if the pattern is not found', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = null as any

    const input = { name: 'New Company' }

    await expect(useCase.execute(input)).rejects.toThrow('Template not found')
  })
})
