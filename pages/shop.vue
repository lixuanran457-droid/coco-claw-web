<template>
  <div class="min-h-screen pb-16 bg-gray-900">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="text-lg font-bold text-white">商品中心</div>
        <div class="flex items-center space-x-3">
          <button class="p-2 text-gray-400">
            <span class="text-xl">🔔</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="px-4 py-3 bg-gray-900">
      <div class="bg-gray-800 rounded-xl px-4 py-3 flex items-center border border-gray-700">
        <span class="text-gray-500 mr-2">🔍</span>
        <input 
          v-model="searchKeyword"
          type="text" 
          placeholder="搜索 TOKEN 套餐..." 
          class="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500"
        />
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="px-4 py-3 bg-gray-900">
      <div class="flex space-x-3 overflow-x-auto pb-2">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            activeTab === tab.id 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>

    <!-- 排序 -->
    <div class="px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          共 {{ filteredPackages.length }} 个商品
        </div>
        <div class="flex items-center">
          <span class="text-sm text-gray-500 mr-1">排序:</span>
          <select 
            v-model="sortBy" 
            class="text-sm text-gray-300 bg-transparent outline-none"
          >
            <option value="default">默认</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
            <option value="sales">销量优先</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="px-4 py-3">
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="pkg in filteredPackages" 
          :key="pkg.id"
          class="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
          @click="goToDetail(pkg.id)"
        >
          <div class="relative">
            <div class="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <span class="text-6xl">{{ pkg.icon }}</span>
            </div>
            <div v-if="pkg.tag" class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
              {{ pkg.tag }}
            </div>
          </div>
          <div class="p-3">
            <div class="text-sm font-medium text-white mb-1">{{ pkg.name }}</div>
            <div class="text-xs text-gray-400 mb-2 line-clamp-2">{{ pkg.description }}</div>
            <div class="flex items-baseline mb-2">
              <span class="text-lg font-bold text-orange-400">¥{{ pkg.price }}</span>
              <span class="text-xs text-gray-500 line-through ml-1" v-if="pkg.originalPrice > pkg.price">
                ¥{{ pkg.originalPrice }}
              </span>
            </div>
            <div class="flex items-center text-xs text-gray-500">
              <span>销量 {{ pkg.sales || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center py-6">
        <van-loading v-if="loading" type="spinner">加载中...</van-loading>
        <button v-else @click="loadMore" class="text-orange-400 text-sm">
          加载更多
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPackages.length === 0 && !loading" class="text-center py-20">
        <div class="text-5xl mb-4">🔍</div>
        <div class="text-gray-500">未找到相关商品</div>
      </div>
    </div>

    <!-- 底部间距 -->
    <div class="h-20"></div>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 safe-area-bottom">
      <div class="flex justify-around py-2">
        <div 
          v-for="item in navItems" 
          :key="item.path"
          class="flex flex-col items-center p-2"
          :class="item.path === '/shop' ? 'text-orange-400' : 'text-gray-500'"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-xs mt-1">{{ item.name }}</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const activeTab = ref('all')
const sortBy = ref('default')
const loading = ref(false)
const hasMore = ref(true)

// 分类标签
const tabs = [
  { id: 'all', name: '全部' },
  { id: 'api', name: 'API' },
  { id: 'chat', name: '对话' },
  { id: 'ai', name: 'AI对话' },
  { id: 'image', name: '图像' }
]

// 商品数据
const allPackages = ref([
  { id: 1, name: '体验版', icon: '🌱', description: '适合新手试用，每日100次调用', price: 9.9, originalPrice: 19.9, tag: '新人', category: 'all', sales: 1234 },
  { id: 2, name: '月卡', icon: '🌟', description: '性价比之选，每日1000次调用', price: 49, originalPrice: 79, tag: '推荐', category: 'all', sales: 5678 },
  { id: 3, name: '季卡', icon: '🚀', description: '进阶用户推荐，每日1500次调用', price: 129, originalPrice: 199, tag: '热门', category: 'all', sales: 2345 },
  { id: 4, name: '年卡', icon: '👑', description: '长期用户首选，每日2000次调用', price: 399, originalPrice: 599, tag: '', category: 'all', sales: 890 },
  { id: 5, name: 'API 基础版', icon: '🔌', description: '基础 API 调用，适合个人使用', price: 29, originalPrice: 49, tag: '', category: 'api', sales: 456 },
  { id: 6, name: 'API 专业版', icon: '⚡', description: '高级 API 调用，适合企业使用', price: 99, originalPrice: 149, tag: '', category: 'api', sales: 789 },
  { id: 7, name: 'API 企业版', icon: '🏢', description: '企业级 API 支持，不限量', price: 299, originalPrice: 499, tag: '', category: 'api', sales: 234 },
  { id: 8, name: '对话套餐', icon: '💬', description: '智能对话，每日500次', price: 19.9, originalPrice: 39, tag: '', category: 'chat', sales: 3456 },
  { id: 9, name: 'AI 助手', icon: '🤖', description: 'AI 智能助手，GPT-4 支持', price: 39, originalPrice: 69, tag: '', category: 'ai', sales: 4567 },
  { id: 10, name: 'AI 高级版', icon: '🧠', description: '高级 AI 功能，支持多模态', price: 79, originalPrice: 129, tag: '', category: 'ai', sales: 1234 },
  { id: 11, name: '图像生成', icon: '🎨', description: 'AI 图像生成，Midjourney 同款', price: 59, originalPrice: 99, tag: '', category: 'image', sales: 2345 },
  { id: 12, name: '图像增强', icon: '✨', description: '图片清晰度提升，修复老照片', price: 29, originalPrice: 49, tag: '', category: 'image', sales: 1234 }
])

const filteredPackages = computed(() => {
  let result = [...allPackages.value]
  
  if (activeTab.value !== 'all') {
    result = result.filter(pkg => pkg.category === activeTab.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(pkg => 
      pkg.name.toLowerCase().includes(keyword) ||
      pkg.description.toLowerCase().includes(keyword)
    )
  }
  
  switch (sortBy.value) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break
    case 'price_desc': result.sort((a, b) => b.price - a.price); break
    case 'sales': result.sort((a, b) => (b.sales || 0) - (a.sales || 0)); break
  }
  
  return result
})

const goToDetail = (id: number) => navigateTo(`/shop/${id}`)

const loadMore = () => {
  loading.value = true
  setTimeout(() => { hasMore.value = false; loading.value = false }, 1000)
}

const navItems = [
  { name: '首页', icon: '🏠', path: '/' },
  { name: '学弟', icon: '📦', path: '/shop' },
  { name: '学习', icon: '📖', path: '/learn' },
  { name: '我的', icon: '👤', path: '/profile' }
]

useHead({ title: '商品中心 - COCO CLAW' })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
