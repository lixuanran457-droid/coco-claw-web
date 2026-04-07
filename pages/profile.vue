<template>
  <div class="profile-page min-h-screen pb-20">
    <!-- Header -->
    <div class="relative px-4 pt-8 pb-6 overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute inset-0 bg-cyber-gradient opacity-10 blur-3xl"></div>
      
      <div class="relative">
        <!-- User Info Section -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Avatar -->
          <div 
            class="w-20 h-20 rounded-2xl bg-cyber-gradient flex items-center justify-center text-3xl shadow-cyber-lg"
            @click="goToEditProfile"
          >
            {{ userInfo?.avatar ? '🧑‍💻' : '🐾' }}
          </div>
          
          <div class="flex-1">
            <div v-if="isLoggedIn">
              <h2 class="text-xl font-bold text-cyber-text">{{ userInfo?.nickname || userInfo?.username }}</h2>
              <p class="text-sm text-cyber-muted mt-1">{{ userInfo?.phone || userInfo?.email }}</p>
              <p class="text-xs text-cyber-muted mt-0.5">ID: {{ userInfo?.id }}</p>
            </div>
            <div v-else>
              <h2 class="text-xl font-bold text-cyber-text">游客用户</h2>
              <p class="text-sm text-cyber-muted mt-1">登录后享受更多服务</p>
            </div>
          </div>

          <!-- Settings Button -->
          <button 
            v-if="isLoggedIn"
            @click="goToEditProfile"
            class="p-2 rounded-lg hover:bg-cyber-card transition-colors"
          >
            <span class="text-xl">⚙️</span>
          </button>
        </div>

        <!-- Quick Stats -->
        <div v-if="isLoggedIn" class="grid grid-cols-4 gap-3">
          <div class="text-center">
            <div class="text-lg font-bold text-cyber-primary">{{ orderCount.all }}</div>
            <div class="text-xs text-cyber-muted">全部订单</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-cyber-warning">{{ orderCount.pending }}</div>
            <div class="text-xs text-cyber-muted">待支付</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-cyber-success">{{ orderCount.completed }}</div>
            <div class="text-xs text-cyber-muted">已完成</div>
          </div>
          <div class="text-center">
            <div class="text-lg font-bold text-cyber-secondary">{{ validCouponCount }}</div>
            <div class="text-xs text-cyber-muted">优惠券</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Logged In Section -->
    <div v-if="!isLoggedIn" class="px-4 mb-6">
      <div class="cyber-card p-6 rounded-xl text-center">
        <p class="text-cyber-muted mb-4">登录后可以管理订单、收藏和享受更多服务</p>
        <div class="flex gap-3">
          <NuxtLink to="/login" class="flex-1">
            <button class="cyber-btn w-full">登录</button>
          </NuxtLink>
          <NuxtLink to="/register" class="flex-1">
            <button class="cyber-btn-outline w-full">注册</button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Order Section -->
    <div class="px-4 mb-6">
      <div class="cyber-card p-4 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-cyber-text">我的订单</h3>
          <NuxtLink to="/orders" class="text-sm text-cyber-muted hover:text-cyber-primary transition-colors">
            查看全部 →
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-4 gap-4">
          <NuxtLink 
            v-for="item in orderTabs" 
            :key="item.key"
            :to="`/orders?status=${item.key}`"
            class="flex flex-col items-center p-2 hover:bg-cyber-darker rounded-lg transition-colors"
          >
            <span class="text-2xl mb-1">{{ item.icon }}</span>
            <span class="text-xs text-cyber-muted">{{ item.label }}</span>
            <span 
              v-if="getOrderCount(item.key) > 0"
              class="mt-1 px-2 py-0.5 rounded-full bg-cyber-danger text-xs text-white"
            >
              {{ getOrderCount(item.key) }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Service Section -->
    <div class="px-4 mb-6">
      <div class="cyber-card rounded-xl overflow-hidden">
        <!-- Address Management -->
        <NuxtLink 
          to="/address" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">📍</span>
            <span class="text-cyber-text">收货地址</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>

        <div class="cyber-divider my-0"></div>

        <!-- Coupons -->
        <NuxtLink 
          to="/coupons" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">🎫</span>
            <span class="text-cyber-text">我的优惠券</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="validCouponCount > 0" class="px-2 py-0.5 rounded-full bg-cyber-primary/20 text-cyber-primary text-xs">
              {{ validCouponCount }} 张可用
            </span>
            <span class="text-cyber-muted">→</span>
          </div>
        </NuxtLink>

        <div class="cyber-divider my-0"></div>

        <!-- Favorite -->
        <NuxtLink 
          to="/favorites" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">⭐</span>
            <span class="text-cyber-text">我的收藏</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>

        <div class="cyber-divider my-0"></div>

        <!-- Security Settings -->
        <NuxtLink 
          to="/security" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">🔐</span>
            <span class="text-cyber-text">账户安全</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- More Services -->
    <div class="px-4 mb-6">
      <div class="cyber-card rounded-xl overflow-hidden">
        <!-- Help Center -->
        <NuxtLink 
          to="/help" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">❓</span>
            <span class="text-cyber-text">帮助中心</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>

        <div class="cyber-divider my-0"></div>

        <!-- Feedback -->
        <NuxtLink 
          to="/feedback" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">💬</span>
            <span class="text-cyber-text">意见反馈</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>

        <div class="cyber-divider my-0"></div>

        <!-- About -->
        <NuxtLink 
          to="/about" 
          class="flex items-center justify-between p-4 hover:bg-cyber-darker transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">ℹ️</span>
            <span class="text-cyber-text">关于我们</span>
          </div>
          <span class="text-cyber-muted">→</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Logout Button -->
    <div v-if="isLoggedIn" class="px-4 mb-6">
      <button 
        @click="handleLogout"
        class="w-full py-4 rounded-xl bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger font-medium hover:bg-cyber-danger/30 transition-colors"
      >
        退出登录
      </button>
    </div>

    <!-- Version Info -->
    <div class="px-4 text-center text-xs text-cyber-muted">
      <p>COCO CLAW v1.0.0</p>
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
        <NuxtLink to="/profile" class="flex flex-col items-center p-2 text-cyber-primary">
          <span class="text-xl">👤</span>
          <span class="text-xs mt-1">我的</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { useOrderStore } from '~/stores/order'

const authStore = useAuthStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

// Check if logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Get user info
const userInfo = computed(() => userStore.userInfo)

// Get order counts
const orderCount = computed(() => orderStore.orderCount)
const validCouponCount = computed(() => userStore.validCoupons.length)

// Order tabs
const orderTabs = [
  { key: 'pending', label: '待支付', icon: '💰' },
  { key: 'paid', label: '已支付', icon: '📦' },
  { key: 'completed', label: '已完成', icon: '✅' },
  { key: 'all', label: '全部', icon: '📋' }
]

// Get order count for tab
const getOrderCount = (status: string) => {
  if (status === 'all') return orderCount.value.all
  if (status === 'pending') return orderCount.value.pending
  if (status === 'paid') return orderCount.value.paid
  if (status === 'completed') return orderCount.value.completed
  return 0
}

// Initialize
onMounted(async () => {
  authStore.initAuth()
  userStore.initUser()
  orderStore.loadOrders()
  
  if (isLoggedIn.value) {
    await Promise.all([
      userStore.fetchUserInfo(),
      userStore.fetchAddresses(),
      userStore.fetchCoupons(),
      orderStore.fetchOrders()
    ])
  }
})

// Navigate to edit profile
const goToEditProfile = () => {
  if (isLoggedIn.value) {
    navigateTo('/profile/edit')
  } else {
    navigateTo('/login')
  }
}

// Handle logout
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout()
    userStore.clearUser()
    orderStore.clearOrders()
    navigateTo('/')
  }
}

useHead({
  title: '个人中心 - COCO CLAW'
})
</script>

<style scoped>
.cyber-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #2a2a5a, transparent);
}
</style>
