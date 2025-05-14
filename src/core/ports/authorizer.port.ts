import { Props } from '@otklib/core'

export interface AuthorizerPort {
  getUser(): Promise<Props>
}
