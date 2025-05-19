import { AccessException, DI, NotFoundException, RecordAction } from '@otklib/core'
import { GetUseCase } from '../../src/core/use-cases/get/get.use-case'
import { AuthorizerStub } from '../stub/authorizer.stub'
import { TemplateStub } from '../stub/template.stub'
import { InMemoryRepository } from '../../src/infrastructure/repository/in-memory.repository'

describe('GetUseCase', () => {
  let useCase: GetUseCase
  let authorizerPort: AuthorizerStub
  let templatePort: TemplateStub
  let repositoryPort: InMemoryRepository
  let di: DI<any>

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

    di = new DI()
    di.set('authorizerPort', authorizerPort)
    di.set('templatePort', templatePort)
    di.set('repositoryPort', repositoryPort)

    useCase = new GetUseCase(di, {
      getTemplate: 'test',
    })
  })

  it('should successfully get the entry if you have read permissions', async () => {
    authorizerPort.user.role = 'user'

    templatePort.template = Promise.resolve({
      name: 'test',
      title: 'test-title',
      fields: [],
      access: [
        {
          role: 'user',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    })

    const createdRecord = await repositoryPort.create(mockRecord)
    const result = await useCase.execute({ id: createdRecord.id as string })
    expect(result).toEqual(createdRecord)
  })

  it('should throw an error if user is not authenticated', async () => {
    authorizerPort.user = null as any

    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow(AccessException)
  })

  it('should throw an error if the template is missing', async () => {
    authorizerPort.user.role = 'user'
    templatePort.template = Promise.resolve(null as any)

    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow('Template not found')
  })

  it('should throw an error if you dont have read permissions', async () => {
    authorizerPort.user.role = 'guest'
    templatePort.template = Promise.resolve({
      name: 'test',
      title: 'test-title',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    })

    await expect(useCase.execute({ id: 'record1' })).rejects.toThrow(AccessException)
  })

  it('should throw an error if there is no entry', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      name: 'test',
      title: 'test-title',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    })

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(NotFoundException)
  })

  it('should allow the administrator to read the entry if they have permission', async () => {
    authorizerPort.user.role = 'admin'
    templatePort.template = Promise.resolve({
      name: 'test',
      title: 'test-title',
      fields: [],
      access: [
        {
          role: 'admin',
          actions: [RecordAction.READ],
          condition: {},
        },
      ],
    })

    const createdAdmin = await repositoryPort.create(mockAdmin)
    const result = await useCase.execute({ id: createdAdmin.id as string })
    expect(result).toEqual(createdAdmin)
  })
})
