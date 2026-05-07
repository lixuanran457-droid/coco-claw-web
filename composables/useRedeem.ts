/**
 * 兑换码Composable
 */
import { ref } from 'vue'
import { request } from '@/utils/request'

export interface RedeemCode {
  id?: number
  code: string
  tokenCount: number
  type: number // 1: Token兑换 2: 套餐兑换
  packageId?: number
  packageName?: string
  usedBy?: number
  usedByUsername?: string
  usedAt?: string
  status: number // 0: 未使用 1: 已使用 2: 已过期
  expireTime?: string
  createTime?: string
}

export function useRedeem() {
  const loading = ref(false)

  // 兑换码兑换
  const redeemCode = async (code: string) => {
    loading.value = true
    try {
      const res = await request.post<{ tokenCount: number; message: string }>('/api/redeem/exchange', {
        code
      })
      return res
    } finally {
      loading.value = false
    }
  }

  // 验证兑换码
  const validateCode = async (code: string) => {
    const res = await request.get<RedeemCode>('/api/redeem/validate', {
      params: { code }
    })
    return res
  }

  return {
    loading,
    redeemCode,
    validateCode
  }
}
