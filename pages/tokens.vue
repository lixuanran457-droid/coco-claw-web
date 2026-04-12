<template>
  <div class="min-h-screen pb-24">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">TOKEN 充值</h1>
          <p class="text-white/80 text-sm mt-1">选择套餐，畅享 AI 能力</p>
        </div>
        <NuxtLink to="/my-api" class="flex items-center text-sm bg-white/20 px-3 py-2 rounded-lg">
          <span class="mr-1">🔑</span>
          我的 API
        </NuxtLink>
      </div>
    </div>

    <!-- 当前余额/订阅提示 -->
    <div class="bg-gradient-to-r from-gray-800 to-gray-900 mx-3 -mt-4 rounded-xl shadow-lg p-4 border border-gray-700" v-if="isLoggedIn">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-gray-400 text-sm">我的资源</div>
          <div class="flex items-center mt-1">
            <span class="text-sm text-white font-medium">{{ currentResourceSummary }}</span>
          </div>
        </div>
        <NuxtLink to="/my-api" class="text-blue-400 text-sm">
          查看详情 →
        </NuxtLink>
      </div>
    </div>

    <!-- 订阅套餐 -->
    <div class="mt-6 px-3">
      <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
        <span class="mr-2">📦</span> 订阅套餐
      </h2>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-10">
        <van-loading type="spinner" color="#3b82f6">加载中...</van-loading>
      </div>

      <!-- 套餐列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          :class="[
            'rounded-2xl p-5 transition-all border-2',
            selectedPackage === pkg.id 
              ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500 shadow-lg shadow-blue-500/20' 
              : 'bg-gray-800/50 border-gray-700/50'
          ]"
          @click="selectPackage(pkg)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <span class="text-3xl mr-3">{{ pkg.icon || '📦' }}</span>
                <div>
                  <div class="flex items-center">
                    <span class="text-white font-bold text-lg">{{ pkg.name }}</span>
                    <span v-if="pkg.isRecommended" class="ml-2 text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full">
                      推荐
                    </span>
                    <span v-if="pkg.isHot" class="ml-2 text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-0.5 rounded-full">
                      热门
                    </span>
                  </div>
                  <div class="text-gray-400 text-sm mt-1">{{ pkg.description }}</div>
                </div>
              </div>
              
              <!-- 额度信息 -->
              <div class="flex gap-4 mt-4">
                <div class="bg-black/30 rounded-lg px-3 py-2">
                  <div class="text-xs text-gray-500">每日额度</div>
                  <div class="text-lg font-bold text-green-400">{{ pkg.dailyQuota || 0 }}</div>
                </div>
                <div class="bg-black/30 rounded-lg px-3 py-2">
                  <div class="text-xs text-gray-500">每月额度</div>
                  <div class="text-lg font-bold text-blue-400">{{ pkg.totalQuota || 0 }}</div>
                </div>
                <div class="bg-black/30 rounded-lg px-3 py-2">
                  <div class="text-xs text-gray-500">有效期</div>
                  <div class="text-lg font-bold text-purple-400">{{ pkg.durationDays || 30 }}天</div>
                </div>
              </div>
            </div>
            
            <!-- 价格 -->
            <div class="text-right ml-4">
              <div class="text-3xl font-bold text-white">¥{{ pkg.price }}</div>
              <div class="text-sm text-gray-500 line-through" v-if="pkg.originalPrice > pkg.price">
                ¥{{ pkg.originalPrice }}
              </div>
              <div class="text-xs text-green-400 mt-1" v-if="pkg.originalPrice > pkg.price">
                节省 ¥{{ (pkg.originalPrice - pkg.price).toFixed(0) }}
              </div>
            </div>
          </div>

          <!-- 选择状态 -->
          <div class="mt-4 pt-4 border-t border-gray-700/50 flex justify-end">
            <button
              :class="[
                'px-6 py-2 rounded-full font-medium transition-all',
                selectedPackage === pkg.id 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-700 text-gray-300'
              ]"
              @click.stop="selectPackage(pkg)"
            >
              {{ selectedPackage === pkg.id ? '✓ 已选择' : '选择' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 余额充值 -->
    <div class="mt-8 px-3">
      <h2 class="text-lg font-semibold text-white mb-4 flex items-center">
        <span class="mr-2">💰</span> 余额充值
      </h2>

      <div class="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400">充值金额</span>
          <div class="flex items-center">
            <span class="text-gray-400 mr-1">¥</span>
            <van-field
              v-model="rechargeAmount"
              type="number"
              placeholder="请输入金额"
              class="balance-input"
              input-align="right"
              @input="calculateUsd"
            />
          </div>
        </div>

        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>汇率</span>
          <span>1 元 = {{ exchangeRate }} 美元</span>
        </div>

        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/30">
          <span class="text-gray-400">获得美元余额</span>
          <span class="text-2xl font-bold text-green-400">${{ calculatedUsd }}</span>
        </div>

        <!-- 快捷金额 -->
        <div class="flex flex-wrap gap-2 mt-4">
          <van-button
            v-for="amount in quickAmounts"
            :key="amount"
            :type="rechargeAmount === amount.toString() ? 'primary' : 'default'"
            size="small"
            class="quick-btn"
            @click="setRechargeAmount(amount)"
          >
            ¥{{ amount }}
          </van-button>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 safe-area-bottom z-50">
      <div class="flex gap-3">
        <van-button
          v-if="selectedPackage"
          type="primary"
          block
          size="large"
          :loading="subscribing"
          class="action-btn"
          @click="handleSubscribe"
        >
          订阅套餐 ¥{{ selectedPackageInfo?.price }}
        </van-button>
        <van-button
          v-if="parseFloat(calculatedUsd) > 0"
          type="warning"
          block
          size="large"
          :loading="recharging"
          class="action-btn"
          @click="handleRecharge"
        >
          充值余额 ¥{{ rechargeAmount }}
        </van-button>
        <van-button
          v-if="!selectedPackage && parseFloat(calculatedUsd) <= 0"
          type="default"
          disabled
          block
          size="large"
          class="action-btn"
        >
          请选择套餐或输入充值金额
        </van-button>
      </div>
    </div>

    <!-- 充值成功提示 -->
    <van-dialog
      v-model:show="showSuccessDialog"
      title="操作成功"
      :message="successMessage"
      show-cancel-button
      confirm-button-text="去支付"
      cancel-button-text="稍后支付"
      @confirm="goToPay"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showFailToast, showSuccessToast } from 'vant'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(true)
const packages = ref([])
const isLoggedIn = ref(false)
const selectedPackage = ref(null)
const rechargeAmount = ref('')
const calculatedUsd = ref('0.00')
const subscribing = ref(false)
const recharging = ref(false)
const showSuccessDialog = ref(false)
const successMessage = ref('')
const pendingOrder = ref(null)
const userResources = ref(null)

// 常量
const exchangeRate = 0.14
const quickAmounts = [10, 50, 100, 200, 500]

// 计算属性
const currentResourceSummary = computed(() => {
  if (!userResources.value) return '暂无资源'
  const subs = userResources.value.subscriptions || []
  const balance = userResources.value.balance?.balance || 0
  
  const activeSub = subs.find(s => s.status === 'ACTIVE')
  if (activeSub) {
    return `${activeSub.name} · 余额 $${balance}`
  }
  return `余额 $${balance}`
})

const selectedPackageInfo = computed(() => {
  return packages.value.find(p => p.id === selectedPackage.value)
})

// 方法
const loadData = async () => {
  try {
    loading.value = true

    // 检查登录状态
    const userInfo = localStorage.getItem('userInfo')
    isLoggedIn.value = !!userInfo

    // 并行请求
    const [packagesRes] = await Promise.all([
      axios.get('/api/token/packages').catch(() => ({ data: { code: 200, data: defaultPackages } }))
    ])

    if (packagesRes.data.code === 200) {
      packages.value = packagesRes.data.data || defaultPackages
    }

    // 如果已登录，获取用户资源
    if (isLoggedIn.value) {
      try {
        const resourcesRes = await axios.get('/api/token/user/resources')
        if (resourcesRes.data.code === 200) {
          userResources.value = resourcesRes.data.data
        }
      } catch (e) {
        console.log('获取用户资源失败')
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    packages.value = defaultPackages
  } finally {
    loading.value = false
  }
}

// 默认套餐数据
const defaultPackages = [
  {
    id: 1,
    name: '体验版',
    icon: '🌱',
    description: '适合新手试用',
    price: 9.9,
    originalPrice: 19.9,
    dailyQuota: 100,
    totalQuota: 3000,
    durationDays: 7,
    isRecommended: false,
    isHot: false
  },
  {
    id: 2,
    name: '月卡',
    icon: '🌟',
    description: '性价比之选',
    price: 49,
    originalPrice: 79,
    dailyQuota: 1000,
    totalQuota: 30000,
    durationDays: 30,
    isRecommended: true,
    isHot: true
  },
  {
    id: 3,
    name: '季卡',
    icon: '🚀',
    description: '进阶用户推荐',
    price: 129,
    originalPrice: 199,
    dailyQuota: 1500,
    totalQuota: 135000,
    durationDays: 90,
    isRecommended: false,
    isHot: true
  },
  {
    id: 4,
    name: '年卡',
    icon: '👑',
    description: '长期用户首选',
    price: 399,
    originalPrice: 599,
    dailyQuota: 2000,
    totalQuota: 730000,
    durationDays: 365,
    isRecommended: false,
    isHot: false
  }
]

const selectPackage = (pkg) => {
  if (selectedPackage.value === pkg.id) {
    selectedPackage.value = null
  } else {
    selectedPackage.value = pkg.id
    rechargeAmount.value = ''
    calculatedUsd.value = '0.00'
  }
}

const setRechargeAmount = (amount) => {
  rechargeAmount.value = amount.toString()
  selectedPackage.value = null
  calculateUsd()
}

const calculateUsd = () => {
  const amount = parseFloat(rechargeAmount.value) || 0
  calculatedUsd.value = (amount * exchangeRate).toFixed(2)
}

const handleSubscribe = async () => {
  if (!selectedPackage.value) {
    showToast('请选择套餐')
    return
  }

  try {
    subscribing.value = true
    const res = await axios.post('/api/token/subscribe', {
      packageId: selectedPackage.value
    })

    if (res.data.code === 200) {
      pendingOrder.value = res.data.data
      successMessage.value = `您已选择 ${selectedPackageInfo.value.name}，即将跳转到支付页面`
      showSuccessDialog.value = true
    } else {
      showFailToast(res.data.message || '创建订单失败')
    }
  } catch (error) {
    showFailToast('网络错误')
  } finally {
    subscribing.value = false
  }
}

const handleRecharge = async () => {
  const amount = parseFloat(rechargeAmount.value)
  if (!amount || amount < 1) {
    showToast('最小充值金额为 1 元')
    return
  }

  try {
    recharging.value = true
    const res = await axios.post('/api/token/recharge-balance', {
      amount: amount
    })

    if (res.data.code === 200) {
      pendingOrder.value = res.data.data
      successMessage.value = `您将充值 ¥${amount}，获得 $${calculatedUsd.value} 余额`
      showSuccessDialog.value = true
    } else {
      showFailToast(res.data.message || '创建订单失败')
    }
  } catch (error) {
    showFailToast('网络错误')
  } finally {
    recharging.value = false
  }
}

const goToPay = () => {
  if (pendingOrder.value?.orderNo) {
    router.push(`/pay?orderNo=${pendingOrder.value.orderNo}`)
  }
}

onMounted(() => {
  loadData()
  
  // 检查 URL 参数
  if (route.query.package) {
    selectedPackage.value = parseInt(route.query.package)
  }
})

useHead({
  title: 'TOKEN 充值 - COCO CLAW'
})
</script>

<style scoped>
.balance-input :deep(.van-field__control) {
  color: white;
  font-size: 18px;
}

.balance-input :deep(.van-field__body) {
  justify-content: flex-end;
}

.quick-btn {
  border-radius: 20px;
}

.action-btn {
  border-radius: 12px;
}
</style>
