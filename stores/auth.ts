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
    isAuthenticated: (state) => state.isLoggedIn && !!state.user,
    
    getToken: (state) => state.token
  },

  actions: {
    // Initialize auth state
    // Token从Cookie读取（httpOnly），用户信息从/api/auth/me获取
    async initAuth() {
      if (process.client) {
        this.loading = true
        try {
          // 尝试从API获取用户信息（依赖Cookie中的Token）
          const response = await $fetch<{
            code: number
            data: {
              id: number
              email: string
              nickname: string
              avatar: string
            }
          }>(`${API_BASE_URL}/auth/me`, {
            credentials: 'include' // 携带Cookie
          })

          if (response.code === 200 && response.data) {
            this.user = response.data
            this.isLoggedIn = true
            this.token = 'from_cookie' // 标记Token来自Cookie
          } else {
            this.clearAuth()
          }
        } catch (error: any) {
          // 未登录或Token失效
          this.clearAuth()
        } finally {
          this.loading = false
        }
      }
    },

    // Set token and login state
    // 注意：Token现在由后端设置到Cookie中，前端不再存储
    setAuth(token: string, user: any, remember: boolean = true) {
      this.token = token
      this.isLoggedIn = true
      this.error = null
      this.user = user
      // 注意：不再存储到localStorage，Token由httpOnly Cookie管理
    },

    // Clear auth state (logout)
    clearAuth() {
      this.token = null
      this.isLoggedIn = false
      this.error = null
      this.user = null

      if (process.client) {
        // 清理localStorage中的旧数据（兼容旧版）
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
          params: { email },
          credentials: 'include'
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
        const response = await $fetch<{ code: number; message: string }>(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          body: {
            email: email,
            captchaCode: code
          },
          credentials: 'include'
        })

        return { success: true }
      } catch (error: any) {
        const message = error.data?.message || ''
        if (message.includes('验证码') || message.includes('过期')) {
          this.error = message
          return { success: false, error: message }
        }
        // 用户不存在说明验证码正确
        if (message.includes('用户不存在')) {
          return { success: true }
        }
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
          },
          credentials: 'include' // 携带Cookie
        })

        if (response.code === 200) {
          // 后端已设置Cookie，前端只需存储用户信息
          this.setAuth(response.data.accessToken, response.data.user, credentials.remember ?? true)
          // 存储用户信息到localStorage（用于页面刷新时快速显示）
          if (process.client) {
            localStorage.setItem('user_info', JSON.stringify(response.data.user))
          }
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
          },
          credentials: 'include' // 携带Cookie
        })

        if (response.code === 200) {
          // 后端已设置Cookie，前端只需存储用户信息
          this.setAuth(response.data.accessToken, response.data.user, credentials.remember ?? true)
          // 存储用户信息到localStorage（用于页面刷新时快速显示）
          if (process.client) {
            localStorage.setItem('user_info', JSON.stringify(response.data.user))
          }
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
          },
          credentials: 'include' // 携带Cookie
        })

        if (response.code === 200) {
          // 后端已设置Cookie，前端只需存储用户信息
          this.setAuth(response.data.accessToken, response.data.user, true)
          // 存储用户信息到localStorage
          if (process.client) {
            localStorage.setItem('user_info', JSON.stringify(response.data.user))
          }
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
          body: { email },
          credentials: 'include'
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
          },
          credentials: 'include'
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
          params: { token },
          credentials: 'include'
        })
        return response.code === 200 && response.data === true
      } catch {
        return false
      }
    },

    // Logout
    async logout() {
      try {
        // 调用后端登出接口（会清除Cookie和Token黑名单）
        await $fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include' // 携带Cookie
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
