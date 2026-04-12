/**
 * 系统配置 - 从后端API获取
 */
export const useConfig = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  // 获取首页配置
  const fetchHomeConfig = async () => {
    try {
      const response = await fetch(`${API_BASE}/config/home`)
      const result = await response.json()
      if (result.code === 200) {
        return result.data
      }
    } catch (error) {
      console.error('获取首页配置失败:', error)
    }
    return null
  }

  // 获取Banner
  const fetchBanners = async () => {
    try {
      const response = await fetch(`${API_BASE}/config/banners`)
      const result = await response.json()
      if (result.code === 200) {
        return result.data
      }
    } catch (error) {
      console.error('获取Banner失败:', error)
    }
    return []
  }

  // 获取功能入口
  const fetchFeatures = async () => {
    try {
      const response = await fetch(`${API_BASE}/config/features`)
      const result = await response.json()
      if (result.code === 200) {
        return result.data
      }
    } catch (error) {
      console.error('获取功能入口失败:', error)
    }
    return []
  }

  // 获取FAQ
  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${API_BASE}/config/faqs`)
      const result = await response.json()
      if (result.code === 200) {
        return result.data
      }
    } catch (error) {
      console.error('获取FAQ失败:', error)
    }
    return []
  }

  // 获取系统参数
  const fetchSystemParams = async () => {
    try {
      const response = await fetch(`${API_BASE}/config/params`)
      const result = await response.json()
      if (result.code === 200) {
        return result.data
      }
    } catch (error) {
      console.error('获取系统参数失败:', error)
    }
    return {}
  }

  return {
    fetchHomeConfig,
    fetchBanners,
    fetchFeatures,
    fetchFaqs,
    fetchSystemParams
  }
}
