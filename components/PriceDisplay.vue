/**
 * 价格显示组件
 * 使用配置的货币符号显示价格
 */
<template>
  <span class="price-display">
    <span class="currency-symbol">{{ currencySymbol }}</span>
    <span class="price-value">{{ formattedPrice }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  price: number
  originalPrice?: number
  size?: 'small' | 'medium' | 'large'
  showOriginal?: boolean
}>()

const currencySymbol = ref('¥')

// 格式化价格
const formattedPrice = computed(() => {
  return props.price.toFixed(2)
})

// 获取货币符号配置
const fetchCurrencySymbol = async () => {
  try {
    const response = await fetch('/api/config/currency')
    const result = await response.json()
    if (result.code === 200 && result.data) {
      currencySymbol.value = result.data
    }
  } catch (error) {
    console.error('获取货币符号失败:', error)
    // 使用默认值
  }
}

onMounted(() => {
  fetchCurrencySymbol()
})
</script>

<style scoped>
.price-display {
  display: inline-flex;
  align-items: baseline;
}

.currency-symbol {
  font-size: 0.75em;
  font-weight: 500;
  margin-right: 1px;
}

.price-value {
  font-weight: 700;
}

/* 小号 */
.price-display.size-small .price-value {
  font-size: 0.875rem;
}

/* 中号 */
.price-display.size-medium .price-value {
  font-size: 1rem;
}

/* 大号 */
.price-display.size-large .price-value {
  font-size: 1.25rem;
}
</style>
