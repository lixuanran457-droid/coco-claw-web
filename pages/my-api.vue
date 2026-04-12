<template>
  <div class="min-h-screen pb-6">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-4 py-6">
      <h1 class="text-xl font-bold">控制台</h1>
      <p class="text-white/80 text-sm mt-1">管理您的 API 和资源</p>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isLoggedIn" class="mx-3 -mt-4 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div class="text-center">
        <div class="text-4xl mb-3">🔐</div>
        <div class="text-white font-medium mb-2">请先登录</div>
        <div class="text-gray-400 text-sm mb-4">登录后可管理您的 API 和兑换码</div>
        <NuxtLink to="/login">
          <van-button type="primary" block>去登录</van-button>
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- API Key 卡片 -->
      <div class="mx-3 -mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 shadow-lg">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="text-gray-400 text-sm">我的 API Key</div>
            <div class="text-white font-mono text-sm mt-1 break-all">
              {{ maskedApiKey || '暂无 API Key' }}
            </div>
          </div>
          <button 
            v-if="userData?.apiKey"
            @click="copyApiKey" 
            class="text-blue-400 text-sm bg-blue-500/20 px-3 py-1 rounded-lg"
          >
            复制
          </button>
        </div>

        <div v-if="userData?.baseUrl" class="mt-3 pt-3 border-t border-gray-700">
          <div class="text-gray-400 text-sm">Base URL</div>
          <div class="text-white font-mono text-xs mt-1 break-all">
            {{ maskedBaseUrl }}
          </div>
        </div>

        <!-- 当前使用资源 -->
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="text-gray-400 text-sm mb-2">当前使用</div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-2">{{ currentResourceIcon }}</span>
              <span class="text-white font-medium">{{ currentResourceName }}</span>
            </div>
            <span 
              :class="[
                'text-xs px-2 py-1 rounded-full',
                currentResourceStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              ]"
            >
              {{ currentResourceStatus === 'active' ? '使用中' : '未激活' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 资源切换 -->
      <div class="mx-3 mt-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-white font-semibold">我的资源</h3>
          <NuxtLink to="/tokens" class="text-blue-400 text-sm">
            去充值 →
          </NuxtLink>
        </div>

        <!-- 订阅列表 -->
        <div v-if="subscriptions.length > 0" class="mb-4">
          <div class="text-gray-400 text-sm mb-2">订阅套餐</div>
          <div class="space-y-2">
            <div
              v-for="sub in subscriptions"
              :key="sub.id"
              :class="[
                'bg-gray-800/50 rounded-xl p-4 border transition-all cursor-pointer',
                activeSubscription?.id === sub.id 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-gray-700/50'
              ]"
              @click="switchToSubscription(sub)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ sub.icon || '📦' }}</span>
                  <div>
                    <div class="text-white font-medium">{{ sub.name }}</div>
                    <div class="text-gray-400 text-xs mt-1">
                      剩余 {{ sub.remainingQuota || 0 }} / {{ sub.totalQuota || 0 }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3',
                      activeSubscription?.id === sub.id 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-600'
                    ]"
                  >
                    <span v-if="activeSubscription?.id === sub.id" class="text-white text-xs">✓</span>
                  </div>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div class="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                  :style="{ width: `${sub.usagePercent || 0}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>已用 {{ sub.usedQuota || 0 }}</span>
                <span>有效期至 {{ sub.expireTime || '永久' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 余额 -->
        <div v-if="balance > 0" class="mb-4">
          <div class="text-gray-400 text-sm mb-2">余额</div>
          <div
            :class="[
              'bg-gray-800/50 rounded-xl p-4 border transition-all cursor-pointer',
              activeSubscription?.id === 'BALANCE' 
                ? 'border-green-500 bg-green-900/20' 
                : 'border-gray-700/50'
            ]"
            @click="switchToBalance"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-2xl mr-3">💰</span>
                <div>
                  <div class="text-white font-medium">余额支付</div>
                  <div class="text-gray-400 text-xs mt-1">
                    按实际使用量扣除
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-green-400">${{ balance }}</div>
                <div 
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto',
                    activeSubscription?.id === 'BALANCE' 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-600'
                  ]"
                >
                  <span v-if="activeSubscription?.id === 'BALANCE'" class="text-white text-xs">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 兑换码 -->
      <div class="mx-3 mt-6">
        <h3 class="text-white font-semibold mb-3 flex items-center">
          <span class="mr-2">🎫</span> 兑换码
        </h3>
        
        <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div class="flex gap-2 mb-3">
            <van-field
              v-model="redeemCode"
              placeholder="请输入兑换码"
              class="flex-1 bg-gray-900/50 rounded-lg"
              @keyup.enter="handleRedeem"
            />
            <van-button 
              type="primary" 
              :loading="redeeming"
              @click="handleRedeem"
            >
              兑换
            </van-button>
          </div>
          <div class="text-gray-500 text-xs">
            购买后获得的兑换码可在此处激活
          </div>
        </div>
      </div>

      <!-- 使用统计 -->
      <div class="mx-3 mt-6">
        <h3 class="text-white font-semibold mb-3 flex items-center">
          <span class="mr-2">📊</span> 使用统计
        </h3>
        
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
            <div class="text-2xl font-bold text-blue-400">{{ usageStats.totalUsed || 0 }}</div>
            <div class="text-gray-400 text-xs mt-1">总使用量</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
            <div class="text-2xl font-bold text-green-400">{{ usageStats.todayUsed || 0 }}</div>
            <div class="text-gray-400 text-xs mt-1">今日使用</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
            <div class="text-2xl font-bold text-purple-400">{{ usageStats.totalCost || 0 }}</div>
            <div class="text-gray-400 text-xs mt-1">消费金额($)</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
            <div class="text-2xl font-bold text-yellow-400">{{ usageStats.callCount || 0 }}</div>
            <div class="text-gray-400 text-xs mt-1">调用次数</div>
          </div>
        </div>
      </div>

      <!-- 第三方绑定 -->
      <div class="mx-3 mt-6 mb-6">
        <h3 class="text-white font-semibold mb-3 flex items-center">
          <span class="mr-2">🔗</span> 第三方绑定
        </h3>
        
        <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">🤖</span>
              <div>
                <div class="text-white font-medium">AskToken</div>
                <div class="text-gray-400 text-xs mt-1">
                  {{ thirdPartyStatus === 'bound' ? '已绑定' : '未绑定' }}
                </div>
              </div>
            </div>
            <van-button 
              :type="thirdPartyStatus === 'bound' ? 'default' : 'primary'"
              size="small"
              @click="handleThirdPartyBind"
            >
              {{ thirdPartyStatus === 'bound' ? '重新绑定' : '立即绑定' }}
            </van-button>
          </div>
        </div>
      </div>

      <!-- 使用文档 -->
      <div class="mx-3 mt-4 mb-6">
        <div class="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-700/30">
          <div class="flex items-start">
            <span class="text-2xl mr-3">💡</span>
            <div>
              <div class="text-white font-medium">使用提示</div>
              <div class="text-gray-400 text-sm mt-2 space-y-1">
                <p>1. 购买套餐后，使用兑换码激活</p>
                <p>2. 绑定第三方账号获取 API Key</p>
                <p>3. 在控制台选择当前使用的资源</p>
                <p>4. API Key 仅显示一次，请妥善保存</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import axios from 'axios'

const isLoggedIn = ref(false)
const userData = ref(null)
const subscriptions = ref([])
const balance = ref(0)
const redeemCode = ref('')
const redeeming = ref(false)
const usageStats = ref({})
const thirdPartyStatus = ref('unbound')

// 加载状态
onMounted(() => {
  checkLoginAndLoad()
})

const checkLoginAndLoad = async () => {
  const userInfo = localStorage.getItem('userInfo')
  isLoggedIn.value = !!userInfo
  
  if (isLoggedIn.value) {
    userData.value = JSON.parse(userInfo)
    await loadUserData()
  }
}

const loadUserData = async () => {
  try {
    // 加载用户资源
    const resourcesRes = await axios.get('/api/token/user/resources').catch(() => null)
    if (resourcesRes?.data?.code === 200) {
      const data = resourcesRes.data.data
      
      userData.value = {
        ...userData.value,
        apiKey: data.apiKey?.apiKey,
        baseUrl: data.apiKey?.baseUrl,
        currentType: data.apiKey?.currentType
      }
      
      subscriptions.value = data.subscriptions || []
      balance.value = data.balance?.balance || 0
      
      if (data.apiKey?.currentType === 'BALANCE') {
        thirdPartyStatus.value = 'bound'
      }
    }

    // 加载使用统计
    const statsRes = await axios.get('/api/token/usage-stats').catch(() => null)
    if (statsRes?.data?.code === 200) {
      usageStats.value = statsRes.data.data
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    // 使用默认数据
    loadMockData()
  }
}

const loadMockData = () => {
  subscriptions.value = [
    {
      id: 1,
      name: '月卡',
      icon: '🌟',
      usedQuota: 15000,
      totalQuota: 30000,
      remainingQuota: 15000,
      usagePercent: 50,
      expireTime: '2026-05-01',
      isActive: true
    }
  ]
  balance.value = 12.5
  usageStats.value = {
    totalUsed: 45000,
    todayUsed: 1500,
    totalCost: 8.5,
    callCount: 328
  }
}

const maskedApiKey = computed(() => {
  if (!userData.value?.apiKey) return null
  const key = userData.value.apiKey
  return key.substring(0, 12) + '...' + key.substring(key.length - 8)
})

const maskedBaseUrl = computed(() => {
  if (!userData.value?.baseUrl) return null
  return userData.value.baseUrl
})

const currentResourceIcon = computed(() => {
  if (userData.value?.currentType === 'BALANCE') return '💰'
  const sub = subscriptions.value.find(s => s.isActive)
  return sub?.icon || '📦'
})

const currentResourceName = computed(() => {
  if (userData.value?.currentType === 'BALANCE') return `余额 $${balance.value}`
  const sub = subscriptions.value.find(s => s.isActive)
  return sub?.name || '未选择'
})

const currentResourceStatus = computed(() => {
  if (userData.value?.apiKey) return 'active'
  return 'inactive'
})

const activeSubscription = computed(() => {
  if (userData.value?.currentType === 'BALANCE') {
    return { id: 'BALANCE' }
  }
  return subscriptions.value.find(s => s.isActive) || subscriptions.value[0]
})

const copyApiKey = async () => {
  if (!userData.value?.apiKey) {
    showToast('暂无 API Key')
    return
  }
  try {
    await navigator.clipboard.writeText(userData.value.apiKey)
    showSuccessToast('已复制到剪贴板')
  } catch {
    showFailToast('复制失败')
  }
}

const switchToSubscription = async (sub) => {
  try {
    await axios.post('/api/token/switch-resource', {
      type: 'SUBSCRIPTION',
      subscriptionId: sub.id
    })
    showSuccessToast('已切换到 ' + sub.name)
    userData.value.currentType = 'SUBSCRIPTION'
    loadUserData()
  } catch (error) {
    showFailToast('切换失败')
  }
}

const switchToBalance = async () => {
  try {
    await axios.post('/api/token/switch-resource', {
      type: 'BALANCE'
    })
    showSuccessToast('已切换到余额支付')
    userData.value.currentType = 'BALANCE'
    loadUserData()
  } catch (error) {
    showFailToast('切换失败')
  }
}

const handleRedeem = async () => {
  if (!redeemCode.value.trim()) {
    showToast('请输入兑换码')
    return
  }

  try {
    redeeming.value = true
    const res = await axios.post('/api/token/redeem', {
      code: redeemCode.value.trim()
    })

    if (res.data.code === 200) {
      showSuccessToast('兑换成功')
      redeemCode.value = ''
      await loadUserData()
    } else {
      showFailToast(res.data.message || '兑换失败')
    }
  } catch (error) {
    showFailToast('网络错误')
  } finally {
    redeeming.value = false
  }
}

const handleThirdPartyBind = () => {
  showToast('跳转到第三方绑定页面...')
  // TODO: 实现第三方绑定逻辑
}

useHead({
  title: '控制台 - COCO CLAW'
})
</script>

<style scoped>
:deep(.van-field__control) {
  color: white;
}

:deep(.van-field) {
  background: transparent;
}
</style>
