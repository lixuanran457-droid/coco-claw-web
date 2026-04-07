import { defineStore } from 'pinia'

export interface AuthState {
  token: string | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.token,
    
    getToken: (state) => state.token
  },

  actions: {
    // Initialize auth state from localStorage
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const isLoggedIn = localStorage.getItem('auth_isLoggedIn') === 'true'
        
        if (token) {
          this.token = token
          this.isLoggedIn = isLoggedIn
        }
      }
    },

    // Set token and login state
    setAuth(token: string, remember: boolean = true) {
      this.token = token
      this.isLoggedIn = true
      this.error = null

      if (process.client) {
        localStorage.setItem('auth_token', token)
        if (remember) {
          localStorage.setItem('auth_isLoggedIn', 'true')
        }
      }
    },

    // Clear auth state (logout)
    clearAuth() {
      this.token = null
      this.isLoggedIn = false
      this.error = null

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_isLoggedIn')
      }
    },

    // Login
    async login(credentials: {
      account: string
      password: string
      remember?: boolean
    }) {
      this.loading = true
      this.error = null

      try {
        // Mock login - replace with actual API call
        // In production: const { api } = useApi()
        // const response = await api.login(credentials)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock successful login
        const mockToken = `mock_token_${Date.now()}`
        const mockUser = {
          id: 'user_' + Date.now(),
          username: credentials.account,
          phone: credentials.account,
          email: '',
          avatar: '',
          nickname: credentials.account
        }
        
        // Store token and user data
        this.setAuth(mockToken, credentials.remember ?? true)
        
        // Also store user data
        if (process.client) {
          localStorage.setItem('user_info', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error: any) {
        this.error = error.message || '登录失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Register
    async register(data: {
      username: string
      password: string
      confirmPassword: string
      phone?: string
      email?: string
      code?: string
    }) {
      this.loading = true
      this.error = null

      // Validate password match
      if (data.password !== data.confirmPassword) {
        this.error = '两次输入的密码不一致'
        this.loading = false
        return { success: false, error: this.error }
      }

      // Validate password strength
      if (data.password.length < 6) {
        this.error = '密码长度不能少于6位'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        // Mock register - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock successful registration
        const mockToken = `mock_token_${Date.now()}`
        const mockUser = {
          id: 'user_' + Date.now(),
          username: data.username,
          phone: data.phone || '',
          email: data.email || '',
          avatar: '',
          nickname: data.username
        }
        
        // Auto login after registration
        this.setAuth(mockToken, true)
        
        if (process.client) {
          localStorage.setItem('user_info', JSON.stringify(mockUser))
        }

        return { success: true, user: mockUser }
      } catch (error: any) {
        this.error = error.message || '注册失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Send verification code
    async sendCode(phone: string, type: 'register' | 'reset' = 'register') {
      this.loading = true
      this.error = null

      try {
        // Mock send code - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Simulate code sent successfully
        return { success: true, message: '验证码已发送' }
      } catch (error: any) {
        this.error = error.message || '发送验证码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Reset password
    async resetPassword(data: {
      phone: string
      code: string
      newPassword: string
      confirmPassword: string
    }) {
      this.loading = true
      this.error = null

      // Validate password match
      if (data.newPassword !== data.confirmPassword) {
        this.error = '两次输入的密码不一致'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        // Mock reset password - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        return { success: true, message: '密码重置成功' }
      } catch (error: any) {
        this.error = error.message || '重置密码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      this.clearAuth()
      
      if (process.client) {
        localStorage.removeItem('user_info')
      }
      
      // Redirect to home
      navigateTo('/')
    }
  }
})
