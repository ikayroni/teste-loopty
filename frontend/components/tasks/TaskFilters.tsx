import { useTasksStore } from '@/store/tasksStore'
import { TaskStatus, TaskPriority } from '@/lib/types'

export default function TaskFilters() {
  const { filters, setFilters, resetFilters } = useTasksStore()

  return (
    <div className="bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-6 mb-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filtros e Ordenação</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({
                status: e.target.value as TaskStatus | undefined,
                page: 1,
              })
            }
            className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos</option>
            <option value={TaskStatus.PENDING}>Pendente</option>
            <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
            <option value={TaskStatus.COMPLETED}>Concluída</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              setFilters({
                priority: e.target.value as TaskPriority | undefined,
                page: 1,
              })
            }
            className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todas</option>
            <option value={TaskPriority.LOW}>Baixa</option>
            <option value={TaskPriority.MEDIUM}>Média</option>
            <option value={TaskPriority.HIGH}>Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Ordenar por</label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => setFilters({ sortBy: e.target.value, page: 1 })}
            className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="createdAt">Data de Criação</option>
            <option value="updatedAt">Última Atualização</option>
            <option value="dueDate">Data de Vencimento</option>
            <option value="priority">Prioridade</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Ordem</label>
          <select
            value={filters.order || 'DESC'}
            onChange={(e) =>
              setFilters({ order: e.target.value as 'ASC' | 'DESC', page: 1 })
            }
            className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="DESC">Decrescente</option>
            <option value="ASC">Crescente</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button 
          onClick={resetFilters} 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}
