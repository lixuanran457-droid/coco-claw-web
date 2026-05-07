/**
 * 防重复点击指令
 * 使用方式: <button v-throttle-click="handleClick">点击</button>
 */
export const throttleClick = {
  mounted(el: HTMLElement, binding: any) {
    const wait = typeof binding.value === 'object' ? binding.value.wait || 1000 : 1000
    const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler

    el.addEventListener('click', () => {
      if (el.classList.contains('is-loading') || el.hasAttribute('disabled')) {
        return
      }

      el.classList.add('is-loading')
      el.classList.add('ripple')

      setTimeout(() => {
        el.classList.remove('is-loading')
        el.classList.remove('ripple')
      }, wait)
    }, { passive: true })
  }
}

/**
 * 防抖指令
 */
export const debounce = {
  mounted(el: HTMLElement, binding: any) {
    const wait = binding.arg || 500
    let timer: any = null

    el.addEventListener('input', () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value()
      }, wait)
    }, { passive: true })
  }
}

/**
 * 长按指令
 */
export const longPress = {
  mounted(el: HTMLElement, binding: any) {
    const wait = 500
    let timer: any = null

    const start = (e: Event) => {
      timer = setTimeout(() => {
        binding.value(e)
        el.classList.add('is-long-pressed')
      }, wait)
    }

    const end = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      el.classList.remove('is-long-pressed')
    }

    el.addEventListener('touchstart', start, { passive: true })
    el.addEventListener('touchend', end)
    el.addEventListener('touchcancel', end)
    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', end)
    el.addEventListener('mouseleave', end)
  }
}
