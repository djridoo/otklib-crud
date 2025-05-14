import { Props } from '@otklib/core'
import { InMemoryFindQuery } from '@otklib/in-memory'
import { QueryAstBuilder } from '@otklib/db'

export class RowsFilter {
  public static async filter<T>(rows: T[], filter: Props): Promise<T[]> {
    const query = new InMemoryFindQuery<T>(QueryAstBuilder.build(filter), rows)
    return query.execute()
  }
}
