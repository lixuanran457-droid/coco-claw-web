<template>
  <div class="min-h-screen pb-16 bg-gray-900">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
            <span class="text-white text-xl font-bold">C</span>
          </div>
          <div>
            <div class="text-lg font-bold text-white">COCO CLAW</div>
            <div class="text-xs text-gray-400">真正便宜的 TOKEN</div>
          </div>
        </div>
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
          type="text" 
          placeholder="搜索 TOKEN 套餐..." 
          class="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500"
        />
      </div>
    </div>

    <!-- 轮播 Banner -->
    <div class="px-4 py-3" v-if="banners.length > 0">
      <div class="overflow-hidden rounded-2xl">
        <van-swipe :autoplay="3000" indicator-color="white" class="banner-swipe">
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <img :src="banner.imageUrl" :alt="'Banner'" class="w-full h-32 object-cover rounded-2xl" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <!-- 默认 Banner -->
    <div class="px-4 py-3" v-else>
      <div class="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white">
        <div class="text-2xl font-bold mb-2">🎉 新用户专享</div>
        <div class="text-white/80 text-sm mb-3">首充满 50 元送 10 元</div>
        <div class="bg-white/20 rounded-lg px-3 py-1 text-sm inline-block">
          立即充值 →
        </div>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="px-4 py-4">
      <div class="grid grid-cols-4 gap-3">
        <div v-for="item in features" :key="item.name" class="text-center">
          <div class="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-gray-700">
            <span class="text-2xl">{{ item.icon }}</span>
          </div>
          <div class="text-xs text-gray-400">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- 精选推荐 -->
    <div class="px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <div class="text-lg font-bold text-white">精选推荐</div>
        <div class="text-sm text-gray-500">查看更多 →</div>
      </div>
      
      <!-- 横向滑动卡片 -->
      <div class="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide">
        <div 
          v-for="pkg in recommendedPackages" 
          :key="pkg.id"
          class="flex-shrink-0 w-36 bg-gray-800 rounded-2xl p-3 border border-gray-700"
        >
          <div class="text-center">
            <div class="text-3xl mb-2">{{ pkg.icon }}</div>
            <div class="text-sm font-medium text-white">{{ pkg.name }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ pkg.subtitle }}</div>
            <div class="mt-2 text-lg font-bold text-orange-400">¥{{ pkg.price }}</div>
            <div class="text-xs text-gray-500 line-through" v-if="pkg.originalPrice > pkg.price">
              ¥{{ pkg.originalPrice }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品分类 -->
    <div class="px-4 py-3">
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

    <!-- 商品列表 -->
    <div class="px-4 py-3">
      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="pkg in filteredPackages" 
          :key="pkg.id"
          class="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700"
        >
          <div class="relative">
            <div class="h-28 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <span class="text-5xl">{{ pkg.icon }}</span>
            </div>
            <div v-if="pkg.tag" class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
              {{ pkg.tag }}
            </div>
          </div>
          <div class="p-3">
            <div class="text-sm font-medium text-white mb-1">{{ pkg.name }}</div>
            <div class="text-xs text-gray-400 mb-2">{{ pkg.description }}</div>
            <div class="flex items-baseline">
              <span class="text-lg font-bold text-orange-400">¥{{ pkg.price }}</span>
              <span class="text-xs text-gray-500 line-through ml-1" v-if="pkg.originalPrice > pkg.price">
                ¥{{ pkg.originalPrice }}
              </span>
            </div>
          </div>
        </div>
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
          :class="currentPath === item.path ? 'text-orange-400' : 'text-gray-500'"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="text-xs mt-1">{{ item.name }}</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useConfig } from '~/composables/useConfig'

const currentPath = ref('/')
const config = useConfig()

// 系统参数
const systemParams = ref({
  APP_NAME: 'COCO CLAW',
  APP_SLOGAN: '真正便宜的 TOKEN'
})

// Banner 数据 - 从API或默认值
const banners = ref<Array<{
  id: number
  title: string
  imageUrl: string
}>>([])

// 功能入口 - 从API或默认值
const features = ref([
  { name: '充值中心', icon: '💎' },
  { name: '套餐购买', icon: '📦' },
  { name: '使用教程', icon: '📱' },
  { name: '在线客服', icon: '💁' }
])

// 精选推荐 - 从API或默认值
const recommendedPackages = ref([
  { id: 1, name: '月卡', icon: '🌟', subtitle: '1000次/天', price: 49, originalPrice: 79 },
  { id: 2, name: '季卡', icon: '🚀', subtitle: '1500次/天', price: 129, originalPrice: 199 },
  { id: 3, name: '年卡', icon: '👑', subtitle: '2000次/天', price: 399, originalPrice: 599 },
  { id: 4, name: '体验卡', icon: '🌱', subtitle: '100次/天', price: 9.9, originalPrice: 19.9 }
])

// 分类标签 - 从API或默认值
const tabs = ref([
  { id: 'all', name: '全部' },
  { id: 'api', name: 'API' },
  { id: 'chat', name: '对话' },
  { id: 'ai', name: 'AI对话' },
  { id: 'image', name: '图像' }
])

// 商品列表 - 从API或默认值
const allPackages = ref([
  { id: 1, name: '体验版', icon: '🌱', description: '适合新手试用', price: 9.9, originalPrice: 19.9, tag: '新人', category: 'all' },
  { id: 2, name: '月卡', icon: '🌟', description: '性价比之选', price: 49, originalPrice: 79, tag: '推荐', category: 'all' },
  { id: 3, name: '季卡', icon: '🚀', description: '进阶用户推荐', price: 129, originalPrice: 199, tag: '热门', category: 'all' },
  { id: 4, name: '年卡', icon: '👑', description: '长期用户首选', price: 399, originalPrice: 599, tag: '', category: 'all' },
  { id: 5, name: 'API 基础版', icon: '🔌', description: '基础 API 调用', price: 29, originalPrice: 49, tag: '', category: 'api' },
  { id: 6, name: 'API 专业版', icon: '⚡', description: '高级 API 调用', price: 99, originalPrice: 149, tag: '', category: 'api' }
])

const activeTab = ref('all')

const filteredPackages = computed(() => {
  if (activeTab.value === 'all') return allPackages.value
  return allPackages.value.filter(pkg => pkg.category === activeTab.value)
})

// 底部导航
const navItems = [
  { name: '首页', icon: '🏠', path: '/' },
  { name: '学弟', icon: '📦', path: '/shop' },
  { name: '学习', icon: '📖', path: '/learn' },
  { name: '我的', icon: '👤', path: '/profile' }
]

// 页面加载时获取配置
onMounted(async () => {
  try {
    // 获取系统参数
    const params = await config.fetchSystemParams()
    if (params) {
      systemParams.value = { ...systemParams.value, ...params }
    }

    // 获取功能入口
    const featureList = await config.fetchFeatures()
    if (featureList && featureList.length > 0) {
      features.value = featureList.map((f: any) => ({
        name: f.name,
        icon: f.icon,
        linkUrl: f.linkUrl
      }))
    }

    // 获取Banner
    const bannerList = await config.fetchBanners()
    if (bannerList && bannerList.length > 0) {
      banners.value = bannerList
    }

    // 获取精选推荐
    const homeConfig = await config.fetchHomeConfig()
    if (homeConfig?.recommendations && homeConfig.recommendations.length > 0) {
      recommendedPackages.value = homeConfig.recommendations.map((r: any) => ({
        id: r.id,
        name: r.title,
        icon: r.icon || '🌟',
        subtitle: r.subtitle || '',
        price: 0,
        originalPrice: 0
      }))
    }
  } catch (error) {
    console.error('加载配置失败，使用默认数据:', error)
  }
})

useHead({ 
  title: `${systemParams.value.APP_NAME} - ${systemParams.value.APP_SLOGAN}` 
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.banner-swipe :deep(.van-swipe__track) { border-radius: 16px; }
</style>
