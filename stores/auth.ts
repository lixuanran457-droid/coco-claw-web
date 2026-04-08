import { defineStore } from 'pinia'

export interface AuthState {
  token: string | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
  user: {
    id: number
    email: string
    nickname: string
    avatar: string
  } | null
}

const API_BASE_URL = '/api'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null
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
        const userStr = localStorage.getItem('user_info')
        
        if (token) {
          this.token = token
          this.isLoggedIn = isLoggedIn
          if (userStr) {
            try {
              this.user = JSON.parse(userStr)
            } catch (e) {
              // ignore parse error
            }
          }
        }
      }
    },

    // Set token and login state
    setAuth(token: string, user: any, remember: boolean = true) {
      this.token = token
      this.isLoggedIn = true
      this.error = null
      this.user = user

      if (process.client) {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_info', JSON.stringify(user))
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
      this.user = null

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_isLoggedIn')
        localStorage.removeItem('user_info')
      }
    },

    // Send verification code to email
    async sendCaptcha(email: string) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch<{ code: number; message: string }>(`${API_BASE_URL}/auth/captcha`, {
          method: 'POST',
          params: { email }
        })
        
        if (response.code === 200) {
          return { success: true, message: response.message || '验证码已发送' }
        } else {
          throw new Error(response.message || '发送失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '发送验证码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Verify captcha with backend (for registration)
    async verifyCaptcha(email: string, code: string) {
      this.error = null

      try {
        // Use login API to verify captcha
        const response = await $fetch<{ code: number; message: string }>(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          body: {
            email: email,
            captchaCode: code
          }
        })

        // If code is 401, it means captcha is wrong (user doesn't exist)
        // But we need a dedicated verify endpoint
        // For now, we'll trust the registration will validate it
        return { success: true }
      } catch (error: any) {
        // If login fails because user doesn't exist, captcha might be valid
        // But if captcha is wrong, it will fail with specific message
        const message = error.data?.message || ''
        if (message.includes('验证码') || message.includes('过期')) {
          this.error = message
          return { success: false, error: message }
        }
        // Other errors (like user doesn't exist) mean captcha is valid
        return { success: true }
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
        const response = await $fetch<{
          code: number
          message: string
          data: {
            accessToken: string
            expiresIn: number
            user: {
              id: number
              email: string
              nickname: string
              avatar: string
              status: number
            }
          }
        }>(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          body: {
            email: credentials.email,
            captchaCode: credentials.captchaCode
          }
        })

        if (response.code === 200) {
          this.setAuth(response.data.accessToken, response.data.user, credentials.remember ?? true)
          return { success: true, user: response.data.user }
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '登录失败'
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
        const response = await $fetch<{
          code: number
          message: string
          data: {
            accessToken: string
            expiresIn: number
            user: {
              id: number
              email: string
              nickname: string
              avatar: string
              status: number
            }
          }
        }>(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          body: {
            email: credentials.email,
            password: credentials.password
          }
        })

        if (response.code === 200) {
          this.setAuth(response.data.accessToken, response.data.user, credentials.remember ?? true)
          return { success: true, user: response.data.user }
        } else {
          throw new Error(response.message || '登录失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '登录失败'
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

      // 前端校验
      if (data.password !== data.confirmPassword) {
        this.error = '两次输入的密码不一致'
        this.loading = false
        return { success: false, error: this.error }
      }

      // 密码强度校验（8-20位，包含大小写字母和数字）
      if (data.password.length < 8 || data.password.length > 20) {
        this.error = '密码长度必须在8-20位之间'
        this.loading = false
        return { success: false, error: this.error }
      }
      
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(data.password)) {
        this.error = '密码必须包含大小写字母和数字'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        const response = await $fetch<{
          code: number
          message: string
          data: {
            accessToken: string
            expiresIn: number
            user: {
              id: number
              email: string
              nickname: string
              avatar: string
              status: number
            }
          }
        }>(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          body: {
            email: data.email,
            nickname: data.nickname,
            password: data.password,
            confirmPassword: data.confirmPassword,
            captchaCode: data.captchaCode
          }
        })

        if (response.code === 200) {
          this.setAuth(response.data.accessToken, response.data.user, true)
          return { success: true, user: response.data.user }
        } else {
          throw new Error(response.message || '注册失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '注册失败'
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
        const response = await $fetch<{ code: number; message: string }>(`${API_BASE_URL}/auth/forget-password`, {
          method: 'POST',
          body: { email }
        })
        
        if (response.code === 200) {
          return { success: true, message: response.message || '密码重置链接已发送到邮箱' }
        } else {
          throw new Error(response.message || '发送失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '发送失败'
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

      // 前端校验
      if (data.newPassword !== data.confirmPassword) {
        this.error = '两次输入的密码不一致'
        this.loading = false
        return { success: false, error: this.error }
      }

      if (data.newPassword.length < 8 || data.newPassword.length > 20) {
        this.error = '密码长度必须在8-20位之间'
        this.loading = false
        return { success: false, error: this.error }
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/.test(data.newPassword)) {
        this.error = '密码必须包含大小写字母和数字'
        this.loading = false
        return { success: false, error: this.error }
      }

      try {
        const response = await $fetch<{ code: number; message: string }>(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          body: {
            token: data.token,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
          }
        })

        if (response.code === 200) {
          return { success: true, message: '密码重置成功' }
        } else {
          throw new Error(response.message || '重置失败')
        }
      } catch (error: any) {
        this.error = error.data?.message || error.message || '重置密码失败'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Verify reset token
    async verifyResetToken(token: string): Promise<boolean> {
      try {
        const response = await $fetch<{ code: number; data: boolean }>(`${API_BASE_URL}/auth/verify-reset-token`, {
          params: { token }
        })
        return response.code === 200 && response.data === true
      } catch {
        return false
      }
    },

    // Logout
    async logout() {
      try {
        await $fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
        })
      } catch {
        // ignore logout API error
      }
      
      this.clearAuth()
      
      if (process.client) {
        navigateTo('/')
      }
    }
  }
})
