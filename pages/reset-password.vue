<template>
  <div class="reset-password-page min-h-screen bg-cyber-darker flex flex-col">
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
      <h1 class="text-xl font-bold text-center text-cyber-text">重置密码</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loadingToken" class="relative px-6 flex-1 flex items-center justify-center">
      <div class="text-cyber-muted">验证链接中...</div>
    </div>

    <!-- Invalid Token -->
    <div v-else-if="!tokenValid" class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-cyber-danger/20 flex items-center justify-center text-3xl mb-4">
            ✕
          </div>
          <h2 class="text-xl font-bold text-cyber-text mb-2">链接已失效</h2>
          <p class="text-cyber-muted mb-6">此重置链接已过期或无效，请重新申请</p>
          <NuxtLink to="/forgot-password" class="cyber-btn">
            重新申请
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Reset Form -->
    <div v-else-if="!resetSuccess" class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-lg font-bold text-cyber-text mb-2">设置新密码</h2>
        <p class="text-sm text-cyber-muted mb-6">请输入您的新密码</p>

        <!-- Error Message -->
        <div 
          v-if="authStore.error" 
          class="mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
        >
          {{ authStore.error }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">新密码</label>
            <div class="relative">
              <input
                v-model="form.password"
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
          </div>

          <!-- Password Strength -->
          <div class="mt-2">
            <div class="flex gap-1">
              <div 
                v-for="i in 4" 
                :key="i"
                :class="[
                  'h-1 flex-1 rounded-full transition-colors',
                  passwordStrength >= i 
                    ? passwordStrength === 1 ? 'bg-cyber-danger' 
                    : passwordStrength === 2 ? 'bg-cyber-warning'
                    : passwordStrength === 3 ? 'bg-cyber-primary'
                    : 'bg-cyber-success'
                    : 'bg-cyber-border'
                ]"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-cyber-muted mt-1">
              <span>{{ passwordStrengthText }}</span>
              <span>8-20位，含大小写字母和数字</span>
            </div>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">确认密码</label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请再次输入新密码"
              class="cyber-input"
            />
          </div>

          <button 
            @click="handleResetPassword"
            :disabled="!canSubmit || authStore.loading"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '重置中...' : '重置密码' }}
          </button>
        </div>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-cyber-primary hover:text-cyber-secondary text-sm">
            返回登录 →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Success -->
    <div v-else class="relative px-6 flex-1 flex flex-col">
      <div class="flex-1 flex flex-col items-center justify-center">
        <div class="w-24 h-24 rounded-full bg-cyber-success/20 flex items-center justify-center text-5xl mb-6 animate-bounce">
          ✓
        </div>
        <h2 class="text-2xl font-bold text-cyber-text mb-2">密码重置成功！</h2>
        <p class="text-cyber-muted mb-8">请使用新密码登录</p>
        
        <button 
          @click="goToLogin"
          class="cyber-btn"
        >
          立即登录
        </button>
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

const route = useRoute()
const authStore = useAuthStore()

const token = computed(() => route.query.token as string)
const loadingToken = ref(true)
const tokenValid = ref(false)
const resetSuccess = ref(false)
const showPassword = ref(false)

const form = ref({
  password: '',
  confirmPassword: ''
})

// Verify token on load
onMounted(async () => {
  if (!token.value) {
    loadingToken.value = false
    return
  }

  tokenValid.value = await authStore.verifyResetToken(token.value)
  loadingToken.value = false
})

// Password strength
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const texts = ['', '密码太弱', '密码较弱', '密码较强', '密码很强']
  return texts[passwordStrength.value] || '请输入密码'
})

// Can submit
const canSubmit = computed(() => {
  return (
    form.value.password.length >= 8 &&
    form.value.password.length <= 20 &&
    form.value.password === form.value.confirmPassword &&
    passwordStrength.value >= 2
  )
})

// Handle reset
const handleResetPassword = async () => {
  if (!token.value) return

  const result = await authStore.resetPassword({
    token: token.value,
    newPassword: form.value.password,
    confirmPassword: form.value.confirmPassword
  })

  if (result.success) {
    resetSuccess.value = true
  }
}

// Go to login
const goToLogin = () => {
  navigateTo('/login')
}

useHead({
  title: '重置密码 - COCO CLAW'
})
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
