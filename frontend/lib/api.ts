import axios from 'axios'
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  QueryTaskDto,
  TasksResponse,
  AnalyticsOverview,
  ProductivityData,
  TrendsData,
  User,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

// Tasks API
export const tasksApi = {
  getAll: async (params?: QueryTaskDto): Promise<TasksResponse> => {
    const response = await api.get('/tasks', { params })
    return response.data
  },

  getOne: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post('/tasks', data)
    return response.data
  },

  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

// Analytics API
export const analyticsApi = {
  getOverview: async (): Promise<AnalyticsOverview> => {
    const response = await api.get('/analytics/overview')
    return response.data
  },

  getProductivity: async (): Promise<ProductivityData> => {
    const response = await api.get('/analytics/productivity')
    return response.data
  },

  getTrends: async (): Promise<TrendsData> => {
    const response = await api.get('/analytics/trends')
    return response.data
  },
}

export default api
