/**
 * 使用记录Composable
 */
import { ref } from 'vue'
import { request } from '@/utils/request'

export interface UsageRecord {
  id?: number
  userId?: number
  apiKeyId?: number
  apiKey?: string
  apiName: string
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
  latency: number
  status: number
  errorMessage?: string
  createTime?: string
}

export interface UsagePageResult {
  list: UsageRecord[]
  total: number
  page: number
  pageSize: number
}

export interface UsageStats {
  totalCalls: number
  totalTokens: number
  totalCost: number
  todayCalls: number
  todayTokens: number
  todayCost: number
}

export function useUsage() {
  const loading = ref(false)
  const usageRecords = ref<UsageRecord[]>([])
  const total = ref(0)
  const stats = ref<UsageStats | null>(null)

  // 获取使用记录列表
  const fetchUsageRecords = async (params: {
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
    apiKeyId?: number
  } = {}) => {
    loading.value = true
    try {
      const res = await request.get<UsagePageResult>('/api/usage/list', {
        params: {
          page: params.page || 1,
          pageSize: params.pageSize || 20,
          startDate: params.startDate,
          endDate: params.endDate,
          apiKeyId: params.apiKeyId
        }
      })
      if (res.code === 0) {
        usageRecords.value = res.data.list
        total.value = res.data.total
      }
      return res
    } finally {
      loading.value = false
    }
  }

  // 获取使用统计
  const fetchUsageStats = async (apiKeyId?: number) => {
    const res = await request.get<UsageStats>('/api/usage/stats', {
      params: { apiKeyId }
    })
    if (res.code === 0) {
      stats.value = res.data
    }
    return res
  }

  return {
    loading,
    usageRecords,
    total,
    stats,
    fetchUsageRecords,
    fetchUsageStats
  }
}
