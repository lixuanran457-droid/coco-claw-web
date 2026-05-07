<template>
  <div class="login-page min-h-screen bg-cyber-darker flex flex-col">
    <!-- Background Effects -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyber-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <div class="relative px-4 pt-12 pb-6">
      <button 
        @click="$router.back()" 
        class="absolute left-4 top-12 p-2 rounded-lg hover:bg-cyber-card transition-colors"
      >
        <span class="text-xl">←</span>
      </button>
    </div>

    <!-- Logo Section -->
    <div class="relative px-6 mb-12">
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 rounded-2xl bg-cyber-gradient flex items-center justify-center text-4xl mb-4 shadow-cyber-lg animate-pulse-glow">
          🐾
        </div>
        <h1 class="text-3xl font-bold neon-text text-cyber-primary">COCO CLAW</h1>
        <p class="text-cyber-muted mt-2">欢迎回来，赛博侠客</p>
      </div>
    </div>

    <!-- Login Form -->
    <div class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-xl font-bold text-cyber-text mb-6 text-center">登录账户</h2>

        <!-- Account Type Tabs -->
        <div class="flex mb-6 bg-cyber-darker rounded-lg p-1">
          <button 
            @click="loginType = 'captcha'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              loginType === 'captcha' 
                ? 'bg-cyber-gradient text-white shadow-lg' 
                : 'text-cyber-muted hover:text-cyber-text'
            ]"
          >
            验证码登录
          </button>
          <button 
            @click="loginType = 'password'"
            :class="[
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              loginType === 'password' 
                ? 'bg-cyber-gradient text-white shadow-lg' 
                : 'text-cyber-muted hover:text-cyber-text'
            ]"
          >
            密码登录
          </button>
        </div>

        <!-- Error Message -->
        <div 
          v-if="authStore.error" 
          class="mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
        >
          {{ authStore.error }}
        </div>

        <!-- Email Captcha Login Form -->
        <div v-if="loginType === 'captcha'" class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">邮箱 <span class="text-cyber-danger">*</span></label>
            <input
              v-model="captchaForm.email"
              type="email"
              placeholder="请输入邮箱地址"
              :class="['cyber-input', formErrors.email && formTouched.email ? 'input-error' : '']"
              @blur="touch('email'); validateField('email', captchaForm.email)"
            />
            <p v-if="formErrors.email && formTouched.email" class="text-cyber-danger text-xs mt-1">
              {{ formErrors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">验证码 <span class="text-cyber-danger">*</span></label>
            <div class="flex gap-2">
              <input
                v-model="captchaForm.code"
                type="text"
                placeholder="请输入验证码"
                class="cyber-input flex-1"
                maxlength="6"
              />
              <button 
                @click="sendCaptcha"
                :disabled="!canSendCaptcha"
                :class="['px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors', canSendCaptcha ? 'bg-cyber-card border border-cyber-border text-cyber-primary hover:border-cyber-primary' : 'bg-cyber-darker text-cyber-muted cursor-not-allowed']"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="captchaForm.remember" 
                class="w-4 h-4 rounded accent-cyber-primary"
              />
              <span class="ml-2 text-cyber-muted">记住登录状态</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-cyber-primary hover:text-cyber-secondary">
              忘记密码？
            </NuxtLink>
          </div>

          <button 
            @click="handleCaptchaLogin"
            :disabled="authStore.loading || !captchaForm.email || !captchaForm.code"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed ripple"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <!-- Password Login Form -->
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">邮箱 <span class="text-cyber-danger">*</span></label>
            <input
              v-model="passwordForm.email"
              type="email"
              placeholder="请输入邮箱地址"
              :class="['cyber-input', formErrors.email && formTouched.email ? 'input-error' : '']"
              @blur="touch('email'); validateField('email', passwordForm.email)"
            />
            <p v-if="formErrors.email && formTouched.email" class="text-cyber-danger text-xs mt-1">
              {{ formErrors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">密码 <span class="text-cyber-danger">*</span></label>
            <div class="relative">
              <input
                v-model="passwordForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :class="['cyber-input pr-10', formErrors.password && formTouched.password ? 'input-error' : '']"
                @blur="touch('password'); validateField('password', passwordForm.password)"
              />
              <button 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-primary transition-colors"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <p v-if="formErrors.password && formTouched.password" class="text-cyber-danger text-xs mt-1">
              {{ formErrors.password }}
            </p>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="passwordForm.remember" 
                class="w-4 h-4 rounded accent-cyber-primary"
              />
              <span class="ml-2 text-cyber-muted">记住登录状态</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-cyber-primary hover:text-cyber-secondary">
              忘记密码？
            </NuxtLink>
          </div>

          <button 
            @click="handlePasswordLogin"
            :disabled="authStore.loading || !passwordForm.email || !passwordForm.password"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed ripple"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <!-- Register Link -->
        <div class="mt-6 text-center text-sm">
          <span class="text-cyber-muted">还没有账号？</span>
          <NuxtLink to="/register" class="text-cyber-primary hover:text-cyber-secondary font-medium ml-1">
            立即注册 →
          </NuxtLink>
        </div>

        <!-- Demo Login -->
        <div class="mt-6 pt-6 border-t border-cyber-border">
          <button 
            @click="handleGuestMode"
            class="w-full py-3 rounded-lg border border-cyber-border text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary transition-colors text-sm"
          >
            游客购买 (免注册)
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Safe Area -->
    <div class="safe-area-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFormValidation, commonRules } from '~/composables/useFormValidation'
import { useConfirm } from '~/composables/useConfirm'
import { showSuccessToast, showFailToast } from 'vant'

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const { success, error: showError } = useConfirm()

const loginType = ref<'captcha' | 'password'>('captcha')
const showPassword = ref(false)
const countdown = ref(0)

// 表单验证
const {
  errors: formErrors,
  touched: formTouched,
  validate,
  validateField,
  touch,
  getFieldError
} = useFormValidation({
  email: commonRules.email,
  password: commonRules.password
})

const captchaForm = ref({
  email: '',
  code: '',
  remember: true
})

const passwordForm = ref({
  email: '',
  password: '',
  remember: true
})

// 邮箱格式验证
const isEmailValid = computed(() => {
  const email = loginType.value === 'captcha' ? captchaForm.value.email : passwordForm.value.email
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
})

// 验证码发送状态
const canSendCaptcha = computed(() => {
  return isEmailValid.value && countdown.value === 0
})

// Send verification code
const sendCaptcha = async () => {
  if (!canSendCaptcha.value) return

  touch('email')
  if (!validateField('email', captchaForm.value.email)) return

  const result = await authStore.sendCaptcha(captchaForm.value.email)
  if (result.success) {
    success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

// Captcha login
const handleCaptchaLogin = async () => {
  if (!captchaForm.value.email || !captchaForm.value.code) return

  touch('email')
  if (!validateField('email', captchaForm.value.email)) return

  const result = await authStore.loginByCaptcha({
    email: captchaForm.value.email,
    captchaCode: captchaForm.value.code,
    remember: captchaForm.value.remember
  })

  if (result.success) {
    success('登录成功')
    navigateTo('/')
  }
}

// Password login
const handlePasswordLogin = async () => {
  if (!passwordForm.value.email || !passwordForm.value.password) return

  touch('email')
  touch('password')
  if (!validateField('email', passwordForm.value.email)) return
  if (!validateField('password', passwordForm.value.password)) return

  const result = await authStore.loginByPassword({
    email: passwordForm.value.email,
    password: passwordForm.value.password,
    remember: passwordForm.value.remember
  })

  if (result.success) {
    success('登录成功')
    navigateTo('/')
  }
}

// Guest mode
const handleGuestMode = () => {
  navigateTo('/guest-query')
}

useHead({
  title: '登录 - COCO CLAW'
})
</script>

<style scoped>
.neon-text {
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5),
               0 0 40px rgba(0, 212, 255, 0.3);
}

/* 输入框错误状态 */
.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
