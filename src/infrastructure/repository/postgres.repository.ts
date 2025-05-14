import { Props } from '@otklib/core'
import { DbConnector, QueryAstBuilder } from '@otklib/db'
import { PostgresInsertQuery, PostgresSelectQuery, PostgresUpdateQuery } from '@otklib/postgres'
import { RepositoryPort } from '../../core/ports/repository.port'
import { di } from '../../di'

export class PostgresRepository implements RepositoryPort {
  private readonly values: string

  constructor(values: string) {
    this.values = values
  }

  public async create(value: Props): Promise<Props> {
    const query = new PostgresInsertQuery(this.connector, this.values, true)
    const rows = await query.execute({ ...value })
    return { ...rows[0] } as unknown as Props
  }

  public async find(
    filter?: Props | null,
    page?: number | null,
    limit?: number | null,
    sortField?: string | null,
    sortDirection?: 'asc' | 'desc' | null,
  ): Promise<Props[]> {
    const query = new PostgresSelectQuery(this.connector, this.values)
    const queryLimit = page && limit ? limit : null
    const queryOffset = page && limit ? (page - 1) * limit : null
    return query.execute('*', QueryAstBuilder.build(filter as Props), queryLimit, queryOffset, sortField, sortDirection) as unknown as Promise<
      Props[]
    >
  }

  public async get(id: string): Promise<Props | null> {
    const query = new PostgresSelectQuery(this.connector, this.values)
    const condition = QueryAstBuilder.build({ id })
    const result = (await query.execute('*', condition)) as Props[]

    return result.length > 0 ? result[0] : null
  }

  public async update(id: string, data: Props): Promise<Props> {
    const query = new PostgresUpdateQuery(this.connector, this.values, true)
    const condition = QueryAstBuilder.build({ id })
    const result = (await query.execute(data, condition)) as Props[]

    return result[0]
  }

  private get connector(): DbConnector {
    return di.get('dbConnector')
  }
}
