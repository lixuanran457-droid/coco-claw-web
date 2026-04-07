import { defineStore } from 'pinia'

export interface OrderItem {
  id: string
  skillId: string
  skillName: string
  skillIcon: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNo: string
  status: 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded'
  statusText: string
  items: OrderItem[]
  totalAmount: number
  actualAmount: number
  discount: number
  couponId?: string
  couponName?: string
  address: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
  paymentMethod?: 'alipay' | 'wechat' | 'bankcard'
  paymentTime?: string
  createdAt: string
  updatedAt: string
  expireAt?: string // For pending orders
  remark?: string
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  filter: 'all' | 'pending' | 'paid' | 'completed' | 'cancelled'
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    filter: 'all'
  }),

  getters: {
    filteredOrders: (state) => {
      if (state.filter === 'all') {
        return state.orders
      }
      return state.orders.filter(order => {
        switch (state.filter) {
          case 'pending':
            return order.status === 'pending'
          case 'paid':
            return order.status === 'paid'
          case 'completed':
            return order.status === 'completed'
          case 'cancelled':
            return order.status === 'cancelled' || order.status === 'refunded'
          default:
            return true
        }
      })
    },
    
    pendingOrders: (state) => {
      return state.orders.filter(order => order.status === 'pending')
    },
    
    completedOrders: (state) => {
      return state.orders.filter(order => order.status === 'completed')
    },
    
    orderCount: (state) => {
      return {
        all: state.orders.length,
        pending: state.orders.filter(o => o.status === 'pending').length,
        paid: state.orders.filter(o => o.status === 'paid').length,
        completed: state.orders.filter(o => o.status === 'completed').length,
        cancelled: state.orders.filter(o => o.status === 'cancelled' || o.status === 'refunded').length
      }
    }
  },

  actions: {
    // Set current filter
    setFilter(filter: OrderState['filter']) {
      this.filter = filter
    },

    // Fetch orders
    async fetchOrders(params?: { status?: string; page?: number; pageSize?: number }) {
      this.loading = true
      this.error = null

      try {
        // Mock fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock order data
        const mockOrders: Order[] = [
          {
            id: 'order_001',
            orderNo: 'CC2026040700001',
            status: 'pending',
            statusText: '待支付',
            items: [
              {
                id: 'item_001',
                skillId: 'skill_001',
                skillName: 'AI写作助手',
                skillIcon: '✍️',
                price: 99,
                quantity: 1
              }
            ],
            totalAmount: 99,
            actualAmount: 99,
            discount: 0,
            address: {
              name: '张三',
              phone: '13800138000',
              province: '广东省',
              city: '深圳市',
              district: '南山区',
              detail: '科技园XX路XX号'
            },
            createdAt: '2026-04-07 10:00:00',
            updatedAt: '2026-04-07 10:00:00',
            expireAt: '2026-04-08 10:00:00'
          },
          {
            id: 'order_002',
            orderNo: 'CC2026040600001',
            status: 'paid',
            statusText: '已支付',
            items: [
              {
                id: 'item_002',
                skillId: 'skill_002',
                skillName: '数据可视化工具',
                skillIcon: '📊',
                price: 199,
                quantity: 1
              },
              {
                id: 'item_003',
                skillId: 'skill_003',
                skillName: '自动化脚本',
                skillIcon: '⚡',
                price: 59,
                quantity: 2
              }
            ],
            totalAmount: 317,
            actualAmount: 297,
            discount: 20,
            couponId: 'cpn_001',
            couponName: '新人专享券',
            address: {
              name: '李四',
              phone: '13900139000',
              province: '广东省',
              city: '广州市',
              district: '天河区',
              detail: '珠江新城XX大厦'
            },
            paymentMethod: 'alipay',
            paymentTime: '2026-04-06 15:30:00',
            createdAt: '2026-04-06 15:00:00',
            updatedAt: '2026-04-06 15:30:00'
          },
          {
            id: 'order_003',
            orderNo: 'CC2026040500001',
            status: 'completed',
            statusText: '已完成',
            items: [
              {
                id: 'item_004',
                skillId: 'skill_004',
                skillName: '图像识别引擎',
                skillIcon: '🖼️',
                price: 299,
                quantity: 1
              }
            ],
            totalAmount: 299,
            actualAmount: 299,
            discount: 0,
            address: {
              name: '王五',
              phone: '13700137000',
              province: '北京市',
              city: '北京市',
              district: '朝阳区',
              detail: '望京SOHO XX层'
            },
            paymentMethod: 'wechat',
            paymentTime: '2026-04-05 09:15:00',
            createdAt: '2026-04-05 09:00:00',
            updatedAt: '2026-04-05 09:15:00'
          }
        ]
        
        this.orders = mockOrders
        this.saveOrders()
        
        return { success: true, orders: mockOrders }
      } catch (error: any) {
        this.error = error.message || '获取订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Fetch single order
    async fetchOrderById(id: string) {
      this.loading = true
      this.error = null

      try {
        // Mock fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const order = this.orders.find(o => o.id === id) || this.orders[0]
        if (!order) {
          return { success: false, error: '订单不存在' }
        }
        
        this.currentOrder = order
        
        return { success: true, order }
      } catch (error: any) {
        this.error = error.message || '获取订单详情失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Create order
    async createOrder(data: {
      items: Array<{ skillId: string; skillName: string; skillIcon: string; price: number; quantity: number }>
      address: Order['address']
      couponId?: string
      totalAmount: number
      actualAmount: number
      discount: number
    }) {
      this.loading = true
      this.error = null

      try {
        // Mock create - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const orderNo = `CC${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Date.now()).slice(-6)}`
        
        const newOrder: Order = {
          id: `order_${Date.now()}`,
          orderNo,
          status: 'pending',
          statusText: '待支付',
          items: data.items.map((item, index) => ({
            ...item,
            id: `item_${Date.now()}_${index}`
          })),
          totalAmount: data.totalAmount,
          actualAmount: data.actualAmount,
          discount: data.discount,
          couponId: data.couponId,
          couponName: data.couponId ? '优惠券' : undefined,
          address: data.address,
          createdAt: new Date().toLocaleString('zh-CN'),
          updatedAt: new Date().toLocaleString('zh-CN'),
          expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
        }
        
        this.orders.unshift(newOrder)
        this.currentOrder = newOrder
        this.saveOrders()
        
        return { success: true, order: newOrder }
      } catch (error: any) {
        this.error = error.message || '创建订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Pay order
    async payOrder(id: string, paymentMethod: 'alipay' | 'wechat' | 'bankcard') {
      this.loading = true
      this.error = null

      try {
        // Mock pay - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const order = this.orders.find(o => o.id === id)
        if (!order) {
          return { success: false, error: '订单不存在' }
        }
        
        order.status = 'paid'
        order.statusText = '已支付'
        order.paymentMethod = paymentMethod
        order.paymentTime = new Date().toLocaleString('zh-CN')
        order.updatedAt = new Date().toLocaleString('zh-CN')
        
        if (this.currentOrder?.id === id) {
          this.currentOrder = order
        }
        
        this.saveOrders()
        
        return { success: true, order }
      } catch (error: any) {
        this.error = error.message || '支付失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Cancel order
    async cancelOrder(id: string, reason?: string) {
      this.loading = true
      this.error = null

      try {
        // Mock cancel - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const order = this.orders.find(o => o.id === id)
        if (!order) {
          return { success: false, error: '订单不存在' }
        }
        
        if (order.status !== 'pending') {
          return { success: false, error: '该订单无法取消' }
        }
        
        order.status = 'cancelled'
        order.statusText = '已取消'
        order.remark = reason
        order.updatedAt = new Date().toLocaleString('zh-CN')
        
        if (this.currentOrder?.id === id) {
          this.currentOrder = order
        }
        
        this.saveOrders()
        
        return { success: true, order }
      } catch (error: any) {
        this.error = error.message || '取消订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete order
    async deleteOrder(id: string) {
      this.loading = true
      this.error = null

      try {
        const index = this.orders.findIndex(o => o.id === id)
        if (index === -1) {
          return { success: false, error: '订单不存在' }
        }
        
        this.orders.splice(index, 1)
        
        if (this.currentOrder?.id === id) {
          this.currentOrder = null
        }
        
        this.saveOrders()
        
        return { success: true }
      } catch (error: any) {
        this.error = error.message || '删除订单失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Save orders to localStorage
    saveOrders() {
      if (process.client) {
        localStorage.setItem('user_orders', JSON.stringify(this.orders))
      }
    },

    // Load orders from localStorage
    loadOrders() {
      if (process.client) {
        const saved = localStorage.getItem('user_orders')
        if (saved) {
          try {
            this.orders = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse orders:', e)
          }
        }
      }
    },

    // Clear orders (logout)
    clearOrders() {
      this.orders = []
      this.currentOrder = null
      
      if (process.client) {
        localStorage.removeItem('user_orders')
      }
    }
  }
})
