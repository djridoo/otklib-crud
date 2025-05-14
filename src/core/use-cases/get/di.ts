import { DI } from '@otklib/core'
import { di as globalDi } from '../../../di'
import { AuthorizerPort } from '../../ports/authorizer.port'
import { RepositoryPort } from '../../ports/repository.port'
import { TemplatePort } from '../../ports/template.port'

export const di = new DI<{
  authorizerPort: AuthorizerPort
  repositoryPort: RepositoryPort
  templatePort: TemplatePort
}>(globalDi)
