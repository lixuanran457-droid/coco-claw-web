import { defineStore } from 'pinia'

export interface UserInfo {
  id: string
  username: string
  nickname: string
  phone: string
  email: string
  avatar: string
  gender?: 'male' | 'female' | 'unknown'
  birthday?: string
  createdAt?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
  label?: string // 'home' | 'work' | 'other'
}

export interface Coupon {
  id: string
  name: string
  type: 'discount' | 'cash'
  value: number // 折扣率(0-1) 或 代金券金额
  minAmount: number // 最低消费金额
  validFrom: string
  validUntil: string
  status: 'unused' | 'used' | 'expired'
  usedAt?: string
}

export interface UserState {
  userInfo: UserInfo | null
  addresses: Address[]
  coupons: Coupon[]
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    addresses: [],
    coupons: [],
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: () => {
      const authStore = useAuthStore()
      return authStore.isLoggedIn
    },
    
    defaultAddress: (state) => {
      return state.addresses.find(addr => addr.isDefault) || state.addresses[0] || null
    },
    
    validCoupons: (state) => {
      const now = new Date().toISOString()
      return state.coupons.filter(coupon => 
        coupon.status === 'unused' && 
        coupon.validUntil > now &&
        coupon.validFrom < now
      )
    },
    
    usedCoupons: (state) => {
      return state.coupons.filter(coupon => coupon.status === 'used')
    },
    
    expiredCoupons: (state) => {
      return state.coupons.filter(coupon => coupon.status === 'expired' || coupon.validUntil < new Date().toISOString())
    }
  },

  actions: {
    // Initialize user data from localStorage
    initUser() {
      if (process.client) {
        const userInfo = localStorage.getItem('user_info')
        if (userInfo) {
          try {
            this.userInfo = JSON.parse(userInfo)
          } catch (e) {
            console.error('Failed to parse user info:', e)
          }
        }

        const addresses = localStorage.getItem('user_addresses')
        if (addresses) {
          try {
            this.addresses = JSON.parse(addresses)
          } catch (e) {
            console.error('Failed to parse addresses:', e)
          }
        }

        const coupons = localStorage.getItem('user_coupons')
        if (coupons) {
          try {
            this.coupons = JSON.parse(coupons)
          } catch (e) {
            console.error('Failed to parse coupons:', e)
          }
        }
      }
    },

    // Set user info
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      if (process.client) {
        localStorage.setItem('user_info', JSON.stringify(userInfo))
      }
    },

    // Update user profile
    async updateProfile(data: Partial<UserInfo>) {
      this.loading = true
      this.error = null

      try {
        // Mock update - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (this.userInfo) {
          this.userInfo = { ...this.userInfo, ...data }
          if (process.client) {
            localStorage.setItem('user_info', JSON.stringify(this.userInfo))
          }
        }
        
        return { success: true }
      } catch (error: any) {
        this.error = error.message || '更新失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Fetch user info from API
    async fetchUserInfo() {
      this.loading = true
      this.error = null

      try {
        // Mock fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock user data
        const mockUser: UserInfo = {
          id: 'user_001',
          username: 'cyber_user',
          nickname: '赛博朋克侠',
          phone: '138****8888',
          email: 'user@example.com',
          avatar: '',
          gender: 'unknown',
          createdAt: '2024-01-01'
        }
        
        this.setUserInfo(mockUser)
        return { success: true, user: mockUser }
      } catch (error: any) {
        this.error = error.message || '获取用户信息失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Address management
    async fetchAddresses() {
      this.loading = true
      this.error = null

      try {
        // Mock fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock address data
        const mockAddresses: Address[] = [
          {
            id: 'addr_001',
            name: '张三',
            phone: '13800138000',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            detail: '科技园南区XX路XX号',
            isDefault: true,
            label: 'home'
          },
          {
            id: 'addr_002',
            name: '李四',
            phone: '13900139000',
            province: '广东省',
            city: '广州市',
            district: '天河区',
            detail: '珠江新城XX大厦XX层',
            isDefault: false,
            label: 'work'
          }
        ]
        
        this.addresses = mockAddresses
        this.saveAddresses()
        
        return { success: true, addresses: mockAddresses }
      } catch (error: any) {
        this.error = error.message || '获取地址失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Add address
    async addAddress(address: Omit<Address, 'id'>) {
      this.loading = true
      this.error = null

      try {
        // If this is the first address or set as default, update other addresses
        if (address.isDefault) {
          this.addresses.forEach(addr => addr.isDefault = false)
        }

        const newAddress: Address = {
          ...address,
          id: `addr_${Date.now()}`
        }
        
        this.addresses.push(newAddress)
        this.saveAddresses()
        
        return { success: true, address: newAddress }
      } catch (error: any) {
        this.error = error.message || '添加地址失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Update address
    async updateAddress(id: string, address: Partial<Address>) {
      this.loading = true
      this.error = null

      try {
        const index = this.addresses.findIndex(addr => addr.id === id)
        if (index === -1) {
          return { success: false, error: '地址不存在' }
        }

        // If setting as default, update other addresses
        if (address.isDefault) {
          this.addresses.forEach(addr => addr.isDefault = false)
        }

        this.addresses[index] = { ...this.addresses[index], ...address }
        this.saveAddresses()
        
        return { success: true, address: this.addresses[index] }
      } catch (error: any) {
        this.error = error.message || '更新地址失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Delete address
    async deleteAddress(id: string) {
      this.loading = true
      this.error = null

      try {
        const index = this.addresses.findIndex(addr => addr.id === id)
        if (index === -1) {
          return { success: false, error: '地址不存在' }
        }

        const wasDefault = this.addresses[index].isDefault
        this.addresses.splice(index, 1)
        
        // If deleted address was default, set first address as default
        if (wasDefault && this.addresses.length > 0) {
          this.addresses[0].isDefault = true
        }
        
        this.saveAddresses()
        
        return { success: true }
      } catch (error: any) {
        this.error = error.message || '删除地址失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Set default address
    async setDefaultAddress(id: string) {
      return this.updateAddress(id, { isDefault: true })
    },

    // Save addresses to localStorage
    saveAddresses() {
      if (process.client) {
        localStorage.setItem('user_addresses', JSON.stringify(this.addresses))
      }
    },

    // Fetch coupons
    async fetchCoupons() {
      this.loading = true
      this.error = null

      try {
        // Mock fetch - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock coupon data
        const mockCoupons: Coupon[] = [
          {
            id: 'cpn_001',
            name: '新人专享券',
            type: 'cash',
            value: 20,
            minAmount: 100,
            validFrom: '2024-01-01',
            validUntil: '2026-12-31',
            status: 'unused'
          },
          {
            id: 'cpn_002',
            name: '满减券',
            type: 'cash',
            value: 50,
            minAmount: 200,
            validFrom: '2024-01-01',
            validUntil: '2026-12-31',
            status: 'unused'
          },
          {
            id: 'cpn_003',
            name: '9折折扣券',
            type: 'discount',
            value: 0.1,
            minAmount: 50,
            validFrom: '2024-01-01',
            validUntil: '2026-06-30',
            status: 'used',
            usedAt: '2024-03-15'
          }
        ]
        
        this.coupons = mockCoupons
        this.saveCoupons()
        
        return { success: true, coupons: mockCoupons }
      } catch (error: any) {
        this.error = error.message || '获取优惠券失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Save coupons to localStorage
    saveCoupons() {
      if (process.client) {
        localStorage.setItem('user_coupons', JSON.stringify(this.coupons))
      }
    },

    // Clear user data (logout)
    clearUser() {
      this.userInfo = null
      this.addresses = []
      this.coupons = []
      
      if (process.client) {
        localStorage.removeItem('user_info')
        localStorage.removeItem('user_addresses')
        localStorage.removeItem('user_coupons')
      }
    }
  }
})
