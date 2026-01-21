import { useTasksStore } from '@/store/tasksStore'
import type { Task, TasksResponse, UpdateTaskDto } from '@/lib/types'
import { TaskStatus, TaskPriority } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TaskListProps {
  tasks: Task[]
  meta: TasksResponse['meta']
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, data: UpdateTaskDto) => void
}

const statusColors = {
  [TaskStatus.PENDING]: 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/30',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30',
  [TaskStatus.COMPLETED]: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30',
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/30',
  [TaskPriority.MEDIUM]: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30',
  [TaskPriority.HIGH]: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30',
}

const statusLabels = {
  [TaskStatus.PENDING]: 'Pendente',
  [TaskStatus.IN_PROGRESS]: 'Em Progresso',
  [TaskStatus.COMPLETED]: 'Concluída',
}

const priorityLabels = {
  [TaskPriority.LOW]: 'Baixa',
  [TaskPriority.MEDIUM]: 'Média',
  [TaskPriority.HIGH]: 'Alta',
}

export default function TaskList({
  tasks,
  meta,
  onEdit,
  onDelete,
  onUpdate,
}: TaskListProps) {
  const { filters, setFilters } = useTasksStore()

  const toggleComplete = (task: Task) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED
    onUpdate(task.id, { status: newStatus })
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma tarefa encontrada</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Crie sua primeira tarefa para começar a organizar seu trabalho!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-100 dark:hover:shadow-blue-500/10 transition-all duration-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={task.status === TaskStatus.COMPLETED}
                    onChange={() => toggleComplete(task)}
                    className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-base font-semibold mb-1 ${
                      task.status === TaskStatus.COMPLETED
                        ? 'line-through text-gray-400 dark:text-gray-500'
                        : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${
                        statusColors[task.status]
                      }`}
                    >
                      {statusLabels[task.status]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                    {task.dueDate && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(task.dueDate), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(task)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors duration-200"
                  title="Editar tarefa"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-200"
                  title="Deletar tarefa"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Deletar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => setFilters({ page: meta.page - 1 })}
            disabled={meta.page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
            Página {meta.page} de {meta.totalPages}
          </span>
          <button
            onClick={() => setFilters({ page: meta.page + 1 })}
            disabled={meta.page === meta.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima
          </button>
        </div>
      )}
    </>
  )
}
