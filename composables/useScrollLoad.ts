import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 滚动加载 composable
 * 使用方式:
 * const { isLoading, hasMore, loadMore } = useScrollLoad({
 *   onLoadMore: async () => {
 *     const data = await fetchData(page.value)
 *     items.value.push(...data)
 *   }
 * })
 */
interface UseScrollLoadOptions {
  onLoadMore: () => Promise<void>
  threshold?: number // 距离底部多少像素触发加载
  disabled?: boolean // 是否禁用
}

export function useScrollLoad(options: UseScrollLoadOptions) {
  const { onLoadMore, threshold = 100, disabled = false } = options

  const isLoading = ref(false)
  const hasMore = ref(true)
  const error = ref<string | null>(null)

  let observer: IntersectionObserver | null = null
  let sentinel: HTMLElement | null = null

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value || disabled.value) return

    isLoading.value = true
    error.value = null

    try {
      await onLoadMore()
    } catch (e: any) {
      error.value = e.message || '加载失败'
    } finally {
      isLoading.value = false
    }
  }

  const setHasMore = (value: boolean) => {
    hasMore.value = value
  }

  const reset = () => {
    hasMore.value = true
    error.value = null
  }

  // 设置观察器
  const setSentinel = (el: HTMLElement) => {
    sentinel = el

    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore.value && !isLoading.value && !disabled.value) {
          loadMore()
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`
      }
    )

    if (sentinel) {
      observer.observe(sentinel)
    }
  }

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isLoading,
    hasMore,
    error,
    loadMore,
    setHasMore,
    reset,
    setSentinel
  }
}

/**
 * 滚动到底部检测
 */
export function useScrollBottom(callback: () => void, threshold = 100) {
  const checkScroll = () => {
    const scrollTop = window.scrollY
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = window.innerHeight

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
  })
}

/**
 * 下拉刷新 composable
 */
export function usePullRefresh(onRefresh: () => Promise<void>) {
  const isRefreshing = ref(false)
  const isPulling = ref(false)
  const pullDistance = ref(0)
  const startY = ref(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (isRefreshing.value) return
    if (window.scrollY > 0) return

    startY.value = e.touches[0].clientY
    isPulling.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.value || isRefreshing.value) return
    if (window.scrollY > 0) {
      isPulling.value = false
      return
    }

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.value)
    pullDistance.value = Math.min(distance, 80)

    if (pullDistance.value > 50) {
      // 触发刷新的阈值
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling.value) return

    if (pullDistance.value > 50) {
      isRefreshing.value = true
      try {
        await onRefresh()
      } finally {
        isRefreshing.value = false
      }
    }

    isPulling.value = false
    pullDistance.value = 0
  }

  return {
    isRefreshing,
    isPulling,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
