import { Props } from '@otklib/core'
import { RepositoryPort } from '../../core/ports/repository.port'

export class PostgresRepository implements RepositoryPort {
  public async create(value: Props): Promise<Props> {
    // todo implement
    return {}
  }

  public async find(
    filter?: Props | null,
    page?: number | null,
    limit?: number | null,
    sortField?: string | null,
    sortDirection?: 'asc' | 'desc' | null,
  ): Promise<Props[]> {
    // todo implement
    return []
  }

  public async get(id: string): Promise<Props | null> {
    // todo implement
    return null
  }

  public async update(id: string, data: Props): Promise<Props> {
    // todo implement
    return {}
  }
}
