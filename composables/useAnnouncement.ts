// 公告composable
import { ref } from 'vue'

interface Announcement {
  id: number
  title: string
  content: string
  type: number
  typeName: string
  priority: number
  priorityName: string
  coverImage?: string
  linkUrl?: string
  startTime?: string
  endTime?: string
  pinned: boolean
  popup: boolean
  viewCount: number
  createTime: string
}

export const useAnnouncement = () => {
  const announcements = ref<Announcement[]>([])
  const popupAnnouncement = ref<Announcement | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAnnouncements = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      if (data.code === 200) {
        announcements.value = data.data
      } else {
        error.value = data.message
      }
    } catch (e) {
      error.value = '获取公告失败'
    } finally {
      loading.value = false
    }
  }

  const fetchPopupAnnouncement = async () => {
    try {
      const res = await fetch('/api/announcements/popup')
      const data = await res.json()
      if (data.code === 200 && data.data) {
        popupAnnouncement.value = data.data
      }
    } catch (e) {
      console.error('获取弹窗公告失败', e)
    }
  }

  const closePopup = () => {
    popupAnnouncement.value = null
    // 可以存储到localStorage标记已读
    if (popupAnnouncement.value) {
      localStorage.setItem(`popup_${popupAnnouncement.value.id}`, 'true')
    }
  }

  return {
    announcements,
    popupAnnouncement,
    loading,
    error,
    fetchAnnouncements,
    fetchPopupAnnouncement,
    closePopup,
  }
}
