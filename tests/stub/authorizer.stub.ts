import { Props } from '@otklib/core'
import { AuthorizerPort } from '../../src/core/ports/authorizer.port'

export class AuthorizerStub implements AuthorizerPort {
  public user: Props = {
    id: '',
    role: '',
    name: '',
    customer: null,
    features: {},
  }

  public async getUser(): Promise<Props> {
    return Promise.resolve(this.user)
  }
}
