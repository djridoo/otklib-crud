import { Props } from '@otklib/core'

export interface FindInput {
  filter?: Props | null
  page?: number | null
  limit?: number | null
  sortField?: string | null
  sortDirection?: 'asc' | 'desc' | null
}
