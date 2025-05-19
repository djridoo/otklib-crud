import { DI } from '@otklib/core'
import { ModuleBuilder } from '../src/module.builder'
import { CreateUseCase } from '../src/core/use-cases/create/create.use-case'
import { GetUseCase } from '../src/core/use-cases/get/get.use-case'
import { FindUseCase } from '../src/core/use-cases/find/find.use-case'
import { UpdateUseCase } from '../src/core/use-cases/update/update.use-case'
import { CrudDi } from '../src'

describe('ModuleBuilder', () => {
  const mockAuthorizerPort = { getUser: jest.fn() }
  const mockRepositoryPort = {
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  }
  const mockTemplatePort = { get: jest.fn() }

  const mockCrudDi = new DI<CrudDi>()
  mockCrudDi.set('authorizerPort', mockAuthorizerPort)
  mockCrudDi.set('repositoryPort', mockRepositoryPort)
  mockCrudDi.set('templatePort', mockTemplatePort)

  const createFactory = jest.fn((di: DI<CrudDi>) => new CreateUseCase(di, { createTemplate: 'company' }))
  const getFactory = jest.fn((di: DI<CrudDi>) => new GetUseCase(di, { getTemplate: 'company' }))
  const findFactory = jest.fn((di: DI<CrudDi>) => new FindUseCase(di, { findTemplate: 'company' }))
  const updateFactory = jest.fn((di: DI<CrudDi>) => new UpdateUseCase(di, { updateTemplate: 'company' }))

  let builder: ModuleBuilder<
    CrudDi,
    {
      create: typeof createFactory
      get: typeof getFactory
      find: typeof findFactory
      update: typeof updateFactory
    }
  >

  beforeEach(() => {
    builder = new ModuleBuilder({
      create: createFactory,
      get: getFactory,
      find: findFactory,
      update: updateFactory,
    })

    builder
      .withDependency('authorizerPort', mockAuthorizerPort)
      .withDependency('repositoryPort', mockRepositoryPort)
      .withDependency('templatePort', mockTemplatePort)
  })

  it('creates a new use-case instance on each getUseCase call', () => {
    const module = builder.build()
    const a = module.getUseCase('create')
    const b = module.getUseCase('create')

    expect(a).toBeInstanceOf(CreateUseCase)
    expect(b).toBeInstanceOf(CreateUseCase)
    expect(a).not.toBe(b)
    expect(createFactory).toHaveBeenCalledTimes(2)
  })

  it('supports overrideUseCase', () => {
    class CustomGetUseCase extends GetUseCase {
      execute = jest.fn()
      constructor() {
        super(mockCrudDi, { getTemplate: 'mock' })
      }
    }

    builder.overrideUseCase('get', () => new CustomGetUseCase())
    const module = builder.build()
    const useCase = module.getUseCase('get')

    expect(useCase).toBeInstanceOf(CustomGetUseCase)
  })

  it('throws on unknown use-case', () => {
    const brokenBuilder = new ModuleBuilder<CrudDi, { create: typeof createFactory }>({
      create: createFactory,
    })

    const module = brokenBuilder
      .withDependency('authorizerPort', mockAuthorizerPort)
      .withDependency('repositoryPort', mockRepositoryPort)
      .withDependency('templatePort', mockTemplatePort)
      .build()

    expect(() => module.getUseCase('get' as any)).toThrow('Use-case "get" not found')
  })

  it('passes DI instance into use-case factories', () => {
    const module = builder.build()
    const useCase = module.getUseCase('find')

    expect(useCase).toBeInstanceOf(FindUseCase)
    expect(findFactory).toHaveBeenCalledWith(expect.any(DI))
  })
})
