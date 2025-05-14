import { Props } from '@otklib/core'

export interface RepositoryPort {
  get(id: string): Promise<Props | null>
  find(
    filter?: Props | null,
    page?: number | null,
    limit?: number | null,
    sortField?: string | null,
    sortDirection?: 'asc' | 'desc' | null,
  ): Promise<Props[]>
  create(value: Props): Promise<Props>
  update(id: string, data: Props): Promise<Props>
}
