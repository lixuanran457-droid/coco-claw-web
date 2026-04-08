import axios from 'axios'

const config = useRuntimeConfig()

export const useApi = () => {
  const apiBase = config.public.apiBase || 'http://localhost:8080/api'
  
  const apiClient = axios.create({
    baseURL: apiBase,
    timeout: 10000,
    withCredentials: true, // 携带Cookie（替代手动添加Authorization Header）
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      // Token现在由后端通过httpOnly Cookie管理
      // 前端不再需要手动添加Authorization Header
      // withCredentials: true 已经会自动携带Cookie
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
        // Handle unauthorized - 清除本地状态，让用户重新登录
        console.error('Unauthorized access - token may be expired')
        if (process.client) {
          const authStore = useAuthStore()
          authStore.clearAuth()
        }
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
  },

  // Auth APIs
  login: (credentials: { account: string; password: string }) => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/login', credentials)
  },

  register: (data: {
    username: string
    password: string
    phone?: string
    email?: string
    code?: string
  }) => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/register', data)
  },

  sendCode: (phone: string, type: 'register' | 'reset' = 'register') => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/send-code', { phone, type })
  },

  resetPassword: (data: {
    phone: string
    code: string
    newPassword: string
  }) => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/reset-password', data)
  },

  logout: () => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/logout')
  },

  refreshToken: () => {
    const { apiClient } = useApi()
    return apiClient.post('/auth/refresh-token')
  },

  // User APIs
  getUserInfo: () => {
    const { apiClient } = useApi()
    return apiClient.get('/user/info')
  },

  updateUserInfo: (data: {
    nickname?: string
    phone?: string
    email?: string
    avatar?: string
    gender?: string
    birthday?: string
  }) => {
    const { apiClient } = useApi()
    return apiClient.put('/user/info', data)
  },

  uploadAvatar: (file: File) => {
    const { apiClient } = useApi()
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Address APIs
  getAddresses: () => {
    const { apiClient } = useApi()
    return apiClient.get('/user/addresses')
  },

  addAddress: (address: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault?: boolean
    label?: string
  }) => {
    const { apiClient } = useApi()
    return apiClient.post('/user/addresses', address)
  },

  updateAddress: (id: string, address: Partial<{
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
    label: string
  }>) => {
    const { apiClient } = useApi()
    return apiClient.put(`/user/addresses/${id}`, address)
  },

  deleteAddress: (id: string) => {
    const { apiClient } = useApi()
    return apiClient.delete(`/user/addresses/${id}`)
  },

  setDefaultAddress: (id: string) => {
    const { apiClient } = useApi()
    return apiClient.put(`/user/addresses/${id}/default`)
  },

  // Coupon APIs
  getCoupons: () => {
    const { apiClient } = useApi()
    return apiClient.get('/user/coupons')
  },

  claimCoupon: (couponId: string) => {
    const { apiClient } = useApi()
    return apiClient.post('/user/coupons/claim', { couponId })
  },

  // Payment APIs
  createPayment: (orderId: string, method: 'alipay' | 'wechat' | 'bankcard') => {
    const { apiClient } = useApi()
    return apiClient.post('/payment/create', { orderId, method })
  },

  getPaymentStatus: (paymentId: string) => {
    const { apiClient } = useApi()
    return apiClient.get(`/payment/status/${paymentId}`)
  },

  cancelPayment: (paymentId: string) => {
    const { apiClient } = useApi()
    return apiClient.post('/payment/cancel', { paymentId })
  }
}
