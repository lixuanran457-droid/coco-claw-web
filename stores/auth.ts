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

    // Send verification code to email
    async sendCaptcha(email: string) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/captcha', {
        //   method: 'POST',
        //   body: { email }
        // })
        
        // Mock: simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return { success: true, message: '验证码已发送' }
      } catch (error: any) {
        this.error = error.message || '发送验证码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Login with email + captcha
    async loginByCaptcha(credentials: {
      email: string
      captchaCode: string
      remember?: boolean
    }) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/login', {
        //   method: 'POST',
        //   body: {
        //     email: credentials.email,
        //     captchaCode: credentials.captchaCode
        //   }
        // })
        
        // Mock: simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`
        const mockUser = {
          id: 'user_' + Date.now(),
          email: credentials.email,
          nickname: '用户' + Math.floor(Math.random() * 10000),
          avatar: ''
        }
        
        this.setAuth(mockToken, credentials.remember ?? true)
        
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

    // Login with email + password
    async loginByPassword(credentials: {
      email: string
      password: string
      remember?: boolean
    }) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/login', {
        //   method: 'POST',
        //   body: {
        //     email: credentials.email,
        //     password: credentials.password
        //   }
        // })
        
        // Mock: simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`
        const mockUser = {
          id: 'user_' + Date.now(),
          email: credentials.email,
          nickname: '用户' + Math.floor(Math.random() * 10000),
          avatar: ''
        }
        
        this.setAuth(mockToken, credentials.remember ?? true)
        
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

    // Register with email
    async register(data: {
      email: string
      nickname?: string
      password: string
      confirmPassword: string
      captchaCode: string
    }) {
      this.loading = true
      this.error = null

      // Validate password match
      if (data.password !== data.confirmPassword) {
        this.error = '两次输入的密码不一致'
        this.loading = false
        return { success: false, error: this.error }
      }

      // Validate password strength (8-20 characters)
      if (data.password.length < 8 || data.password.length > 20) {
        this.error = '密码长度必须在8-20位之间'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/register', {
        //   method: 'POST',
        //   body: {
        //     email: data.email,
        //     nickname: data.nickname,
        //     password: data.password,
        //     confirmPassword: data.confirmPassword,
        //     captchaCode: data.captchaCode
        //   }
        // })
        
        // Mock: simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`
        const mockUser = {
          id: 'user_' + Date.now(),
          email: data.email,
          nickname: data.nickname || '用户' + Math.floor(Math.random() * 10000),
          avatar: ''
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

    // Send forgot password email
    async sendForgotPasswordEmail(email: string) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/forget-password', {
        //   method: 'POST',
        //   body: { email }
        // })
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        return { success: true, message: '密码重置链接已发送到邮箱' }
      } catch (error: any) {
        this.error = error.message || '发送失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Reset password with token
    async resetPassword(data: {
      token: string
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

      // Validate password strength
      if (data.newPassword.length < 8 || data.newPassword.length > 20) {
        this.error = '密码长度必须在8-20位之间'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        // TODO: Replace with actual API call
        // const response = await $fetch('/api/auth/reset-password', {
        //   method: 'POST',
        //   body: {
        //     token: data.token,
        //     newPassword: data.newPassword,
        //     confirmPassword: data.confirmPassword
        //   }
        // })
        
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
      
      navigateTo('/')
    }
  }
})
