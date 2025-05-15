import { AccessException, NotFoundException, RecordAction } from '@otklib/core'
import { GetUseCase } from '../../src/core/use-cases/get/get.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'
import { di } from '../../src'
import { template } from '../assets/template'

describe('GetUseCase', () => {
  let useCase: GetUseCase
  let authorizerPort: AuthorizerStub
  let templatePort: TemplateStub
  let repositoryPort: InMemoryRepository

  const mockAdmin = {
    id: '1',
    role: 'admin',
    name: 'Admin User',
    customer: null,
    features: {},
  }

  const mockRecord = {
    name: 'Test Record',
    createdAt: new Date().toISOString(),
  }

  beforeEach(() => {
    authorizerPort = new AuthorizerStub()
    templatePort = new TemplateStub()
    repositoryPort = new InMemoryRepository()

    di.set('authorizerPort', authorizerPort)
    di.set('templatePort', templatePort)
    di.set('repositoryPort', repositoryPort)

    templatePort.template = template

    useCase = new GetUseCase()
  })

  it('должен успешно получить запись при наличии прав на чтение', async () => {
    authorizerPort.user.role = 'user'
    templatePort.template = {
      name: 'test',
      title: 'test-title',
      access: [
        {
          role: 'user',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
      fields: [],
    }

    const createdRecord = await repositoryPort.create(mockRecord)
    const result = await useCase.execute({ id: createdRecord.id as string })
    expect(result).toEqual(createdRecord)
  })

  it('должен выбросить ошибку при отсутствии аутентификации пользователя', async () => {
    authorizerPort.user = {
      id: '',
      role: '',
      name: '',
      customer: null,
      features: {},
    }
    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow(AccessException)
  })

  it('должен выбросить ошибку при отсутствии шаблона', async () => {
    templatePort.template = null as any
    authorizerPort.user.role = 'user'

    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow(NotFoundException)
  })

  it('должен выбросить ошибку при отсутствии прав на чтение', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = {
      name: 'test',
      title: '',
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
      fields: [],
    }

    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow(AccessException)
  })

  it('должен выбросить ошибку при отсутствии записи', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'test',
      title: 'test-title',
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
      fields: [],
    }

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(NotFoundException)
  })

  it('должен позволить администратору прочитать запись при наличии прав', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = {
      name: 'test',
      title: 'test-title',
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
      fields: [],
    }

    const createdAdmin = await repositoryPort.create(mockAdmin)
    const result = await useCase.execute({ id: createdAdmin.id as string })
    expect(result).toEqual(createdAdmin)
  })
})
