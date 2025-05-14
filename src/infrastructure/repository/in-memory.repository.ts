import { orderBy } from 'lodash'
import { Props } from '@otklib/core'
import { RepositoryPort } from '../../core/ports/repository.port'
import { RowsFilter } from '../../rowsFilter/rows-filter'

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
    let rows = await RowsFilter.filter(Object.values(this.records), filter as Props)
    rows = sortField && sortDirection ? orderBy(rows, [sortField], [sortDirection]) : rows
    return page && limit ? rows.slice((page - 1) * limit, page * limit) : rows
  }

  private makeId(): string {
    return `${Object.keys(this.records).length + 1}`
  }
}
