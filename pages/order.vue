<template>
  <div class="order-page min-h-screen pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">我的订单</h1>
        <div class="w-10"></div>
      </div>

      <!-- Tabs -->
      <div class="px-4 pb-3 flex gap-4">
        <button 
          v-for="tab in tabs"
          :key="tab.value"
          class="relative py-2 text-sm font-medium transition-colors"
          :class="activeTab === tab.value ? 'text-cyber-primary' : 'text-cyber-muted'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span 
            v-if="tab.count > 0"
            class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-cyber-accent"
          >
            {{ tab.count }}
          </span>
          <div 
            v-if="activeTab === tab.value"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-primary"
          ></div>
        </button>
      </div>
    </div>

    <!-- Orders List -->
    <div class="px-4 py-4">
      <!-- Empty State -->
      <div 
        v-if="filteredOrders.length === 0" 
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="text-7xl mb-6">📋</span>
        <h2 class="text-xl font-bold text-cyber-text mb-2">暂无订单</h2>
        <p class="text-cyber-muted mb-6">快去购买心仪的 SKILL 吧</p>
        <NuxtLink to="/skills">
          <button class="cyber-btn">
            <span class="mr-2">🔍</span>
            去发现
          </button>
        </NuxtLink>
      </div>

      <!-- Orders -->
      <div v-else class="space-y-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="cyber-card p-4"
        >
          <!-- Order Header -->
          <div class="flex items-center justify-between mb-3 pb-3 border-b border-cyber-border">
            <div class="flex items-center">
              <span class="text-cyber-muted text-sm">订单号：</span>
              <span class="text-cyber-text text-sm font-mono">{{ order.id }}</span>
            </div>
            <span 
              class="px-2 py-1 rounded text-xs font-medium"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="space-y-3">
            <div 
              v-for="item in order.items" 
              :key="item.skill.id"
              class="flex gap-3"
            >
              <div class="w-12 h-12 rounded-lg bg-cyber-gradient flex items-center justify-center text-xl flex-shrink-0">
                {{ item.skill.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-cyber-text truncate">{{ item.skill.name }}</h4>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-cyber-muted">x{{ item.quantity }}</span>
                  <span class="text-cyber-primary font-bold">¥{{ item.skill.price * item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="mt-4 pt-3 border-t border-cyber-border">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-cyber-muted">{{ order.createdAt }}</span>
              </div>
              <div class="text-right">
                <span class="text-sm text-cyber-muted">合计：</span>
                <span class="text-lg font-bold text-cyber-primary">¥{{ order.totalAmount }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-3 justify-end">
              <button 
                v-if="order.status === 'pending'"
                class="px-4 py-1.5 rounded-lg text-sm border border-cyber-danger text-cyber-danger hover:bg-cyber-danger/10 transition-colors"
                @click="handleCancel(order.id)"
              >
                取消订单
              </button>
              <button 
                v-if="order.status === 'completed'"
                class="px-4 py-1.5 rounded-lg text-sm cyber-btn-outline"
                @click="handleReorder(order)"
              >
                再次购买
              </button>
              <button 
                v-if="order.status === 'pending'"
                class="px-4 py-1.5 rounded-lg text-sm cyber-btn"
                @click="handlePay(order)"
              >
                去支付
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50">
      <div class="flex justify-around py-2">
        <NuxtLink to="/" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🏠</span>
          <span class="text-xs mt-1">首页</span>
        </NuxtLink>
        <NuxtLink to="/skills" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🔍</span>
          <span class="text-xs mt-1">发现</span>
        </NuxtLink>
        <NuxtLink to="/cart" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors relative">
          <span class="text-xl">🛒</span>
          <span class="text-xs mt-1">购物车</span>
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute top-0 right-2 w-5 h-5 rounded-full bg-cyber-accent text-xs font-bold flex items-center justify-center"
          >
            {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
          </span>
        </NuxtLink>
        <NuxtLink to="/order" class="flex flex-col items-center p-2 text-cyber-primary">
          <span class="text-xl">📋</span>
          <span class="text-xs mt-1">订单</span>
        </NuxtLink>
        <NuxtLink to="/profile" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">👤</span>
          <span class="text-xs mt-1">我的</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import type { Skill } from '~/stores/skill'

const cartStore = useCartStore()

// Tabs
const tabs = [
  { label: '全部', value: 'all', count: 0 },
  { label: '待支付', value: 'pending', count: 2 },
  { label: '已完成', value: 'completed', count: 0 },
  { label: '已取消', value: 'cancelled', count: 0 }
]

const activeTab = ref('all')

// Mock orders data
const orders = ref([
  {
    id: 'ORD202401180001',
    items: [
      { skill: { id: '1', name: 'AutoFill Pro', icon: '🤖', price: 99 }, quantity: 1 },
      { skill: { id: '3', name: 'SmartTranslator', icon: '🌐', price: 79 }, quantity: 1 }
    ],
    totalAmount: 178,
    status: 'pending',
    createdAt: '2024-01-18 15:30'
  },
  {
    id: 'ORD202401150002',
    items: [
      { skill: { id: '5', name: 'AdBlocker Ultimate', icon: '🛡️', price: 0 }, quantity: 1 }
    ],
    totalAmount: 0,
    status: 'completed',
    createdAt: '2024-01-15 10:20'
  },
  {
    id: 'ORD202401120003',
    items: [
      { skill: { id: '2', name: 'DataExtractor', icon: '📊', price: 149 }, quantity: 1 },
      { skill: { id: '6', name: 'ScreenshotPlus', icon: '📸', price: 89 }, quantity: 1 }
    ],
    totalAmount: 238,
    status: 'completed',
    createdAt: '2024-01-12 09:15'
  }
])

// Computed
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

// Load cart
onMounted(() => {
  cartStore.loadFromLocalStorage()
})

// Methods
const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'completed':
      return 'bg-green-500/20 text-green-400'
    case 'cancelled':
      return 'bg-gray-500/20 text-gray-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return '待支付'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return status
  }
}

const handleCancel = (orderId: string) => {
  if (confirm('确定要取消该订单吗？')) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
    }
  }
}

const handlePay = (order: any) => {
  // In real app, this would integrate with payment
  alert('支付功能开发中...')
}

const handleReorder = (order: any) => {
  // Add items back to cart
  order.items.forEach((item: any) => {
    cartStore.addToCart(item.skill as Skill, item.quantity)
  })
  cartStore.saveToLocalStorage()
  
  // Navigate to cart
  navigateTo('/cart')
}

// SEO
useHead({
  title: '我的订单 - COCO CLAW'
})
</script>
