import axios from 'axios'

const config = useRuntimeConfig()

export const useApi = () => {
  const apiBase = config.public.apiBase || 'http://localhost:8080/api'
  
  const apiClient = axios.create({
    baseURL: apiBase,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = process.client ? localStorage.getItem('auth_token') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        console.error('Unauthorized access')
      }
      return Promise.reject(error)
    }
  )

  return {
    apiClient
  }
}

// API Methods
export const api = {
  // Skills
  getSkills: (params?: {
    page?: number
    pageSize?: number
    category?: string
    sort?: string
    keyword?: string
  }) => {
    const { apiClient } = useApi()
    return apiClient.get('/skills', { params })
  },

  getSkillById: (id: string) => {
    const { apiClient } = useApi()
    return apiClient.get(`/skills/${id}`)
  },

  getSkillCategories: () => {
    const { apiClient } = useApi()
    return apiClient.get('/skills/categories')
  },

  // Cart
  getCart: () => {
    const { apiClient } = useApi()
    return apiClient.get('/cart')
  },

  addToCart: (skillId: string, quantity: number = 1) => {
    const { apiClient } = useApi()
    return apiClient.post('/cart', { skillId, quantity })
  },

  updateCartItem: (itemId: string, quantity: number) => {
    const { apiClient } = useApi()
    return apiClient.put(`/cart/${itemId}`, { quantity })
  },

  removeFromCart: (itemId: string) => {
    const { apiClient } = useApi()
    return apiClient.delete(`/cart/${itemId}`)
  },

  clearCart: () => {
    const { apiClient } = useApi()
    return apiClient.delete('/cart')
  },

  // Orders
  createOrder: (orderData: {
    items: Array<{ skillId: string; quantity: number }>
    totalAmount: number
  }) => {
    const { apiClient } = useApi()
    return apiClient.post('/orders', orderData)
  },

  getOrders: (params?: { page?: number; pageSize?: number }) => {
    const { apiClient } = useApi()
    return apiClient.get('/orders', { params })
  },

  getOrderById: (id: string) => {
    const { apiClient } = useApi()
    return apiClient.get(`/orders/${id}`)
  },

  // Statistics
  getStats: () => {
    const { apiClient } = useApi()
    return apiClient.get('/stats')
  },

  getTopSkills: (limit: number = 4) => {
    const { apiClient } = useApi()
    return apiClient.get('/skills/top', { params: { limit } })
  }
}
