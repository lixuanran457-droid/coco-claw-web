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
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <span class="text-5xl animate-spin">⟳</span>
      <p class="text-cyber-muted mt-4">加载中...</p>
    </div>

    <!-- Content -->
    <div v-else-if="paymentInfo" class="px-4 py-4">
      <!-- Amount Card -->
      <div class="cyber-card p-6 rounded-xl mb-4 text-center">
        <p class="text-sm text-cyber-muted mb-2">应付金额</p>
        <div class="text-4xl font-bold text-cyber-primary mb-2">
          ¥{{ paymentInfo.amount }}
        </div>
        <p class="text-xs text-cyber-muted">
          订单号: {{ paymentInfo.orderNo }}
        </p>
        <div 
          v-if="paymentInfo.status === 0"
          class="mt-2 text-sm text-cyber-warning"
        >
          请在30分钟内完成支付
        </div>
      </div>

      <!-- Order Items -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-3">商品明细</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-cyber-gradient flex items-center justify-center text-lg flex-shrink-0">
              🎯
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-cyber-text truncate">{{ paymentInfo.skillName }}</h4>
              <p class="text-xs text-cyber-muted">x1</p>
            </div>
            <span class="text-cyber-primary font-medium">¥{{ paymentInfo.amount }}</span>
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
        :disabled="!agreeTerms || loading"
        :class="[
          'w-full py-4 rounded-xl font-bold text-lg transition-all',
          agreeTerms && !loading
            ? 'bg-cyber-gradient text-white hover:shadow-cyber-lg'
            : 'bg-cyber-card text-cyber-muted cursor-not-allowed'
        ]"
      >
        <span v-if="loading" class="animate-spin mr-2">⟳</span>
        {{ loading ? '支付中...' : `确认支付 ¥${paymentInfo.amount}` }}
      </button>

      <!-- Security Tips -->
      <div class="mt-4 text-center text-xs text-cyber-muted">
        <p>🔒 支付安全由多重加密保护</p>
        <p class="mt-1">请勿向任何人透露您的支付密码</p>
      </div>
    </div>

    <!-- Already Paid -->
    <div v-else-if="paymentInfo && paymentInfo.status !== 0" class="px-4 py-4">
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
            <p class="text-cyber-muted mb-6">感谢您的购买，您已获得该技能的使用权限！</p>
            <div class="space-y-3">
              <NuxtLink to="/profile" class="block">
                <button @click="showSuccessModal = false" class="cyber-btn w-full">
                  查看我的技能
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

    <!-- WeChat QRCode Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showQRCodeModal"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          @click.self="showQRCodeModal = false"
        >
          <div class="cyber-card p-6 rounded-2xl text-center max-w-sm w-full">
            <h2 class="text-xl font-bold text-cyber-text mb-4">请使用微信扫码支付</h2>
            <div class="bg-white p-4 rounded-lg mb-4">
              <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="微信支付二维码" class="w-48 h-48 mx-auto" />
              <div v-else class="w-48 h-48 mx-auto flex items-center justify-center">
                <span class="text-5xl animate-spin text-gray-400">⟳</span>
              </div>
            </div>
            <p class="text-sm text-cyber-muted mb-4">金额: ¥{{ paymentInfo?.amount }}</p>
            <button 
              @click="checkPaymentStatus"
              class="cyber-btn w-full mb-2"
            >
              已完成支付
            </button>
            <button 
              @click="showQRCodeModal = false"
              class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-darker transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

const route = useRoute()

// State
const loading = ref(false)
const paymentInfo = ref<any>(null)
const paymentMethod = ref<'alipay' | 'wechat'>('alipay')
const agreeTerms = ref(false)
const showSuccessModal = ref(false)
const showFailedModal = ref(false)
const showQRCodeModal = ref(false)
const qrCodeUrl = ref('')
const errorMessage = ref('')
const orderId = ref<number | null>(null)

// API base URL
const apiBase = '/api'

// Create payment
const createPayment = async () => {
  loading.value = true
  try {
    const skillId = route.query.skillId as string
    if (!skillId) {
      throw new Error('商品ID不能为空')
    }

    const response = await axios.post(`${apiBase}/payment/create`, {
      skillId: parseInt(skillId),
      paymentMethod: paymentMethod.value
    })

    if (response.data.code === 200) {
      paymentInfo.value = response.data.data
      orderId.value = paymentInfo.value.orderId
    } else {
      throw new Error(response.data.message || '创建支付失败')
    }
  } catch (error: any) {
    errorMessage.value = error.message
    showFailedModal.value = true
  } finally {
    loading.value = false
  }
}

// Handle pay
const handlePay = async () => {
  if (!paymentInfo.value || !agreeTerms.value) return

  loading.value = true

  try {
    // Get real payment params from backend
    const payParams = paymentInfo.value.payParams

    if (paymentMethod.value === 'wechat' && payParams?.type === 'qrcode') {
      // WeChat Pay - Show QR Code
      qrCodeUrl.value = payParams.codeUrl
      showQRCodeModal.value = true
      
      // Start polling for payment status
      startPaymentPolling()
    } else if (paymentMethod.value === 'alipay' && payParams?.type === 'html') {
      // Alipay - Submit form automatically
      // Create a form and submit it
      const container = document.createElement('div')
      container.innerHTML = payParams.payForm
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100%'
      container.style.zIndex = '9999'
      container.style.background = 'white'
      document.body.appendChild(container)
      
      const form = container.querySelector('form')
      if (form) {
        form.submit()
      }
      
      // Start polling for payment status
      startPaymentPolling()
    } else {
      // Sandbox/Mock mode - simulate success
      await new Promise(resolve => setTimeout(resolve, 2000))
      await checkPaymentStatus()
    }
  } catch (error: any) {
    errorMessage.value = error.message
    showFailedModal.value = true
  } finally {
    loading.value = false
  }
}

// Payment status polling
let pollingTimer: any = null

const startPaymentPolling = () => {
  pollingTimer = setInterval(async () => {
    await checkPaymentStatus()
  }, 3000) // Check every 3 seconds
}

const stopPaymentPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

// Check payment status
const checkPaymentStatus = async () => {
  if (!orderId.value) return

  try {
    const response = await axios.get(`${apiBase}/payment/status/${orderId.value}`)
    
    if (response.data.code === 200) {
      const status = response.data.data.status
      
      if (status === 2) { // 已支付
        stopPaymentPolling()
        showQRCodeModal.value = false
        showSuccessModal.value = true
        paymentInfo.value.status = 2
      }
    }
  } catch (error) {
    console.error('查询支付状态失败:', error)
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
  // Check if we have an existing order
  const existingOrderId = route.query.orderId as string
  
  if (existingOrderId) {
    // Query existing order
    try {
      loading.value = true
      const response = await axios.get(`${apiBase}/payment/status/${existingOrderId}`)
      if (response.data.code === 200) {
        paymentInfo.value = response.data.data
        orderId.value = existingOrderId
      }
    } catch (error) {
      console.error('查询订单失败:', error)
    } finally {
      loading.value = false
    }
  } else {
    // Create new payment
    await createPayment()
  }
})

onUnmounted(() => {
  stopPaymentPolling()
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
