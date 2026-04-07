<template>
  <div class="forgot-password-page min-h-screen bg-cyber-darker flex flex-col">
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
      <h1 class="text-xl font-bold text-center text-cyber-text">找回密码</h1>
    </div>

    <!-- Error Message -->
    <div 
      v-if="authStore.error" 
      class="mx-6 mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
    >
      {{ authStore.error }}
    </div>

    <!-- Success Message -->
    <div 
      v-if="successMessage" 
      class="mx-6 mb-4 p-3 rounded-lg bg-cyber-success/20 border border-cyber-success/50 text-cyber-success text-sm"
    >
      {{ successMessage }}
    </div>

    <!-- Form -->
    <div class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-lg font-bold text-cyber-text mb-6">重置登录密码</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">手机号</label>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted">+86</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入注册手机号"
                  class="cyber-input pl-12"
                  maxlength="11"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">验证码</label>
            <div class="flex gap-2">
              <input
                v-model="form.code"
                type="text"
                placeholder="请输入验证码"
                class="cyber-input flex-1"
                maxlength="6"
              />
              <button 
                @click="sendCode"
                :disabled="countdown > 0 || !form.phone"
                class="px-4 py-3 rounded-lg bg-cyber-card border border-cyber-border text-cyber-primary text-sm font-medium whitespace-nowrap hover:border-cyber-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">新密码</label>
            <div class="relative">
              <input
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入新密码"
                class="cyber-input pr-10"
              />
              <button 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-primary transition-colors"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <p class="text-xs text-cyber-muted mt-1">密码长度6-20位，支持字母、数字和特殊字符</p>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">确认新密码</label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请再次输入新密码"
              class="cyber-input"
            />
          </div>

          <!-- Password mismatch warning -->
          <div 
            v-if="form.confirmPassword && form.newPassword !== form.confirmPassword"
            class="text-sm text-cyber-danger"
          >
            两次输入的密码不一致
          </div>

          <button 
            @click="handleReset"
            :disabled="!canSubmit || authStore.loading"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '重置中...' : '重置密码' }}
          </button>

          <button 
            @click="$router.back()"
            class="w-full py-3 text-cyber-muted hover:text-cyber-primary transition-colors text-sm"
          >
            ← 返回登录
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

definePageMeta({
  layout: false
})

const authStore = useAuthStore()

const countdown = ref(0)
const showPassword = ref(false)
const successMessage = ref('')

const form = ref({
  phone: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

// Can submit
const canSubmit = computed(() => {
  return (
    form.value.phone.length === 11 &&
    form.value.code.length >= 4 &&
    form.value.newPassword.length >= 6 &&
    form.value.newPassword === form.value.confirmPassword
  )
})

// Send verification code
const sendCode = async () => {
  if (!form.value.phone || form.value.phone.length !== 11) {
    return
  }

  const result = await authStore.sendCode(form.value.phone, 'reset')
  if (result.success) {
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

// Handle reset
const handleReset = async () => {
  const result = await authStore.resetPassword({
    phone: form.value.phone,
    code: form.value.code,
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword
  })

  if (result.success) {
    successMessage.value = '密码重置成功！'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)
  }
}

useHead({
  title: '找回密码 - COCO CLAW'
})
</script>
