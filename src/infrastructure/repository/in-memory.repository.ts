import { Props } from '@otklib/core'
import { RepositoryPort } from '../../core/ports/repository.port'

export class InMemoryRepository implements RepositoryPort {
  public records: { [id: string]: Props } = {}

  public async create(value: Props): Promise<Props> {
    const id = this.makeId()
    const entityData = { id, ...value }
    this.records[id] = entityData
    return entityData
  }

  public async get(id: string): Promise<Props | null> {
    return this.records[id] || null
  }

  public async update(id: string, data: Props): Promise<Props> {
    this.records[id] = {
      ...this.records[id],
      ...data,
    }
    return this.records[id]
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

  private makeId(): string {
    return `${Object.keys(this.records).length + 1}`
  }
}
