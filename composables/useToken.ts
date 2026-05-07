/**
 * Token余额管理Composable
 */
import { ref } from 'vue'
import { request } from '@/utils/request'

export interface UserToken {
  id?: number
  userId?: number
  balance: number
  totalConsumed: number
  updateTime?: string
}

export interface Package {
  id?: number
  name: string
  tokenCount: number
  price: number
  originalPrice?: number
  description?: string
  type: number // 1: Token充值包 2: 订阅套餐
  validDays: number
  status: number
  sort: number
}

export interface UserSubscription {
  id?: number
  userId?: number
  packageId?: number
  packageName?: string
  tokenCount: number
  remainingTokens: number
  startTime?: string
  expireTime?: string
  status: number
  createTime?: string
}

export function useToken() {
  const loading = ref(false)
  const userToken = ref<UserToken | null>(null)
  const packages = ref<Package[]>([])
  const subscriptions = ref<UserSubscription[]>([])

  // 获取用户Token余额
  const fetchUserToken = async () => {
    loading.value = true
    try {
      const res = await request.get<UserToken>('/api/token/balance')
      if (res.code === 0) {
        userToken.value = res.data
      }
      return res
    } finally {
      loading.value = false
    }
  }

  // 获取可用套餐列表
  const fetchPackages = async (type?: number) => {
    const res = await request.get<Package[]>('/api/token/packages', {
      params: { type }
    })
    if (res.code === 0) {
      packages.value = res.data
    }
    return res
  }

  // 获取用户订阅列表
  const fetchSubscriptions = async () => {
    const res = await request.get<UserSubscription[]>('/api/token/subscriptions')
    if (res.code === 0) {
      subscriptions.value = res.data
    }
    return res
  }

  // 购买套餐
  const purchasePackage = async (packageId: number) => {
    return request.post('/api/token/purchase', { packageId })
  }

  // 充值Token
  const rechargeToken = async (amount: number, paymentMethod: string) => {
    return request.post('/api/token/recharge', { amount, paymentMethod })
  }

  return {
    loading,
    userToken,
    packages,
    subscriptions,
    fetchUserToken,
    fetchPackages,
    fetchSubscriptions,
    purchasePackage,
    rechargeToken
  }
}
