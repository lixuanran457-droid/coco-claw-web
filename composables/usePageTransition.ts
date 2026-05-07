import { ref } from 'vue'

/**
 * 页面过渡动画 composable
 * 使用方式:
 * const { isTransitioning, startTransition, endTransition } = usePageTransition()
 */
export function usePageTransition() {
  const isTransitioning = ref(false)
  const transitionName = ref('fade')

  const transitionNames = [
    'fade',
    'slide-left',
    'slide-right',
    'slide-up',
    'zoom',
    'slide-fade'
  ]

  const setTransitionName = (name: string) => {
    if (transitionNames.includes(name)) {
      transitionName.value = name
    }
  }

  const startTransition = () => {
    isTransitioning.value = true
  }

  const endTransition = () => {
    isTransitioning.value = false
  }

  return {
    isTransitioning,
    transitionName,
    setTransitionName,
    startTransition,
    endTransition,
    transitionNames
  }
}

/**
 * 全局页面过渡样式
 * 将此内容添加到 app.vue 或全局样式中
 */
export const pageTransitionStyles = `
/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Fade 过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide 过渡 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Zoom 过渡 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* 按钮点击波纹效果 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple-effect 0.6s ease-out;
}

@keyframes ripple-effect {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

/* 按钮加载状态 */
button.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

button.is-loading::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* 长按状态 */
.is-long-pressed {
  background: rgba(239, 68, 68, 0.2) !important;
}
`
