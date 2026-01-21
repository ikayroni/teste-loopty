'use client'

import { Task } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ExportButtonProps {
  tasks: Task[]
}

const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  completed: 'Concluída',
}

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export default function ExportButton({ tasks }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = ['Título', 'Descrição', 'Status', 'Prioridade', 'Data de Vencimento', 'Criado em']
    const rows = tasks.map(task => [
      task.title,
      task.description || '',
      statusLabels[task.status],
      priorityLabels[task.priority],
      task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: ptBR }) : '',
      format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `tarefas_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const exportToPDF = () => {
    // Simplified PDF export - creates a printable HTML version
    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tarefas - ${format(new Date(), 'dd/MM/yyyy')}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #2563eb; color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .pending { background: #fef3c7; color: #92400e; }
            .in_progress { background: #dbeafe; color: #1e40af; }
            .completed { background: #d1fae5; color: #065f46; }
          </style>
        </head>
        <body>
          <h1>Minhas Tarefas</h1>
          <p>Exportado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Vencimento</th>
              </tr>
            </thead>
            <tbody>
              ${tasks.map(task => `
                <tr>
                  <td>
                    <strong>${task.title}</strong>
                    ${task.description ? `<br><small>${task.description}</small>` : ''}
                  </td>
                  <td><span class="status ${task.status}">${statusLabels[task.status]}</span></td>
                  <td>${priorityLabels[task.priority]}</td>
                  <td>${task.dueDate ? format(new Date(task.dueDate), 'dd/MM/yyyy') : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="relative group">
      <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Exportar
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <button
          onClick={exportToCSV}
          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg flex items-center transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
        <button
          onClick={exportToPDF}
          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg flex items-center transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Exportar PDF
        </button>
      </div>
    </div>
  )
}
