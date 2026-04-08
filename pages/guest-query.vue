<template>
  <div class="guest-query-page min-h-screen pb-8">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">订单查询</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Query Form -->
    <div class="px-4 py-4">
      <div class="cyber-card p-4 rounded-xl">
        <h3 class="font-bold text-cyber-text mb-4">输入邮箱查询订单</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">邮箱地址</label>
            <input
              v-model="email"
              type="email"
              placeholder="请输入下单时填写的邮箱"
              class="cyber-input"
              :disabled="orders.length > 0"
            />
          </div>

          <div v-if="email && email.includes('@')" class="flex gap-2">
            <input
              v-model="captcha"
              type="text"
              placeholder="输入验证码"
              class="cyber-input flex-1"
              maxlength="6"
            />
            <button 
              @click="sendCaptcha"
              :disabled="countdown > 0 || orderStore.loading"
              class="px-4 py-3 rounded-lg bg-cyber-card border border-cyber-border text-cyber-primary text-sm font-medium whitespace-nowrap hover:border-cyber-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>

          <!-- Error Message -->
          <div 
            v-if="orderStore.error" 
            class="p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
          >
            {{ orderStore.error }}
          </div>

          <button 
            @click="queryOrders"
            :disabled="!email || !captcha || orderStore.loading"
            class="cyber-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="orderStore.loading" class="animate-spin mr-2">⟳</span>
            {{ orderStore.loading ? '查询中...' : '查询订单' }}
          </button>
        </div>

        <!-- Already logged in -->
        <div v-if="isLoggedIn" class="mt-4 pt-4 border-t border-cyber-border">
          <NuxtLink to="/orders" class="block">
            <button class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-darker transition-colors text-sm">
              查看我的订单（已登录） →
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-if="orders.length > 0" class="px-4">
      <h3 class="font-bold text-cyber-text mb-3">查询结果</h3>
      
      <div class="space-y-3">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="cyber-card p-4 rounded-xl"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="text-xs text-cyber-muted">订单号</p>
              <p class="font-medium text-cyber-text">{{ order.orderNo }}</p>
            </div>
            <span 
              :class="getStatusClass(order.status)"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ getStatusName(order.status) }}
            </span>
          </div>

          <div class="flex items-center gap-3 pb-3 border-b border-cyber-border">
            <div class="w-12 h-12 rounded-lg bg-cyber-gradient flex items-center justify-center text-lg">
              📦
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-cyber-text">{{ order.skillName || '商品' }}</h4>
              <p class="text-xs text-cyber-muted">{{ order.createTime }}</p>
            </div>
            <span class="text-cyber-primary font-bold">¥{{ order.payAmount }}</span>
          </div>

          <div class="flex gap-2 mt-3">
            <button 
              v-if="order.status === 0"
              @click="goToPay(order)"
              class="flex-1 py-2 rounded-lg bg-cyber-gradient text-white text-sm font-medium"
            >
              继续支付
            </button>
            <button 
              v-else-if="order.status === 2"
              @click="viewDetail(order)"
              class="flex-1 py-2 rounded-lg border border-cyber-border text-cyber-text text-sm hover:bg-cyber-darker transition-colors"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="queried && orders.length === 0" class="px-4 text-center py-12">
      <span class="text-6xl mb-4 block">📋</span>
      <h3 class="text-lg font-bold text-cyber-text mb-2">暂无订单</h3>
      <p class="text-cyber-muted text-sm">该邮箱下没有找到订单记录</p>
    </div>

    <!-- Bottom Tips -->
    <div class="px-4 mt-8">
      <div class="p-3 rounded-lg bg-cyber-card/50 text-xs text-cyber-muted">
        <p class="font-medium text-cyber-text mb-1">温馨提示</p>
        <p>• 订单支付有效期为30分钟</p>
        <p>• 验证码5分钟内有效</p>
        <p>• 如有问题请联系客服</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore, type Order } from '~/stores/order'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const route = useRoute()
const orderStore = useOrderStore()
const authStore = useAuthStore()

// Query params
const email = ref((route.query.email as string) || '')
const captcha = ref('')
const countdown = ref(0)
const queried = ref(false)

// Check if logged in
const isLoggedIn = computed(() => authStore.isAuthenticated)

// Orders
const orders = computed(() => orderStore.orders)

// Get status class
const getStatusClass = (status: number) => {
  const classes: Record<number, string> = {
    0: 'bg-cyber-warning/20 text-cyber-warning',
    1: 'bg-cyber-primary/20 text-cyber-primary',
    2: 'bg-cyber-success/20 text-cyber-success',
    3: 'bg-cyber-secondary/20 text-cyber-secondary',
    4: 'bg-cyber-muted/20 text-cyber-muted',
    5: 'bg-cyber-danger/20 text-cyber-danger',
    6: 'bg-cyber-muted/20 text-cyber-muted'
  }
  return classes[status] || 'bg-cyber-muted/20 text-cyber-muted'
}

// Get status name
const getStatusName = (status: number) => {
  const names: Record<number, string> = {
    0: '待支付',
    1: '支付中',
    2: '已支付',
    3: '已完成',
    4: '已取消',
    5: '退款中',
    6: '已退款'
  }
  return names[status] || '未知'
}

// Send captcha
const sendCaptcha = async () => {
  if (!email.value || !email.value.includes('@')) {
    orderStore.error = '请输入正确的邮箱地址'
    return
  }

  const result = await orderStore.sendGuestQueryCaptcha(email.value)
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

// Query orders
const queryOrders = async () => {
  if (!email.value || !captcha.value) return

  orderStore.clearError()
  const result = await orderStore.fetchGuestOrders(email.value, captcha.value)
  
  if (result.success) {
    queried.value = true
  }
}

// Go to pay
const goToPay = (order: Order) => {
  navigateTo(`/pay?orderNo=${order.orderNo}`)
}

// View detail
const viewDetail = (order: Order) => {
  navigateTo(`/order/${order.id}`)
}

useHead({
  title: '订单查询 - COCO CLAW'
})
</script>
