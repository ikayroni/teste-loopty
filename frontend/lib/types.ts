export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface QueryTaskDto {
  page?: number
  limit?: number
  status?: TaskStatus
  priority?: TaskPriority
  sortBy?: string
  order?: 'ASC' | 'DESC'
}

export interface TasksResponse {
  data: Task[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto extends LoginDto {
  name: string
}

export interface AnalyticsOverview {
  total: number
  completed: number
  pending: number
  inProgress: number
  highPriority: number
  overdue: number
  completionRate: number
  byStatus: {
    pending: number
    inProgress: number
    completed: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
  }
}

export interface ProductivityData {
  tasksLast7Days: number
  completedLast7Days: number
  avgCompletionTime: number
  tasksCreatedLast30Days: number
  tasksCompletedLast30Days: number
  productivityScore: number
}

export interface TrendsData {
  weeklyTrends: Array<{
    week: string
    created: number
    completed: number
    pending: number
  }>
  dailyCompletions: Array<{
    day: string
    completed: number
  }>
}
