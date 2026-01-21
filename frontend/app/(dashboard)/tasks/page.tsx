'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/lib/api'
import { useTasksStore } from '@/store/tasksStore'
import TaskList from '@/components/tasks/TaskList'
import TaskFilters from '@/components/tasks/TaskFilters'
import TaskModal from '@/components/tasks/TaskModal'
import KanbanView from '@/components/tasks/KanbanView'
import ExportButton from '@/components/tasks/ExportButton'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/lib/types'

export default function TasksPage() {
  const queryClient = useQueryClient()
  const filters = useTasksStore((state) => state.filters)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.getAll(filters),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.create(data),
    onSuccess: async () => {
      // Remove completamente os dados antigos do cache
      await queryClient.resetQueries({ queryKey: ['tasks'] })
      await queryClient.resetQueries({ queryKey: ['analytics'], exact: false })
      setIsModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      tasksApi.update(id, data),
    onSuccess: async () => {
      // Remove completamente os dados antigos do cache
      await queryClient.resetQueries({ queryKey: ['tasks'] })
      await queryClient.resetQueries({ queryKey: ['analytics'], exact: false })
      setEditingTask(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: async () => {
      // Remove completamente os dados antigos do cache
      await queryClient.resetQueries({ queryKey: ['tasks'] })
      await queryClient.resetQueries({ queryKey: ['analytics'], exact: false })
    },
  })

  const handleCreate = (data: CreateTaskDto) => {
    createMutation.mutate(data)
  }

  const handleUpdate = (id: string, data: UpdateTaskDto) => {
    updateMutation.mutate({ id, data })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  // Filter tasks by search query
  const filteredTasks = data?.data.filter(task => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    )
  }) || []

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Minhas Tarefas</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie e acompanhe suas atividades
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton tasks={filteredTasks} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Lista
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Kanban
          </button>
        </div>
      </div>

      {viewMode === 'list' && <TaskFilters />}

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando tarefas...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Erro ao carregar tarefas. Tente novamente.
        </div>
      )}

      {data && (
        <>
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Encontradas {filteredTasks.length} tarefa(s) para "{searchQuery}"
            </div>
          )}

          {viewMode === 'list' ? (
            <TaskList
              tasks={filteredTasks}
              meta={data.meta}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ) : (
            <KanbanView
              tasks={filteredTasks}
              onUpdate={handleUpdate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}

      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(data) => handleUpdate(editingTask.id, data)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  )
}
