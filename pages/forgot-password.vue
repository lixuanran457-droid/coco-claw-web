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
      <h1 class="text-xl font-bold text-center text-cyber-text">忘记密码</h1>
    </div>

    <!-- Form -->
    <div class="relative px-6 flex-1">
      <div class="cyber-card p-6 rounded-xl">
        <h2 class="text-lg font-bold text-cyber-text mb-2">重置密码</h2>
        <p class="text-sm text-cyber-muted mb-6">输入您注册的邮箱地址，我们将发送密码重置链接</p>

        <!-- Error Message -->
        <div 
          v-if="authStore.error" 
          class="mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
        >
          {{ authStore.error }}
        </div>

        <!-- Success Message -->
        <div 
          v-if="successMessage" 
          class="mb-4 p-3 rounded-lg bg-cyber-success/20 border border-cyber-success/50 text-cyber-success text-sm"
        >
          {{ successMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">邮箱地址</label>
            <input
              v-model="email"
              type="email"
              placeholder="请输入注册的邮箱地址"
              class="cyber-input"
              :disabled="sent"
            />
          </div>

          <button 
            v-if="!sent"
            @click="handleSendResetLink"
            :disabled="!email || !email.includes('@') || authStore.loading"
            class="cyber-btn w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="animate-spin mr-2">⟳</span>
            {{ authStore.loading ? '发送中...' : '发送重置链接' }}
          </button>

          <button 
            v-else
            @click="sent = false"
            class="w-full py-3 rounded-lg border border-cyber-border text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary transition-colors text-sm"
          >
            重新发送
          </button>
        </div>

        <!-- Back to Login -->
        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-cyber-primary hover:text-cyber-secondary text-sm">
            返回登录 →
          </NuxtLink>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-6 p-4 rounded-lg bg-cyber-card/50">
        <h3 class="text-sm font-medium text-cyber-text mb-2">没收到邮件？</h3>
        <ul class="text-xs text-cyber-muted space-y-1">
          <li>• 检查邮箱地址是否正确</li>
          <li>• 查看垃圾邮件文件夹</li>
          <li>• 稍后再试，邮件发送可能有延迟</li>
          <li>• 确保邮箱可以正常接收邮件</li>
        </ul>
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
const email = ref('')
const sent = ref(false)
const successMessage = ref('')

const handleSendResetLink = async () => {
  const result = await authStore.sendForgotPasswordEmail(email.value)
  
  if (result.success) {
    sent.value = true
    successMessage.value = '密码重置链接已发送，请登录邮箱查收'
  }
}

useHead({
  title: '忘记密码 - COCO CLAW'
})
</script>
