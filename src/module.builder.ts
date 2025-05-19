import { DI } from '@otklib/core'

type UseCaseFactory<Deps, UseCase> = (deps: Deps) => UseCase

export interface Module<UseCases extends Record<string, any>> {
  getUseCase<Name extends keyof UseCases>(name: Name): UseCases[Name]
}

export class ModuleBuilder<Deps extends Record<string, any>, UseCaseFactories extends Record<string, UseCaseFactory<DI<Deps>, any>>> {
  private dependencies: DI<Deps> = new DI<Deps>()
  private overrides: Partial<{
    [K in keyof UseCaseFactories]: UseCaseFactory<DI<Deps>, ReturnType<UseCaseFactories[K]>>
  }> = {}

  constructor(private useCaseFactories: UseCaseFactories) {}

  public withDependency<K extends keyof Deps>(key: K, instance: Deps[K]): this {
    this.dependencies.set(key, instance)
    return this
  }

  public overrideUseCase<Name extends keyof UseCaseFactories>(
    name: Name,
    factory: UseCaseFactory<DI<Deps>, ReturnType<UseCaseFactories[Name]>>,
  ): this {
    this.overrides[name] = factory
    return this
  }

  public build(): Module<{
    [K in keyof UseCaseFactories]: ReturnType<UseCaseFactories[K]>
  }> {
    const self = this

    return {
      getUseCase<Name extends keyof UseCaseFactories>(name: Name): ReturnType<UseCaseFactories[Name]> {
        const factory = self.overrides[name] ?? self.useCaseFactories[name]
        if (!factory) {
          throw new Error(`Use-case "${String(name)}" not found`)
        }
        return factory(self.dependencies)
      },
    }
  }
}
