'use client'

import { useState } from 'react'
import { Task, TaskStatus, UpdateTaskDto } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface KanbanViewProps {
  tasks: Task[]
  onUpdate: (id: string, data: UpdateTaskDto) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors = {
  low: 'bg-gray-100 dark:bg-gray-500/10 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500/30',
  medium: 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-500/30',
  high: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/30',
}

export default function KanbanView({ tasks, onUpdate, onEdit, onDelete }: KanbanViewProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const columns = {
    [TaskStatus.PENDING]: { title: 'A Fazer', color: 'border-yellow-400 dark:border-yellow-500' },
    [TaskStatus.IN_PROGRESS]: { title: 'Em Progresso', color: 'border-blue-400 dark:border-blue-500' },
    [TaskStatus.COMPLETED]: { title: 'Concluído', color: 'border-green-400 dark:border-green-500' },
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      onUpdate(draggedTask.id, { status })
    }
    setDraggedTask(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(columns).map(([status, { title, color }]) => (
        <div
          key={status}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(status as TaskStatus)}
          className={`bg-gray-50 dark:bg-gray-800/30 dark:backdrop-blur-sm rounded-xl p-4 border-t-4 ${color}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <span className="text-sm bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
              {getTasksByStatus(status as TaskStatus).length}
            </span>
          </div>

          <div className="space-y-3">
            {getTasksByStatus(status as TaskStatus).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task)}
                className="group bg-white dark:bg-gray-800/70 dark:backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-move transition-all duration-200"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-md ${priorityColors[task.priority]}`}>
                    {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {format(new Date(task.dueDate), 'dd/MM', { locale: ptBR })}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(task)}
                    className="flex-1 text-xs py-1.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="flex-1 text-xs py-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}

            {getTasksByStatus(status as TaskStatus).length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                Nenhuma tarefa
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
