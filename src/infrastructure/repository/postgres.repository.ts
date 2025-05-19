import { DI, Props } from '@otklib/core'
import { DbConnector, QueryAstBuilder } from '@otklib/db'
import { PostgresInsertQuery, PostgresSelectQuery, PostgresUpdateQuery } from '@otklib/postgres'
import { FindOptions, RepositoryPort } from '../../core/ports/repository.port'
import { CrudDi } from '../../crud.di'

export class PostgresRepository implements RepositoryPort {
  private readonly table: string

  constructor(table: string) {
    this.table = table
  }

  public async create(value: Props): Promise<Props> {
    const query = new PostgresInsertQuery(this.connector, this.table, true)
    const rows = await query.execute({ ...value })
    return rows[0]
  }

  public find(options: FindOptions): Promise<Props[]> {
    const { filter, page, limit, sortField, sortDirection } = options
    const query = new PostgresSelectQuery(this.connector, this.table)
    const queryLimit = page && limit ? limit : null
    const queryOffset = page && limit ? (page - 1) * limit : null
    return query.execute('*', QueryAstBuilder.build(filter as Props), queryLimit, queryOffset, sortField, sortDirection)
  }

  public async get(id: string): Promise<Props | null> {
    const query = new PostgresSelectQuery(this.connector, this.table)
    const condition = QueryAstBuilder.build({ id })
    const result = await query.execute('*', condition)

    return result.length > 0 ? result[0] : null
  }

  public async update(id: string, data: Props): Promise<Props> {
    const query = new PostgresUpdateQuery(this.connector, this.table, true)
    const condition = QueryAstBuilder.build({ id })
    const result = (await query.execute(data, condition)) as Props[]

    return result[0]
  }

  private get connector(): DbConnector {
    const di = new DI<CrudDi>()
    return di.get('dbConnector')
  }
}
