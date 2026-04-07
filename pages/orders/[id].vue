<template>
  <div class="order-detail-page min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">订单详情</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="flex flex-col items-center justify-center py-20">
      <span class="text-5xl animate-spin">⟳</span>
      <p class="text-cyber-muted mt-4">加载中...</p>
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="px-4 py-4">
      <!-- Order Status Card -->
      <div class="cyber-card p-6 rounded-xl mb-4 text-center">
        <div class="text-4xl mb-3">{{ getStatusIcon(order.status) }}</div>
        <h2 class="text-xl font-bold text-cyber-text mb-1">{{ order.statusText }}</h2>
        <p class="text-sm text-cyber-muted" v-if="order.status === 'pending' && order.expireAt">
          请在 {{ getExpireTime(order.expireAt) }} 内完成支付
        </p>
        <p class="text-sm text-cyber-muted" v-else-if="order.status === 'paid'">
          支付时间: {{ order.paymentTime }}
        </p>
        <p class="text-sm text-cyber-muted" v-else-if="order.status === 'completed'">
          感谢您的购买！
        </p>
      </div>

      <!-- Shipping Info -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-xl">📦</span>
          <h3 class="font-bold text-cyber-text">SKILL 交付信息</h3>
        </div>
        <div class="space-y-2 text-sm">
          <p class="text-cyber-muted">
            <span class="text-cyber-text mr-2">购买内容:</span>
            {{ order.items.map(i => i.skillName).join(', ') }}
          </p>
          <p class="text-cyber-muted">
            <span class="text-cyber-text mr-2">交付方式:</span>
            线上自动交付
          </p>
        </div>
      </div>

      <!-- Order Info -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-xl">📋</span>
          <h3 class="font-bold text-cyber-text">订单信息</h3>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-cyber-muted">订单编号</span>
            <span class="text-cyber-text font-mono">{{ order.orderNo }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-cyber-muted">创建时间</span>
            <span class="text-cyber-text">{{ order.createdAt }}</span>
          </div>
          <div v-if="order.paymentTime" class="flex justify-between">
            <span class="text-cyber-muted">支付时间</span>
            <span class="text-cyber-text">{{ order.paymentTime }}</span>
          </div>
          <div v-if="order.paymentMethod" class="flex justify-between">
            <span class="text-cyber-muted">支付方式</span>
            <span class="text-cyber-text">{{ getPaymentMethodName(order.paymentMethod) }}</span>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-3">商品明细</h3>
        <div class="space-y-3">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex gap-3"
          >
            <div class="w-16 h-16 rounded-xl bg-cyber-gradient flex items-center justify-center text-2xl flex-shrink-0">
              {{ item.skillIcon }}
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-cyber-text">{{ item.skillName }}</h4>
              <div class="flex items-center justify-between mt-1">
                <span class="text-sm text-cyber-muted">x{{ item.quantity }}</span>
                <span class="text-cyber-primary font-bold">¥{{ item.price * item.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="cyber-card p-4 rounded-xl">
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-cyber-muted">商品总价</span>
            <span class="text-cyber-text">¥{{ order.totalAmount }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between">
            <span class="text-cyber-muted">优惠券</span>
            <span class="text-cyber-success">-¥{{ order.discount }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-cyber-border">
            <span class="text-cyber-text font-bold">实付金额</span>
            <span class="text-xl font-bold text-cyber-primary">¥{{ order.actualAmount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <span class="text-7xl mb-6">📋</span>
      <h2 class="text-xl font-bold text-cyber-text mb-2">订单不存在</h2>
      <p class="text-cyber-muted mb-6">该订单可能已被删除或不存在</p>
      <NuxtLink to="/orders">
        <button class="cyber-btn">
          返回订单列表
        </button>
      </NuxtLink>
    </div>

    <!-- Bottom Actions -->
    <div 
      v-if="order && order.status === 'pending'"
      class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50"
    >
      <div class="p-4 flex gap-3">
        <button 
          @click="handleCancel"
          class="flex-1 py-3 rounded-xl border border-cyber-border text-cyber-muted font-medium hover:border-cyber-danger hover:text-cyber-danger transition-colors"
        >
          取消订单
        </button>
        <button 
          @click="goToPay"
          class="flex-1 py-3 rounded-xl bg-cyber-gradient text-white font-bold hover:shadow-cyber transition-all"
        >
          立即支付
        </button>
      </div>
    </div>

    <!-- Completed/Cancelled Actions -->
    <div 
      v-else-if="order && (order.status === 'completed' || order.status === 'cancelled')"
      class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50"
    >
      <div class="p-4 flex gap-3">
        <button 
          v-if="order.status === 'completed'"
          @click="goToOrders"
          class="flex-1 py-3 rounded-xl bg-cyber-gradient text-white font-bold hover:shadow-cyber transition-all"
        >
          再买一单
        </button>
        <button 
          @click="goToOrders"
          class="flex-1 py-3 rounded-xl border border-cyber-border text-cyber-text font-medium hover:bg-cyber-card transition-colors"
        >
          返回订单列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/stores/order'

const route = useRoute()
const orderStore = useOrderStore()

// Get order
const order = computed(() => orderStore.currentOrder)

// Get status icon
const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: '⏰',
    paid: '💰',
    completed: '✅',
    cancelled: '❌',
    refunded: '💸'
  }
  return icons[status] || '📋'
}

// Get payment method name
const getPaymentMethodName = (method: string) => {
  const names: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    bankcard: '银行卡'
  }
  return names[method] || method
}

// Get expire time
const getExpireTime = (expireAt: string) => {
  const now = new Date().getTime()
  const expire = new Date(expireAt).getTime()
  const diff = expire - now
  
  if (diff <= 0) return '已过期'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

// Go to pay
const goToPay = () => {
  if (order.value) {
    navigateTo(`/pay?orderId=${order.value.id}`)
  }
}

// Go to orders
const goToOrders = () => {
  navigateTo('/orders')
}

// Handle cancel
const handleCancel = async () => {
  if (order.value && confirm('确定要取消该订单吗？')) {
    await orderStore.cancelOrder(order.value.id)
  }
}

// Initialize
onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await orderStore.fetchOrderById(id)
  }
})

useHead({
  title: '订单详情 - COCO CLAW'
})
</script>
