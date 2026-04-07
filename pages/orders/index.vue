<template>
  <div class="orders-page min-h-screen pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between mb-3">
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
        <div class="flex gap-2 overflow-x-auto scrollbar-hide">
          <button 
            v-for="tab in tabs"
            :key="tab.key"
            @click="setFilter(tab.key)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              currentFilter === tab.key
                ? 'bg-cyber-gradient text-white shadow-lg'
                : 'bg-cyber-card text-cyber-muted hover:text-cyber-text'
            ]"
          >
            {{ tab.label }}
            <span 
              v-if="getCount(tab.key) > 0"
              class="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-cyber-danger text-white"
            >
              {{ getCount(tab.key) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Loading -->
      <div v-if="orderStore.loading" class="flex flex-col items-center justify-center py-20">
        <span class="text-5xl animate-spin">⟳</span>
        <p class="text-cyber-muted mt-4">加载中...</p>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="filteredOrders.length === 0" 
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="text-7xl mb-6">📋</span>
        <h2 class="text-xl font-bold text-cyber-text mb-2">
          {{ currentFilter === 'all' ? '暂无订单' : `暂无${getFilterLabel(currentFilter)}订单` }}
        </h2>
        <p class="text-cyber-muted mb-6">
          {{ currentFilter === 'all' ? '快去挑选心仪的 SKILL 吧' : '去看看其他商品吧' }}
        </p>
        <NuxtLink to="/skills">
          <button class="cyber-btn">
            去发现 →
          </button>
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="cyber-card p-4 rounded-xl"
        >
          <!-- Order Header -->
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-cyber-muted">
              订单号: {{ order.orderNo }}
            </div>
            <div 
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                order.status === 'pending' ? 'bg-cyber-warning/20 text-cyber-warning' :
                order.status === 'paid' ? 'bg-cyber-primary/20 text-cyber-primary' :
                order.status === 'completed' ? 'bg-cyber-success/20 text-cyber-success' :
                'bg-cyber-muted/20 text-cyber-muted'
              ]"
            >
              {{ order.statusText }}
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3 mb-4">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex gap-3 cursor-pointer"
              @click="goToOrderDetail(order.id)"
            >
              <div class="w-14 h-14 rounded-lg bg-cyber-gradient flex items-center justify-center text-xl flex-shrink-0">
                {{ item.skillIcon }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-cyber-text truncate">{{ item.skillName }}</h4>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-sm text-cyber-muted">x{{ item.quantity }}</span>
                  <span class="text-cyber-primary font-medium">¥{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="border-t border-cyber-border pt-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-cyber-muted">合计</span>
                <span class="text-lg font-bold text-cyber-primary ml-2">¥{{ order.actualAmount }}</span>
                <span 
                  v-if="order.discount > 0"
                  class="text-xs text-cyber-success ml-2"
                >
                  节省 ¥{{ order.discount }}
                </span>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <!-- Cancel Button (Pending) -->
                <button 
                  v-if="order.status === 'pending'"
                  @click.stop="handleCancel(order.id)"
                  class="px-4 py-1.5 rounded-lg border border-cyber-border text-cyber-muted text-sm hover:border-cyber-danger hover:text-cyber-danger transition-colors"
                >
                  取消订单
                </button>

                <!-- Pay Button (Pending) -->
                <button 
                  v-if="order.status === 'pending'"
                  @click.stop="goToPay(order.id)"
                  class="px-4 py-1.5 rounded-lg bg-cyber-gradient text-white text-sm font-medium hover:shadow-cyber transition-all"
                >
                  立即支付
                </button>

                <!-- View Detail (Other Status) -->
                <button 
                  v-else
                  @click.stop="goToOrderDetail(order.id)"
                  class="px-4 py-1.5 rounded-lg border border-cyber-primary text-cyber-primary text-sm hover:bg-cyber-primary/10 transition-colors"
                >
                  查看详情
                </button>
              </div>
            </div>

            <!-- Expire Time (Pending) -->
            <div 
              v-if="order.status === 'pending' && order.expireAt"
              class="mt-2 text-xs text-cyber-muted"
            >
              支付剩余时间: {{ getExpireTime(order.expireAt) }}
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
        <NuxtLink to="/cart" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🛒</span>
          <span class="text-xs mt-1">购物车</span>
        </NuxtLink>
        <NuxtLink to="/order" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
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
import { useOrderStore } from '~/stores/order'

const route = useRoute()
const orderStore = useOrderStore()

// Tabs
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'paid', label: '已支付' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

// Current filter
const currentFilter = computed(() => orderStore.filter)

// Filtered orders
const filteredOrders = computed(() => orderStore.filteredOrders)

// Get count for tab
const getCount = (key: string) => {
  const count = orderStore.orderCount
  if (key === 'all') return count.all
  if (key === 'pending') return count.pending
  if (key === 'paid') return count.paid
  if (key === 'completed') return count.completed
  if (key === 'cancelled') return count.cancelled
  return 0
}

// Get filter label
const getFilterLabel = (key: string) => {
  const tab = tabs.find(t => t.key === key)
  return tab?.label || ''
}

// Set filter
const setFilter = (key: string) => {
  orderStore.setFilter(key as any)
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

// Navigate to order detail
const goToOrderDetail = (id: string) => {
  navigateTo(`/orders/${id}`)
}

// Navigate to pay
const goToPay = (id: string) => {
  navigateTo(`/pay?orderId=${id}`)
}

// Handle cancel
const handleCancel = async (id: string) => {
  if (confirm('确定要取消该订单吗？')) {
    await orderStore.cancelOrder(id)
  }
}

// Initialize
onMounted(async () => {
  // Set initial filter from query
  const status = route.query.status as string
  if (status && tabs.some(t => t.key === status)) {
    orderStore.setFilter(status as any)
  }
  
  // Fetch orders
  await orderStore.fetchOrders()
})

useHead({
  title: '我的订单 - COCO CLAW'
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
