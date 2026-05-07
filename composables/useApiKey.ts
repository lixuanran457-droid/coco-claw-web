/**
 * API密钥管理Composable
 */
import { ref } from 'vue'
import { request } from '@/utils/request'

export interface ApiKey {
  id?: number
  userId?: number
  apiKey: string
  secretKey: string
  name: string
  status: number
  expireTime?: string
  createTime?: string
  updateTime?: string
}

export interface ApiKeyPageResult {
  list: ApiKey[]
  total: number
  page: number
  pageSize: number
}

export function useApiKey() {
  const loading = ref(false)
  const apiKeys = ref<ApiKey[]>([])
  const total = ref(0)

  // 获取API密钥列表
  const fetchApiKeys = async (page = 1, pageSize = 10) => {
    loading.value = true
    try {
      const res = await request.get<ApiKeyPageResult>('/api/apikey/list', {
        params: { page, pageSize }
      })
      if (res.code === 0) {
        apiKeys.value = res.data.list
        total.value = res.data.total
      }
      return res
    } finally {
      loading.value = false
    }
  }

  // 创建API密钥
  const createApiKey = async (data: Partial<ApiKey>) => {
    const res = await request.post<ApiKey>('/api/apikey/create', data)
    if (res.code === 0) {
      await fetchApiKeys()
    }
    return res
  }

  // 更新API密钥
  const updateApiKey = async (id: number, data: Partial<ApiKey>) => {
    const res = await request.put<ApiKey>(`/api/apikey/${id}`, data)
    if (res.code === 0) {
      await fetchApiKeys()
    }
    return res
  }

  // 删除API密钥
  const deleteApiKey = async (id: number) => {
    const res = await request.delete(`/api/apikey/${id}`)
    if (res.code === 0) {
      await fetchApiKeys()
    }
    return res
  }

  // 启用/禁用API密钥
  const toggleApiKeyStatus = async (id: number, status: number) => {
    return updateApiKey(id, { status })
  }

  return {
    loading,
    apiKeys,
    total,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleApiKeyStatus
  }
}
