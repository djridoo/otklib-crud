import { config } from 'dotenv'
import { DbConnector } from '@otklib/db'
import { PostgresDbConnector } from '@otklib/postgres'
import { di } from '../../di'

import { InMemoryRepository } from './in-memory.repository'
import { PostgresRepository } from './postgres.repository'

export class RepositorySetup {
  public static setupMemoryRepository() {
    di.set('repositoryPort', new InMemoryRepository())
  }

  public static setupPostgresRepository() {
    di.set('repositoryPort', new PostgresRepository('repository'))
  }

  public static setupDbConnector() {
    config({ path: '.env' })
    const dbConnector: DbConnector = new PostgresDbConnector({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_USE_SSL === 'true',
    })
    di.set('dbConnector', dbConnector)
  }
}
