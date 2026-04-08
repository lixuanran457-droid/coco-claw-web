import { defineStore } from 'pinia'

export interface OrderItem {
  id: number
  skillId: number
  skillName: string
  skillIcon: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  orderNo: string
  status: number
  statusName: string
  totalAmount: number
  payAmount: number
  paymentMethod: string
  createTime: string
  payTime?: string
  expireTime?: string
  email?: string
  items?: OrderItem[]
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  page: number
  pageSize: number
  total: number
}

const API_BASE_URL = '/api'

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0
  }),

  getters: {
    isAuthenticated: () => {
      if (process.client) {
        return localStorage.getItem('auth_isLoggedIn') === 'true'
      }
      return false
    }
  },

  actions: {
    // Create payment (supports guest)
    async createPayment(params: {
      skillId: number
      email?: string
      paymentMethod: string
    }) {
      this.loading = true
      this.error = null

      try {
        // Get userId from localStorage if logged in
        let userId: number | null = null
        if (process.client) {
          const userStr = localStorage.getItem('user_info')
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              userId = user.id
            } catch {
              // ignore
            }
          }
        }

        // Build request body
        const body: any = {
          skillId: params.skillId,
          paymentMethod: params.paymentMethod
        }

        // If not logged in, require email
        if (!userId) {
          if (!params.email || !params.email.includes('@')) {
            throw new Error('请填写邮箱地址')
          }
          body.email = params.email
        }

        const response = await $fetch<{
          code: number
          message: string
          data: any
        }>(`${API_BASE_URL}/payment/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body
        })

        if (response.code === 200) {
          return { success: true, data: response.data }
        } else {
          throw new Error(response.message || '创建订单失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '创建订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Get payment status
    async getPaymentStatus(orderId: number) {
      try {
        const response = await $fetch<{
          code: number
          data: any
        }>(`${API_BASE_URL}/payment/status/${orderId}`)

        if (response.code === 200) {
          return { success: true, data: response.data }
        }
        return { success: false }
      } catch {
        return { success: false }
      }
    },

    // Get order list (user only)
    async fetchOrders(params?: { page?: number; pageSize?: number; status?: number }) {
      if (!this.isAuthenticated) {
        this.error = '请先登录'
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          code: number
          data: {
            records: Order[]
            total: number
            current: number
            size: number
          }
        }>(`${API_BASE_URL}/orders/list`, {
          params: {
            page: params?.page || this.page,
            pageSize: params?.pageSize || this.pageSize,
            status: params?.status
          }
        })

        if (response.code === 200) {
          this.orders = response.data.records
          this.total = response.data.total
          this.page = response.data.current
          this.pageSize = response.data.size
        }
      } catch (error: any) {
        this.error = error.data?.message || '获取订单列表失败'
      } finally {
        this.loading = false
      }
    },

    // Get order detail
    async fetchOrderById(orderId: number) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          code: number
          data: Order
        }>(`${API_BASE_URL}/orders/${orderId}`)

        if (response.code === 200) {
          this.currentOrder = response.data
        }
      } catch (error: any) {
        this.error = error.data?.message || '获取订单详情失败'
      } finally {
        this.loading = false
      }
    },

    // Cancel order
    async cancelOrder(orderId: number) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          code: number
          message: string
        }>(`${API_BASE_URL}/orders/${orderId}/cancel`, {
          method: 'POST'
        })

        if (response.code === 200) {
          // Refresh order list
          await this.fetchOrders()
          return { success: true }
        } else {
          throw new Error(response.message)
        }
      } catch (error: any) {
        this.error = error.data?.message || '取消订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Guest: send query captcha
    async sendGuestQueryCaptcha(email: string) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          code: number
          message: string
        }>(`${API_BASE_URL}/orders/guest/send-captcha`, {
          method: 'POST',
          params: { email }
        })

        if (response.code === 200) {
          return { success: true, message: response.message }
        } else {
          throw new Error(response.message)
        }
      } catch (error: any) {
        this.error = error.data?.message || '发送验证码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Guest: query orders by email
    async fetchGuestOrders(email: string, captcha: string, params?: { page?: number; pageSize?: number; status?: number }) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{
          code: number
          data: {
            records: Order[]
            total: number
            current: number
            size: number
          }
        }>(`${API_BASE_URL}/orders/guest/list`, {
          params: {
            email,
            captcha,
            page: params?.page || 1,
            pageSize: params?.pageSize || 10,
            status: params?.status
          }
        })

        if (response.code === 200) {
          this.orders = response.data.records
          this.total = response.data.total
          return { success: true }
        } else {
          throw new Error(response.message)
        }
      } catch (error: any) {
        this.error = error.data?.message || '查询订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Clear current order
    clearCurrentOrder() {
      this.currentOrder = null
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
