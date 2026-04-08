<template>
  <div class="guest-pay-page min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">确认订单</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="flex flex-col items-center justify-center py-20">
      <span class="text-5xl animate-spin">⟳</span>
      <p class="text-cyber-muted mt-4">处理中...</p>
    </div>

    <!-- Content -->
    <div v-else class="px-4 py-4">
      <!-- Guest Info -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-4">联系方式</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-cyber-muted mb-2">邮箱地址</label>
            <input
              v-model="guestEmail"
              type="email"
              placeholder="请输入邮箱地址，用于接收订单信息"
              class="cyber-input"
            />
            <p class="text-xs text-cyber-muted mt-1">下单后可通过邮箱查询订单状态</p>
          </div>

          <div v-if="captchaSent" class="flex gap-2">
            <input
              v-model="captcha"
              type="text"
              placeholder="输入验证码"
              class="cyber-input flex-1"
              maxlength="6"
            />
            <button 
              @click="sendCaptcha"
              :disabled="countdown > 0"
              class="px-4 py-3 rounded-lg bg-cyber-card border border-cyber-border text-cyber-primary text-sm font-medium whitespace-nowrap hover:border-cyber-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="emailVerified" class="mt-3 p-2 rounded-lg bg-cyber-success/20 text-cyber-success text-sm">
          ✓ 邮箱验证成功
        </div>
      </div>

      <!-- Product Info -->
      <div class="cyber-card p-4 rounded-xl mb-4">
        <h3 class="font-bold text-cyber-text mb-4">商品信息</h3>
        
        <div class="flex items-center gap-3">
          <div class="w-16 h-16 rounded-lg bg-cyber-gradient flex items-center justify-center text-2xl flex-shrink-0">
            {{ skill?.icon || '📦' }}
          </div>
          <div class="flex-1">
            <h4 class="text-lg font-bold text-cyber-text">{{ skill?.name }}</h4>
            <p class="text-sm text-cyber-muted">{{ skill?.description }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-cyber-border">
          <div class="flex justify-between items-center">
            <span class="text-cyber-muted">商品价格</span>
            <span class="text-lg font-bold text-cyber-primary">¥{{ skill?.price }}</span>
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

      <!-- Error Message -->
      <div 
        v-if="orderStore.error" 
        class="mb-4 p-3 rounded-lg bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger text-sm"
      >
        {{ orderStore.error }}
      </div>

      <!-- Pay Button -->
      <button 
        @click="handleCreatePayment"
        :disabled="!canPay || orderStore.loading"
        class="w-full py-4 rounded-xl font-bold text-lg transition-all bg-cyber-gradient text-white hover:shadow-cyber-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="orderStore.loading" class="animate-spin mr-2">⟳</span>
        {{ orderStore.loading ? '创建订单中...' : `确认支付 ¥${skill?.price || 0}` }}
      </button>

      <!-- Tips -->
      <div class="mt-4 p-3 rounded-lg bg-cyber-card/50">
        <h4 class="text-sm font-medium text-cyber-text mb-2">温馨提示</h4>
        <ul class="text-xs text-cyber-muted space-y-1">
          <li>• 下单后可凭邮箱查询订单状态</li>
          <li>• 请确保邮箱地址填写正确</li>
          <li>• 订单支付有效期为30分钟</li>
        </ul>
      </div>
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
            <h2 class="text-2xl font-bold text-cyber-text mb-2">订单创建成功！</h2>
            <p class="text-cyber-muted mb-2">请在30分钟内完成支付</p>
            <p class="text-sm text-cyber-primary mb-6">订单号: {{ createdOrderNo }}</p>
            <div class="space-y-3">
              <button @click="goToPay" class="cyber-btn w-full">
                前往支付
              </button>
              <button 
                @click="goToQuery"
                class="w-full py-3 rounded-xl border border-cyber-border text-cyber-text hover:bg-cyber-darker transition-colors"
              >
                订单查询
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

definePageMeta({
  layout: false
})

const route = useRoute()
const orderStore = useOrderStore()

// Get skill info from query
const skillId = computed(() => parseInt(route.query.skillId as string) || 0)
const skill = ref<{ id: number; name: string; description: string; icon: string; price: number } | null>(null)

// Guest info
const guestEmail = ref('')
const captcha = ref('')
const captchaSent = ref(false)
const emailVerified = ref(false)
const countdown = ref(0)

// Payment
const paymentMethod = ref<'alipay' | 'wechat'>('alipay')

// Modal
const showSuccessModal = ref(false)
const createdOrderNo = ref('')

// Load skill info (mock for now)
onMounted(() => {
  // In production, fetch from API
  const mockSkills: Record<number, any> = {
    1: { id: 1, name: 'AI写作助手', description: '智能写作辅助工具', icon: '✍️', price: 99 },
    2: { id: 2, name: '图片生成器', description: 'AI图片生成服务', icon: '🎨', price: 199 },
    3: { id: 3, name: '语音合成', description: '高质量语音合成', icon: '🎤', price: 149 }
  }
  skill.value = mockSkills[skillId.value] || { id: skillId.value, name: '未知商品', description: '', icon: '📦', price: 0 }
})

// Send captcha
const sendCaptcha = async () => {
  if (!guestEmail.value || !guestEmail.value.includes('@')) {
    orderStore.error = '请输入正确的邮箱地址'
    return
  }

  const result = await orderStore.sendGuestQueryCaptcha(guestEmail.value)
  if (result.success) {
    captchaSent.value = true
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

// Can pay
const canPay = computed(() => {
  if (!skill.value || !skill.value.price) return false
  if (skill.value.price === 0) return true // Free item
  return guestEmail.value && guestEmail.value.includes('@')
})

// Create payment
const handleCreatePayment = async () => {
  if (!canPay.value) return

  const result = await orderStore.createPayment({
    skillId: skillId.value,
    email: guestEmail.value,
    paymentMethod: paymentMethod.value
  })

  if (result.success) {
    createdOrderNo.value = result.data?.orderNo || ''
    showSuccessModal.value = true
  }
}

// Go to pay page
const goToPay = () => {
  showSuccessModal.value = false
  // In production, redirect to actual payment page or QR code
  navigateTo(`/pay?orderNo=${createdOrderNo.value}`)
}

// Go to query page
const goToQuery = () => {
  showSuccessModal.value = false
  navigateTo(`/guest-query?email=${guestEmail.value}`)
}

useHead({
  title: '确认订单 - COCO CLAW'
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
