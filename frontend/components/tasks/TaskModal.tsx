import { useState, useEffect } from 'react'
import type { Task, CreateTaskDto } from '@/lib/types'
import { TaskStatus, TaskPriority } from '@/lib/types'

interface TaskModalProps {
  task?: Task
  onClose: () => void
  onSubmit: (data: CreateTaskDto) => void
  isLoading: boolean
}

export default function TaskModal({
  task,
  onClose,
  onSubmit,
  isLoading,
}: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: undefined,
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : undefined,
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {task ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="input"
              required
              minLength={3}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value={TaskStatus.PENDING}>Pendente</option>
              <option value={TaskStatus.IN_PROGRESS}>Em Progresso</option>
              <option value={TaskStatus.COMPLETED}>Concluída</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              <option value={TaskPriority.LOW}>Baixa</option>
              <option value={TaskPriority.MEDIUM}>Média</option>
              <option value={TaskPriority.HIGH}>Alta</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Data de Vencimento
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate || ''}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Salvando...' : task ? 'Atualizar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
