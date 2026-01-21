import { create } from 'zustand'
import type { QueryTaskDto } from '@/lib/types'

interface TasksStore {
  filters: QueryTaskDto
  setFilters: (filters: Partial<QueryTaskDto>) => void
  resetFilters: () => void
}

const defaultFilters: QueryTaskDto = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  order: 'DESC',
}

export const useTasksStore = create<TasksStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
