<template>
  <div class="register-page min-h-screen bg-cyber-darker flex flex-col">
    <!-- Background Effects -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <div class="relative px-4 pt-12 pb-6">
      <button 
        @click="$router.back()" 
        class="absolute left-4 top-12 p-2 rounded-lg hover:bg-cyber-card transition-colors"
      >
        <span class="text-xl">←</span>
      </button>
      <h1 class="text-xl font-bold text-center text-cyber-text">注册账户</h1>
    </div>

    <!-- Progress Steps -->
    <div class="relative px-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 1 ? 'bg-cyber-gradient text-white' : 'bg-cyber-card text-cyber-muted'
            ]"
          >
            1
          </div>
          <div 
            :class="[
              'w-16 h-0.5',
              currentStep >= 2 ? 'bg-cyber-gradient' : 'bg-cyber-border'
            ]"
          ></div>
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 2 ? 'bg-cyber-gradient text-white' : 'bg-cyber-card text-cyber-muted'
            ]"
          >
            2
          </div>
          <div 
            :class="[
              'w-16 h-0.5',
              currentStep >= 3 ? 'bg-cyber-gradient' : 'bg-cyber-border'
            ]"
          ></div>
          <div 
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              currentStep >= 3 ? 'bg-cyber-gradient text-white' : 'bg-cyber-card text-cyber-muted'
            ]"
          >
            3
          </div>
        </div>
      </div>
      <div class="flex justify-between mt-2 text-xs text-cyber-muted">
        <span>验证手机</span>
        <span class="mr-4">设置密码</span>
        <span>注册完成</span>
      </div>
    </div>

    <!-- Error Message -->
    <div 
      v-if="authStore.error" 
      class="mx-6 mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
    >
      {{ authStore.error }}
    </div>

    <!-- Step 1: Phone Verification -->
    <div v-if="currentStep === 1" class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-lg font-bold text-cyber-text mb-6">验证手机号</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">手机号</label>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted">+86</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
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
                :disabled="countdown > 0"
                class="px-4 py-3 rounded-lg bg-cyber-card border border-cyber-border text-cyber-primary text-sm font-medium whitespace-nowrap hover:border-cyber-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>

          <button 
            @click="nextStep"
            :disabled="!form.phone || !form.code || authStore.loading"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一步
          </button>
        </div>
      </div>
    </div>

    <!-- Step 2: Set Password -->
    <div v-if="currentStep === 2" class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-lg font-bold text-cyber-text mb-6">设置登录密码</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">用户名</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              class="cyber-input"
            />
            <p class="text-xs text-cyber-muted mt-1">用户名用于登录，长度6-20个字符</p>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">登录密码</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
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
            <p class="text-xs text-cyber-muted mt-1">
              {{ passwordStrengthText }}
            </p>
          </div>

          <div>
            <label class="block text-sm text-cyber-muted mb-2">确认密码</label>
            <input
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              class="cyber-input"
            />
          </div>

          <div class="flex items-start gap-2">
            <input 
              type="checkbox" 
              v-model="form.agreeTerms" 
              id="terms"
              class="w-4 h-4 mt-1 rounded accent-cyber-primary"
            />
            <label for="terms" class="text-sm text-cyber-muted">
              我已阅读并同意 
              <span class="text-cyber-primary">《用户服务协议》</span> 和 
              <span class="text-cyber-primary">《隐私政策》</span>
            </label>
          </div>

          <button 
            @click="handleRegister"
            :disabled="!canSubmit || authStore.loading"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '注册中...' : '完成注册' }}
          </button>

          <button 
            @click="currentStep = 1"
            class="w-full py-3 text-cyber-muted hover:text-cyber-primary transition-colors text-sm"
          >
            ← 返回上一步
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: Success -->
    <div v-if="currentStep === 3" class="relative px-6 flex-1 flex flex-col">
      <div class="flex-1 flex flex-col items-center justify-center">
        <div class="w-24 h-24 rounded-full bg-cyber-success/20 flex items-center justify-center text-5xl mb-6 animate-bounce">
          ✓
        </div>
        <h2 class="text-2xl font-bold text-cyber-text mb-2">注册成功！</h2>
        <p class="text-cyber-muted mb-8">欢迎加入 COCO CLAW</p>
        
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

const authStore = useAuthStore()

const currentStep = ref(1)
const countdown = ref(0)
const showPassword = ref(false)

const form = ref({
  phone: '',
  code: '',
  username: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// Send verification code
const sendCode = async () => {
  if (!form.value.phone || form.value.phone.length !== 11) {
    return
  }

  const result = await authStore.sendCode(form.value.phone, 'register')
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

// Next step
const nextStep = () => {
  if (form.value.phone && form.value.code) {
    currentStep.value = 2
  }
}

// Password strength
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = ['', '密码太弱', '密码较弱', '密码较强', '密码很强']
  return texts[passwordStrength.value]
})

// Can submit
const canSubmit = computed(() => {
  return (
    form.value.username.length >= 6 &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword &&
    form.value.agreeTerms
  )
})

// Handle register
const handleRegister = async () => {
  const result = await authStore.register({
    username: form.value.username,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    phone: form.value.phone,
    code: form.value.code
  })

  if (result.success) {
    currentStep.value = 3
  }
}

// Go to login
const goToLogin = () => {
  navigateTo('/login')
}

useHead({
  title: '注册 - COCO CLAW'
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
