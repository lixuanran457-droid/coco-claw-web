<template>
  <div class="pay-page min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">订单支付</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="flex flex-col items-center justify-center py-20">
      <span class="text-5xl animate-spin">⟳</span>
      <p class="text-cyber-muted mt-4">加载中...</p>
    </div>

    <!-- Content -->
    <div v-else-if="order" class="px-4 py-4">
      <!-- Amount Card -->
      <div class="cyber-card p-6 rounded-xl mb-4 text-center">
        <p class="text-sm text-cyber-muted mb-2">应付金额</p>
        <div class="text-4xl font-bold text-cyber-primary mb-2">
          ¥{{ order.actualAmount }}
        </div>
        <p class="text-xs text-cyber-muted">
          订单号: {{ order.orderNo }}
        </p>
        <div 
          v-if="order.status === 'pending' && order.expireAt"
          class="mt-2 text-sm text-cyber-warning"
        >
          请在 {{ getExpireTime(order.expireAt) }} 内完成支付
        </div>
      </div>

      <!-- Order Items -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-3">商品明细</h3>
        <div class="space-y-3">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex items-center gap-3"
          >
            <div class="w-12 h-12 rounded-lg bg-cyber-gradient flex items-center justify-center text-lg flex-shrink-0">
              {{ item.skillIcon }}
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-cyber-text truncate">{{ item.skillName }}</h4>
              <p class="text-xs text-cyber-muted">x{{ item.quantity }}</p>
            </div>
            <span class="text-cyber-primary font-medium">¥{{ item.price * item.quantity }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-4">选择支付方式</h3>
        
        <div class="space-y-3">
          <!-- Alipay -->
          <label 
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all"
            :class="paymentMethod === 'alipay' ? 'bg-cyber-primary/10 border border-cyber-primary' : 'hover:bg-cyber-darker border border-transparent'"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">💙</span>
              <div>
                <p class="font-medium text-cyber-text">支付宝</p>
                <p class="text-xs text-cyber-muted">推荐有支付宝账户的用户使用</p>
              </div>
            </div>
            <input 
              type="radio" 
              v-model="paymentMethod" 
              value="alipay"
              class="w-5 h-5 accent-cyber-primary"
            />
          </label>

          <!-- Wechat Pay -->
          <label 
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all"
            :class="paymentMethod === 'wechat' ? 'bg-cyber-success/10 border border-cyber-success' : 'hover:bg-cyber-darker border border-transparent'"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">💚</span>
              <div>
                <p class="font-medium text-cyber-text">微信支付</p>
                <p class="text-xs text-cyber-muted">推荐有微信账户的用户使用</p>
              </div>
            </div>
            <input 
              type="radio" 
              v-model="paymentMethod" 
              value="wechat"
              class="w-5 h-5 accent-cyber-success"
            />
          </label>

          <!-- Bankcard -->
          <label 
            class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all"
            :class="paymentMethod === 'bankcard' ? 'bg-cyber-secondary/10 border border-cyber-secondary' : 'hover:bg-cyber-darker border border-transparent'"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">💳</span>
              <div>
                <p class="font-medium text-cyber-text">银行卡支付</p>
                <p class="text-xs text-cyber-muted">支持各大银行借记卡和信用卡</p>
              </div>
            </div>
            <input 
              type="radio" 
              v-model="paymentMethod" 
              value="bankcard"
              class="w-5 h-5 accent-cyber-secondary"
            />
          </label>
        </div>
      </div>

      <!-- Agreement -->
      <div class="flex items-start gap-2 mb-4">
        <input 
          type="checkbox" 
          v-model="agreeTerms"
          id="agreement"
          class="w-4 h-4 mt-1 rounded accent-cyber-primary"
        />
        <label for="agreement" class="text-xs text-cyber-muted">
          我已阅读并同意 
          <span class="text-cyber-primary">《支付服务协议》</span> 和 
          <span class="text-cyber-primary">《隐私政策》</span>
        </label>
      </div>

      <!-- Pay Button -->
      <button 
        @click="handlePay"
        :disabled="!agreeTerms || orderStore.loading"
        :class="[
          'w-full py-4 rounded-xl font-bold text-lg transition-all',
          agreeTerms && !orderStore.loading
            ? 'bg-cyber-gradient text-white hover:shadow-cyber-lg'
            : 'bg-cyber-card text-cyber-muted cursor-not-allowed'
        ]"
      >
        <span v-if="orderStore.loading" class="animate-spin mr-2">⟳</span>
        {{ orderStore.loading ? '支付中...' : `确认支付 ¥${order.actualAmount}` }}
      </button>

      <!-- Security Tips -->
      <div class="mt-4 text-center text-xs text-cyber-muted">
        <p>🔒 支付安全由多重加密保护</p>
        <p class="mt-1">请勿向任何人透露您的支付密码</p>
      </div>
    </div>

    <!-- Already Paid -->
    <div v-else-if="order && order.status !== 'pending'" class="px-4 py-4">
      <div class="cyber-card p-6 rounded-xl text-center">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-bold text-cyber-text mb-2">订单已支付</h2>
        <p class="text-cyber-muted mb-6">该订单已完成支付，感谢您的购买！</p>
        <div class="space-y-3">
          <NuxtLink to="/orders" class="block">
            <button class="cyber-btn w-full">查看订单</button>
          </NuxtLink>
          <NuxtLink to="/" class="block">
            <button class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-card transition-colors">
              返回首页
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Order Not Found -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <span class="text-7xl mb-6">📋</span>
      <h2 class="text-xl font-bold text-cyber-text mb-2">订单不存在</h2>
      <p class="text-cyber-muted mb-6">该订单可能已过期或不存在</p>
      <NuxtLink to="/orders">
        <button class="cyber-btn">
          返回订单列表
        </button>
      </NuxtLink>
    </div>

    <!-- Payment Success Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showSuccessModal"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <div class="cyber-card p-8 rounded-2xl text-center max-w-sm w-full">
            <div class="w-20 h-20 rounded-full bg-cyber-success/20 flex items-center justify-center text-5xl mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h2 class="text-2xl font-bold text-cyber-text mb-2">支付成功！</h2>
            <p class="text-cyber-muted mb-6">感谢您的购买，祝您使用愉快！</p>
            <div class="space-y-3">
              <NuxtLink to="/orders" class="block">
                <button @click="showSuccessModal = false" class="cyber-btn w-full">
                  查看订单
                </button>
              </NuxtLink>
              <NuxtLink to="/" class="block">
                <button 
                  @click="showSuccessModal = false"
                  class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-darker transition-colors"
                >
                  返回首页
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Payment Failed Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showFailedModal"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <div class="cyber-card p-8 rounded-2xl text-center max-w-sm w-full">
            <div class="w-20 h-20 rounded-full bg-cyber-danger/20 flex items-center justify-center text-5xl mx-auto mb-4">
              ✕
            </div>
            <h2 class="text-2xl font-bold text-cyber-text mb-2">支付失败</h2>
            <p class="text-cyber-muted mb-6">{{ errorMessage || '支付过程中出现问题，请稍后重试' }}</p>
            <div class="space-y-3">
              <button @click="retryPayment" class="cyber-btn w-full">
                重新支付
              </button>
              <button 
                @click="showFailedModal = false"
                class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-darker transition-colors"
              >
                返回订单列表
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/stores/order'

const route = useRoute()
const orderStore = useOrderStore()

// Payment method
const paymentMethod = ref<'alipay' | 'wechat' | 'bankcard'>('alipay')

// Agree terms
const agreeTerms = ref(false)

// Show modals
const showSuccessModal = ref(false)
const showFailedModal = ref(false)
const errorMessage = ref('')

// Get order
const order = computed(() => orderStore.currentOrder)

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

// Handle pay
const handlePay = async () => {
  if (!order.value || !agreeTerms.value) return

  // Simulate payment process
  orderStore.loading = true
  
  try {
    // Mock payment - in production, this would integrate with actual payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success (90% success rate for demo)
    const success = Math.random() > 0.1
    
    if (success) {
      await orderStore.payOrder(order.value.id, paymentMethod.value)
      showSuccessModal.value = true
    } else {
      errorMessage.value = '支付通道繁忙，请稍后重试'
      showFailedModal.value = true
    }
  } catch (error) {
    errorMessage.value = '支付过程中出现错误'
    showFailedModal.value = true
  } finally {
    orderStore.loading = false
  }
}

// Retry payment
const retryPayment = () => {
  showFailedModal.value = false
  agreeTerms.value = false
  handlePay()
}

// Initialize
onMounted(async () => {
  const orderId = route.query.orderId as string
  if (orderId) {
    await orderStore.fetchOrderById(orderId)
  }
})

useHead({
  title: '订单支付 - COCO CLAW'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}
</style>
