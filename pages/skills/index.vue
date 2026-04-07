<template>
  <div class="skills-page min-h-screen pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3">
        <!-- Back & Title -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <button 
              @click="$router.back()"
              class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
            >
              <span class="text-xl">←</span>
            </button>
            <h1 class="text-lg font-bold text-cyber-text ml-2">发现 SKILL</h1>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索 SKILL..."
            class="cyber-input pl-10 pr-10"
            @input="handleSearch"
          />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted">🔍</span>
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-primary"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <CategoryFilter
        :categories="skillStore.categories"
        v-model:selected-category="selectedCategory"
        :show-sort="true"
        v-model:selected-sort="selectedSort"
        @update:selected-sort="handleSortChange"
      />
    </div>

    <!-- Results Info -->
    <div class="px-4 py-3 text-sm text-cyber-muted">
      共找到 <span class="text-cyber-primary font-bold">{{ totalCount }}</span> 个 SKILL
    </div>

    <!-- Skills List -->
    <div class="px-4">
      <SkillList
        :skills="filteredAndSortedSkills"
        :loading="skillStore.loading"
        :has-more="hasMore"
        :loading-more="loadingMore"
        @skill-click="goToDetail"
        @load-more="loadMore"
        @retry="retry"
      />
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50">
      <div class="flex justify-around py-2">
        <NuxtLink to="/" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🏠</span>
          <span class="text-xs mt-1">首页</span>
        </NuxtLink>
        <NuxtLink to="/skills" class="flex flex-col items-center p-2 text-cyber-primary">
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
        <NuxtLink to="/profile" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">👤</span>
          <span class="text-xs mt-1">我的</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useSkillStore } from '~/stores/skill'
import { useCartStore } from '~/stores/cart'
import type { Skill } from '~/stores/skill'

const route = useRoute()
const skillStore = useSkillStore()
const cartStore = useCartStore()

// State
const searchQuery = ref((route.query.keyword as string) || '')
const selectedCategory = ref((route.query.category as string) || 'all')
const selectedSort = ref((route.query.sort as string) || 'default')
const loadingMore = ref(false)
const currentPage = ref(1)
const pageSize = 30

// Fetch data
onMounted(async () => {
  await skillStore.fetchCategories()
  await fetchSkills()
  cartStore.loadFromLocalStorage()
})

// Watch for route changes
watch(() => route.query, (query) => {
  if (query.keyword) searchQuery.value = query.keyword as string
  if (query.category) selectedCategory.value = query.category as string
  if (query.sort) selectedSort.value = query.sort as string
})

// Watch for filter changes
watch([selectedCategory, selectedSort, searchQuery], () => {
  currentPage.value = 1
  fetchSkills()
})

// Computed
const filteredAndSortedSkills = computed(() => {
  let skills = [...skillStore.skills]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    skills = skills.filter(s => s.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    skills = skills.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.features.some(f => f.toLowerCase().includes(query))
    )
  }

  // Sort
  switch (selectedSort.value) {
    case 'sales':
      skills.sort((a, b) => b.salesCount - a.salesCount)
      break
    case 'rating':
      skills.sort((a, b) => b.rating - a.rating)
      break
    case 'price':
      skills.sort((a, b) => a.price - b.price)
      break
    default:
      // Default order (featured first, then by sales)
      skills.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return b.salesCount - a.salesCount
      })
  }

  return skills
})

const totalCount = computed(() => filteredAndSortedSkills.value.length)

const hasMore = computed(() => {
  return filteredAndSortedSkills.value.length >= currentPage.value * pageSize
})

// Methods
const fetchSkills = async () => {
  await skillStore.fetchSkills({
    page: 1,
    pageSize: pageSize * 3 // Load more initially
  })
}

const loadMore = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  currentPage.value++
  
  try {
    await skillStore.fetchSkills({
      page: currentPage.value,
      pageSize: pageSize
    })
  } finally {
    loadingMore.value = false
  }
}

const handleSearch = useDebounceFn(() => {
  currentPage.value = 1
}, 500)

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleSortChange = (sort: string) => {
  selectedSort.value = sort
}

const retry = () => {
  fetchSkills()
}

const goToDetail = (skill: Skill) => {
  navigateTo(`/skills/${skill.id}`)
}

// SEO
useHead({
  title: '发现 SKILL - COCO CLAW'
})
</script>
