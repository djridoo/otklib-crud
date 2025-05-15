import { RecordAction } from '@otklib/core'
import { FindUseCase } from '../../src/core/use-cases/find/find.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'
import { di } from '../../src'

describe('FindUseCase', () => {
  let useCase: FindUseCase
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

    useCase = new FindUseCase()
  })

  it('должен успешно вернуть список записей при наличии прав на чтение', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    await repositoryPort.create({ name: 'Apple' })
    await repositoryPort.create({ name: 'Google' })

    const output = await useCase.execute({})

    expect(output.length).toBe(2)
    expect(output[0].name).toBe('Apple')
    expect(output[1].name).toBe('Google')
  })

  it('должен применить фильтр, если он передан', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    await repositoryPort.create({ name: 'Apple' })
    await repositoryPort.create({ name: 'Google' })
    await repositoryPort.create({ name: 'Amazon' })

    const output = await useCase.execute({
      filter: { name: 'Apple' },
    })

    expect(output.length).toBe(1)
    expect(output[0].name).toBe('Apple')
  })

  it('должен отсортировать записи по указанному полю и направлению', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    await repositoryPort.create({ name: 'Zebra' })
    await repositoryPort.create({ name: 'Alpha' })
    await repositoryPort.create({ name: 'Beta' })

    const output = await useCase.execute({
      sortField: 'name',
      sortDirection: 'asc',
    })

    expect(output.map((item) => item.name)).toEqual(['Alpha', 'Beta', 'Zebra'])
  })

  it('должен поддерживать пагинацию (page и limit)', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    for (let i = 1; i <= 10; i++) {
      await repositoryPort.create({ name: `Company ${i}` })
    }

    const output = await useCase.execute({
      page: 2,
      limit: 3,
    })

    expect(output.length).toBe(3)
    expect(output[0].name).toBe('Company 4') // Стр. 2, эл. 3+1=4
    expect(output[1].name).toBe('Company 5')
    expect(output[2].name).toBe('Company 6')
  })

  it('должен выбросить ошибку при отсутствии прав на чтение', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    await expect(useCase.execute({})).rejects.toThrow('Access denied')
  })

  it('должен выбросить ошибку, если шаблон не найден', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = null as any

    await expect(useCase.execute({})).rejects.toThrow('Template not found')
  })

  it('должен корректно обработать пустой ответ из репозитория', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'company',
      title: 'Company Template',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    }

    const output = await useCase.execute({})
    expect(output).toEqual([])
  })
})
