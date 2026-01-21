'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getOverview,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: productivity, isLoading: productivityLoading } = useQuery({
    queryKey: ['analytics', 'productivity'],
    queryFn: analyticsApi.getProductivity,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: analyticsApi.getTrends,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  if (overviewLoading || productivityLoading || trendsLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando analytics...</p>
      </div>
    )
  }

  const statusData = overview?.byStatus
    ? [
        { name: 'Pendente', value: overview.byStatus.pending },
        { name: 'Em Progresso', value: overview.byStatus.inProgress },
        { name: 'Concluída', value: overview.byStatus.completed },
      ]
    : []

  const priorityData = overview?.byPriority
    ? [
        { name: 'Baixa', value: overview.byPriority.low },
        { name: 'Média', value: overview.byPriority.medium },
        { name: 'Alta', value: overview.byPriority.high },
      ]
    : []

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Dashboard de Produtividade
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 className="text-sm font-semibold opacity-90">Total de Tarefas</h3>
          <p className="text-3xl font-bold mt-2">{overview?.total || 0}</p>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 className="text-sm font-semibold opacity-90">Taxa de Conclusão</h3>
          <p className="text-3xl font-bold mt-2">{overview?.completionRate || 0}%</p>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 className="text-sm font-semibold opacity-90">Score de Produtividade</h3>
          <p className="text-3xl font-bold mt-2">{productivity?.productivityScore || 0}</p>
        </div>

        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <h3 className="text-sm font-semibold opacity-90">Tarefas Atrasadas</h3>
          <p className="text-3xl font-bold mt-2">{overview?.overdue || 0}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Status das Tarefas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value, name) => [value, name]} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Prioridade das Tarefas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <YAxis 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Tendência Semanal</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends?.weeklyTrends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis 
                dataKey="week" 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <YAxis 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ color: 'currentColor' }} className="text-gray-700 dark:text-gray-300" />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Criadas" />
              <Line type="monotone" dataKey="completed" stroke="#10b981" name="Concluídas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Conclusões Diárias (7 dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends?.dailyCompletions || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <YAxis 
                stroke="rgba(156, 163, 175, 0.8)"
                style={{ fill: 'currentColor' }}
                className="text-gray-700 dark:text-gray-300"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="completed" fill="#10b981" name="Concluídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Últimos 7 Dias</h3>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{productivity?.tasksLast7Days || 0} tarefas</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {productivity?.completedLast7Days || 0} concluídas
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Últimos 30 Dias</h3>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{productivity?.tasksCreatedLast30Days || 0} criadas</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {productivity?.tasksCompletedLast30Days || 0} concluídas
          </p>
        </div>

        <div className="card bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tempo Médio de Conclusão</h3>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">{productivity?.avgCompletionTime || 0} dias</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Para tarefas concluídas</p>
        </div>
      </div>
    </div>
  )
}
