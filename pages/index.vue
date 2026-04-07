<template>
  <div class="home-page min-h-screen pb-20">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <section class="relative px-4 py-6 overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute inset-0 bg-cyber-gradient opacity-10 blur-3xl"></div>
      
      <div class="relative">
        <h2 class="cyber-title text-2xl mb-2">
          🚀 发现 SKILL
        </h2>
        <p class="text-cyber-muted text-sm">
          探索最实用的工具，提升你的效率
        </p>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="px-4 mb-6">
      <div class="cyber-card p-4">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-xl font-bold text-cyber-primary">{{ formatNumber(stats?.totalSkills || 156) }}</div>
            <div class="text-xs text-cyber-muted">SKILL总数</div>
          </div>
          <div>
            <div class="text-xl font-bold text-cyber-secondary">{{ stats?.totalPlatforms || 12 }}</div>
            <div class="text-xs text-cyber-muted">支持平台</div>
          </div>
          <div>
            <div class="text-xl font-bold text-cyber-accent">{{ formatNumber(stats?.totalUsers || 24580) }}</div>
            <div class="text-xs text-cyber-muted">用户数</div>
          </div>
          <div>
            <div class="text-xl font-bold text-green-400">{{ formatNumber(stats?.totalOrders || 89342) }}</div>
            <div class="text-xs text-cyber-muted">订单数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="mb-6">
      <CategoryFilter
        :categories="skillStore.categories"
        v-model:selected-category="selectedCategory"
      />
    </section>

    <!-- Top Skills Section -->
    <section class="px-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-cyber-text flex items-center">
          <span class="mr-2">🏆</span>
          精选榜单
        </h3>
        <NuxtLink to="/skills" class="text-sm text-cyber-primary hover:text-cyber-secondary transition-colors">
          查看更多 →
        </NuxtLink>
      </div>

      <!-- Top 4 Skills -->
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="skill in topSkills"
          :key="skill.id"
          class="relative"
        >
          <SkillCard :skill="skill" @click="goToDetail(skill.id)" />
        </div>
      </div>
    </section>

    <!-- Featured Skills -->
    <section class="px-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-cyber-text flex items-center">
          <span class="mr-2">⭐</span>
          热门推荐
        </h3>
      </div>

      <SkillList
        :skills="featuredSkills"
        :loading="skillStore.loading"
        @skill-click="goToDetail"
      />
    </section>

    <!-- All Skills -->
    <section class="px-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-cyber-text flex items-center">
          <span class="mr-2">🛒</span>
          全部 SKILL
        </h3>
      </div>

      <SkillList
        :skills="filteredSkills"
        :loading="skillStore.loading"
        @skill-click="goToDetail"
      />
    </section>

    <!-- View More Button -->
    <section class="px-4 py-6">
      <NuxtLink to="/skills" class="block">
        <button class="cyber-btn w-full">
          查看更多 SKILL
        </button>
      </NuxtLink>
    </section>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50">
      <div class="flex justify-around py-2">
        <NuxtLink to="/" class="flex flex-col items-center p-2 text-cyber-primary">
          <span class="text-xl">🏠</span>
          <span class="text-xs mt-1">首页</span>
        </NuxtLink>
        <NuxtLink to="/skills" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🔍</span>
          <span class="text-xs mt-1">发现</span>
        </NuxtLink>
        <NuxtLink to="/cart" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors relative">
          <span class="text-xl">🛒</span>
          <span class="text-xs mt-1">购物车</span>
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute top-0 right-2 w-5 h-5 rounded-full bg-cyber-accent text-xs font-bold flex items-center justify-center"
          >
            {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
          </span>
        </NuxtLink>
        <NuxtLink to="/order" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">📋</span>
          <span class="text-xs mt-1">订单</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useSkillStore } from '~/stores/skill'
import { useCartStore } from '~/stores/cart'

const skillStore = useSkillStore()
const cartStore = useCartStore()

const selectedCategory = ref('all')

// Fetch initial data
onMounted(async () => {
  await Promise.all([
    skillStore.fetchCategories(),
    skillStore.fetchTopSkills(4),
    skillStore.fetchStats(),
    skillStore.fetchSkills({ pageSize: 30 })
  ])
  
  // Load cart from localStorage
  cartStore.loadFromLocalStorage()
})

// Computed
const stats = computed(() => skillStore.stats)
const topSkills = computed(() => skillStore.topFourSkills)
const featuredSkills = computed(() => skillStore.featuredSkills)

const filteredSkills = computed(() => {
  if (selectedCategory.value === 'all') {
    return skillStore.skills
  }
  return skillStore.skills.filter(s => s.category === selectedCategory.value)
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

const goToDetail = (id: string) => {
  navigateTo(`/skills/${id}`)
}

// SEO
useHead({
  title: 'COCO CLAW - SKILL 交易市场'
})
</script>

<style scoped>
.cyber-title {
  background: linear-gradient(135deg, #00d4ff, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
