<template>
  <div class="skill-detail-page min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">SKILL 详情</h1>
        <button class="p-2 -mr-2 rounded-lg hover:bg-cyber-card transition-colors">
          <span class="text-xl">分享</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="skillStore.loading" class="p-4 space-y-4 animate-pulse">
      <div class="w-32 h-32 mx-auto rounded-2xl bg-cyber-border"></div>
      <div class="h-8 bg-cyber-border rounded w-1/2 mx-auto"></div>
      <div class="h-4 bg-cyber-border rounded w-3/4 mx-auto"></div>
    </div>

    <!-- Content -->
    <div v-else-if="skill">
      <!-- Hero Section -->
      <section class="relative px-4 py-8 text-center overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-cyber-gradient opacity-10 blur-3xl"></div>
        
        <div class="relative">
          <!-- Icon -->
          <div class="w-32 h-32 mx-auto mb-4 rounded-2xl bg-cyber-gradient flex items-center justify-center text-6xl shadow-cyber-lg animate-float">
            {{ skill.icon }}
          </div>

          <!-- Name -->
          <h2 class="text-2xl font-bold text-cyber-text mb-2">{{ skill.name }}</h2>

          <!-- Author & Platform -->
          <div class="flex items-center justify-center gap-4 text-sm text-cyber-muted mb-4">
            <span>👤 {{ skill.author }}</span>
            <span>🌐 {{ skill.platform }}</span>
            <span>📅 {{ skill.updateTime }}</span>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-center gap-6 text-sm">
            <div class="flex items-center">
              <span class="text-yellow-400 mr-1">⭐</span>
              <span class="font-bold text-cyber-text">{{ skill.rating.toFixed(1) }}</span>
              <span class="text-cyber-muted ml-1">({{ skill.reviewCount }})</span>
            </div>
            <div class="text-cyber-muted">
              📦 销量 {{ formatNumber(skill.salesCount) }}
            </div>
          </div>
        </div>
      </section>

      <!-- Price Section -->
      <section class="px-4 mb-6">
        <div class="cyber-card p-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-3xl font-bold text-cyber-primary">¥{{ skill.price }}</span>
              <span 
                v-if="skill.originalPrice && skill.originalPrice > skill.price"
                class="ml-2 text-lg text-cyber-muted line-through"
              >
                ¥{{ skill.originalPrice }}
              </span>
            </div>
            
            <!-- Safety Level -->
            <div 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="safetyLevelClass"
            >
              {{ safetyLevelIcon }} {{ safetyLevelText }}
            </div>
          </div>

          <!-- Discount Badge -->
          <div 
            v-if="skill.originalPrice && skill.originalPrice > skill.price"
            class="mt-3 flex items-center"
          >
            <span class="cyber-tag bg-red-500/20 text-red-400 border-red-500/30">
              🎉 省 ¥{{ skill.originalPrice - skill.price }}
            </span>
          </div>
        </div>
      </section>

      <!-- Description -->
      <section class="px-4 mb-6">
        <div class="cyber-card p-4">
          <h3 class="text-lg font-bold text-cyber-text mb-3 flex items-center">
            <span class="mr-2">📝</span>
            描述
          </h3>
          <p class="text-cyber-muted leading-relaxed">
            {{ skill.description }}
          </p>
        </div>
      </section>

      <!-- Features -->
      <section class="px-4 mb-6">
        <div class="cyber-card p-4">
          <h3 class="text-lg font-bold text-cyber-text mb-4 flex items-center">
            <span class="mr-2">✨</span>
            功能特点
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div 
              v-for="(feature, index) in skill.features"
              :key="index"
              class="flex items-start p-3 rounded-lg bg-cyber-darker/50"
            >
              <span class="text-cyber-primary mr-2">✓</span>
              <span class="text-sm text-cyber-text">{{ feature }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category -->
      <section class="px-4 mb-6">
        <div class="cyber-card p-4">
          <h3 class="text-lg font-bold text-cyber-text mb-3 flex items-center">
            <span class="mr-2">🏷️</span>
            分类
          </h3>
          <div class="flex items-center">
            <span class="cyber-tag">
              {{ getCategoryIcon(skill.category) }} {{ getCategoryName(skill.category) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Reviews Preview -->
      <section class="px-4 mb-6">
        <div class="cyber-card p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-cyber-text flex items-center">
              <span class="mr-2">💬</span>
              用户评价
            </h3>
            <span class="text-sm text-cyber-primary">查看全部 →</span>
          </div>
          
          <!-- Mock Reviews -->
          <div class="space-y-4">
            <div class="p-3 rounded-lg bg-cyber-darker/50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full bg-cyber-secondary/30 flex items-center justify-center text-xs mr-2">👤</div>
                  <span class="text-sm text-cyber-text">用户123</span>
                </div>
                <div class="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
              </div>
              <p class="text-sm text-cyber-muted">非常好用的工具，帮我省了很多时间！强烈推荐！</p>
            </div>
            
            <div class="p-3 rounded-lg bg-cyber-darker/50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-6 h-6 rounded-full bg-cyber-primary/30 flex items-center justify-center text-xs mr-2">👤</div>
                  <span class="text-sm text-cyber-text">效率达人</span>
                </div>
                <div class="text-yellow-400 text-sm">⭐⭐⭐⭐</div>
              </div>
              <p class="text-sm text-cyber-muted">功能强大，操作简单，就是价格稍微贵了点。</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <span class="text-6xl mb-4">😢</span>
      <p class="text-cyber-muted mb-4">未找到该 SKILL</p>
      <NuxtLink to="/skills">
        <button class="cyber-btn-outline">返回列表</button>
      </NuxtLink>
    </div>

    <!-- Fixed Bottom Action -->
    <div 
      v-if="skill"
      class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border p-4 safe-area-bottom z-50"
    >
      <div class="flex gap-3">
        <button 
          class="flex-1 cyber-btn-outline flex items-center justify-center"
          :class="{ 'opacity-50 cursor-not-allowed': isInCart }"
          :disabled="isInCart"
          @click="handleAddToCart"
        >
          <span class="mr-2">{{ isInCart ? '✓' : '🛒' }}</span>
          {{ isInCart ? '已加入' : '加入购物车' }}
        </button>
        <button class="flex-1 cyber-btn" @click="handleBuyNow">
          <span class="mr-2">⚡</span>
          立即购买
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSkillStore } from '~/stores/skill'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const skillStore = useSkillStore()
const cartStore = useCartStore()

const skillId = computed(() => route.params.id as string)

// Fetch data
onMounted(async () => {
  await skillStore.fetchSkillById(skillId.value)
  cartStore.loadFromLocalStorage()
})

watch(skillId, async (newId) => {
  if (newId) {
    await skillStore.fetchSkillById(newId)
  }
})

// Computed
const skill = computed(() => skillStore.currentSkill)

const isInCart = computed(() => {
  if (!skill.value) return false
  return cartStore.isInCart(skill.value.id)
})

const safetyLevelClass = computed(() => {
  switch (skill.value?.safetyLevel) {
    case 'high':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case 'low':
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
})

const safetyLevelIcon = computed(() => {
  switch (skill.value?.safetyLevel) {
    case 'high':
      return '🛡️'
    case 'medium':
      return '⚠️'
    case 'low':
      return '⚠️'
    default:
      return '❓'
  }
})

const safetyLevelText = computed(() => {
  switch (skill.value?.safetyLevel) {
    case 'high':
      return '高度安全'
    case 'medium':
      return '注意使用'
    case 'low':
      return '存在风险'
    default:
      return '未知'
  }
})

// Methods
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    productivity: '⚡',
    automation: '🤖',
    data: '📊',
    security: '🛡️',
    media: '🎬',
    shopping: '🛍️',
    design: '🎨'
  }
  return icons[category] || '📦'
}

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    productivity: '效率工具',
    automation: '自动化',
    data: '数据处理',
    security: '安全防护',
    media: '媒体工具',
    shopping: '购物助手',
    design: '设计工具'
  }
  return names[category] || category
}

const handleAddToCart = () => {
  if (!skill.value || isInCart.value) return
  
  cartStore.addToCart(skill.value, 1)
  cartStore.saveToLocalStorage()
  
  // Show feedback (could use a toast library)
  alert('已加入购物车')
}

const handleBuyNow = () => {
  if (!skill.value) return
  
  if (!isInCart.value) {
    cartStore.addToCart(skill.value, 1)
    cartStore.saveToLocalStorage()
  }
  
  navigateTo('/cart')
}

// SEO
useHead({
  title: computed(() => skill.value ? `${skill.value.name} - COCO CLAW` : 'SKILL 详情 - COCO CLAW')
})
</script>
