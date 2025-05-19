import { DbConnector } from '@otklib/db'

import { AuthorizerPort } from './core/ports/authorizer.port'
import { RepositoryPort } from './core/ports/repository.port'
import { TemplatePort } from './core/ports/template.port'

export interface CrudDi {
  dbConnector: DbConnector
  authorizerPort: AuthorizerPort
  repositoryPort: RepositoryPort
  templatePort: TemplatePort
}
