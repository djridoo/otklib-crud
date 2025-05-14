import { DbConnector } from '@otklib/db'
import { di } from './di'
import { AuthorizerPort } from './core/ports/authorizer.port'
import { RepositoryPort } from './core/ports/repository.port'
import { TemplatePort } from './core/ports/template.port'

export interface CrudFactoryOptions {
  path: string
  dbConnector?: DbConnector
  authorizerPort?: AuthorizerPort
  repositoryPort?: RepositoryPort
  templatePort?: TemplatePort
}

export class CrudFactory {
  public static create(options: CrudFactoryOptions) {
    if (options?.dbConnector) di.set('dbConnector', options.dbConnector)
    if (options?.authorizerPort) di.set('authorizerPort', options.authorizerPort)
    if (options?.repositoryPort) di.set('repositoryPort', options.repositoryPort)
    if (options?.templatePort) di.set('templatePort', options.templatePort)
    // todo implement setup controllers and repositories
  }
}
