/**
 * 第三方账号绑定Composable
 */
import { ref } from 'vue'
import { request } from '@/utils/request'

export interface UserBinding {
  id?: number
  userId?: number
  platform: string // wechat, github, google, apple
  platformUserId: string
  nickname?: string
  avatar?: string
  bindTime?: string
  status: number
}

export function useBinding() {
  const loading = ref(false)
  const bindings = ref<UserBinding[]>([])

  // 获取绑定列表
  const fetchBindings = async () => {
    loading.value = true
    try {
      const res = await request.get<UserBinding[]>('/api/binding/list')
      if (res.code === 0) {
        bindings.value = res.data
      }
      return res
    } finally {
      loading.value = false
    }
  }

  // 发起第三方登录/绑定
  const bindPlatform = async (platform: string) => {
    const res = await request.get<{ url: string }>('/api/binding/auth', {
      params: { platform }
    })
    if (res.code === 0 && res.data.url) {
      window.location.href = res.data.url
    }
    return res
  }

  // 解绑
  const unbindPlatform = async (platform: string) => {
    const res = await request.delete(`/api/binding/${platform}`)
    if (res.code === 0) {
      await fetchBindings()
    }
    return res
  }

  // 绑定回调处理
  const handleCallback = async (platform: string, code: string) => {
    const res = await request.post<UserBinding>('/api/binding/callback', {
      platform,
      code
    })
    if (res.code === 0) {
      await fetchBindings()
    }
    return res
  }

  return {
    loading,
    bindings,
    fetchBindings,
    bindPlatform,
    unbindPlatform,
    handleCallback
  }
}
