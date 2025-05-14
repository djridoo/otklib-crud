import { DbConnector } from '@otklib/db'

import { DI } from '@otklib/core'
import { AuthorizerPort } from './core/ports/authorizer.port'
import { RepositoryPort } from './core/ports/repository.port'
import { TemplatePort } from './core/ports/template.port'

export const di = new DI<{
  dbConnector: DbConnector
  authorizerPort: AuthorizerPort
  repositoryPort: RepositoryPort
  templatePort: TemplatePort
}>()
