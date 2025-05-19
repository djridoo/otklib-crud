import { DI, RecordAction } from '@otklib/core'
import { UpdateUseCase } from '../../src/core/use-cases/update/update.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'

describe('UpdateUseCase', () => {
  let useCase: UpdateUseCase
  let authorizerPort: AuthorizerStub
  let templatePort: TemplateStub
  let repositoryPort: InMemoryRepository
  let di: DI<any>

  beforeEach(async () => {
    authorizerPort = new AuthorizerStub()
    templatePort = new TemplateStub()
    repositoryPort = new InMemoryRepository()

    di = new DI()
    di.set('authorizerPort', authorizerPort)
    di.set('templatePort', templatePort)
    di.set('repositoryPort', repositoryPort)

    await repositoryPort.create({ id: '1', name: 'Company A', employees: 20 })

    useCase = new UpdateUseCase(di, {
      updateTemplate: 'company',
    })
  })

  it('successfully updates a record if you have permission', async () => {
    authorizerPort.user.role = 'admin'

    templatePort.template = Promise.resolve({
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'id',
          type: 'text',
          title: 'ID',
          required: true,
          example: '',
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
        {
          name: 'name',
          type: 'text',
          title: 'Название',
          required: true,
          example: '',
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
        {
          name: 'employees',
          type: 'number',
          title: 'Сотрудники',
          required: false,
          example: '',
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    })

    const input = {
      id: '1',
      data: { name: 'Updated Company Name', employees: 30 },
    }

    const output = await useCase.execute(input)

    expect(output.id).toBe('1')

    const updated = await repositoryPort.get('1')
    expect(updated?.name).toBe('Updated Company Name')
    expect(updated?.employees).toBe(30)
  })

  it('updates only the specified fields, leaves the rest alone', async () => {
    authorizerPort.user.role = 'editor'
    await repositoryPort.create({ id: '2', name: 'Old Name', employees: 20, active: true })

    templatePort.template = Promise.resolve({
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'id',
          type: 'text',
          title: 'ID',
          required: true,
          example: '',
          validation: [],
          access: [
            {
              role: 'editor',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
        {
          name: 'name',
          type: 'text',
          title: 'Название',
          required: false,
          example: '',
          validation: [],
          access: [
            {
              role: 'editor',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
        {
          name: 'employees',
          type: 'number',
          title: 'Сотрудники',
          required: false,
          example: '',
          validation: [],
          access: [
            {
              role: 'editor',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
        {
          name: 'active',
          type: 'boolean',
          title: 'Статус',
          required: false,
          example: '',
          validation: [],
          access: [
            {
              role: 'editor',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'editor',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    })

    const input = {
      id: '2',
      data: { name: 'New Name Only' },
    }

    const output = await useCase.execute(input)

    expect(output.id).toBe('2')
    expect(output.name).toBe('New Name Only')
    expect(output.employees).toBe(20)
    expect(output.active).toBe(true)
  })

  it('throws an error if there is no permission to UPDATE', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = Promise.resolve({
      name: 'company',
      title: '',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    })

    const input = {
      id: '1',
      data: { name: 'Attempted Update' },
    }

    await expect(useCase.execute(input)).rejects.toThrow('Forbidden')
  })

  it('throws an error if the pattern is not found', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve(null as any)

    const input = {
      id: '1',
      data: { name: 'Attempted Update' },
    }

    await expect(useCase.execute(input)).rejects.toThrow('Template not found')
  })

  it('throws an error if a field is passed that is not in the template', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'name',
          type: 'text',
          title: 'Название',
          required: true,
          example: '',
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    })

    const input = {
      id: '1',
      data: { name: 'Valid', invalidField: 'value' },
    }

    await expect(useCase.execute(input)).rejects.toThrow(`Forbidden`)
  })

  it('throws an error if the data type does not match the pattern', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      name: 'company',
      title: 'Company Template',
      fields: [
        {
          name: 'employees',
          type: 'number',
          title: 'Сотрудники',
          required: true,
          example: '',
          validation: [],
          access: [
            {
              role: 'admin',
              actions: [RecordAction.UPDATE],
              condition: {},
            },
          ],
        },
      ],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.UPDATE],
          condition: {},
        },
      ],
    })

    const input = {
      id: '1',
      data: { employees: 'not_a_number' },
    }

    await expect(useCase.execute(input)).rejects.toThrow(`Forbidden`)
  })
})
