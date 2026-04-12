<template>
  <div class="min-h-screen pb-20">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">我的</h1>
          <p class="text-gray-400 text-sm mt-1">管理账户信息</p>
        </div>
        <button 
          v-if="isLoggedIn"
          @click="handleLogout"
          class="text-gray-400 text-sm bg-gray-700/50 px-3 py-1 rounded-lg"
        >
          退出
        </button>
      </div>
    </div>

    <!-- 未登录 -->
    <div v-if="!isLoggedIn" class="mx-3 -mt-4 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div class="text-center">
        <div class="text-5xl mb-4">👤</div>
        <div class="text-white font-medium mb-4">未登录</div>
        <div class="text-gray-400 text-sm mb-4">登录后可查看订单、管理API等</div>
        <NuxtLink to="/login">
          <van-button type="primary" block>立即登录</van-button>
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- 用户信息卡片 -->
      <div class="mx-3 -mt-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
            {{ userInfo.avatar || '👤' }}
          </div>
          <div class="ml-4 flex-1">
            <div class="text-white font-bold text-lg">{{ userInfo.nickname || userInfo.username }}</div>
            <div class="text-gray-400 text-sm mt-1">{{ userInfo.email || '未设置邮箱' }}</div>
          </div>
          <NuxtLink to="/profile/edit" class="text-blue-400">
            <span class="text-2xl">✏️</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="mx-3 mt-4">
        <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <NuxtLink 
            v-for="(item, index) in menuItems" 
            :key="item.path"
            :to="item.path"
            class="flex items-center justify-between p-4 border-b border-gray-700/30 last:border-b-0"
          >
            <div class="flex items-center">
              <span class="text-xl mr-3">{{ item.icon }}</span>
              <span class="text-white">{{ item.name }}</span>
            </div>
            <span class="text-gray-500">→</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 资源统计 -->
      <div class="mx-3 mt-4">
        <h3 class="text-white font-semibold mb-3">我的资源</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div class="text-2xl font-bold text-blue-400">{{ myResources.activePlans }}</div>
            <div class="text-gray-400 text-xs mt-1">有效套餐</div>
          </div>
          <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div class="text-2xl font-bold text-green-400">${{ myResources.balance }}</div>
            <div class="text-gray-400 text-xs mt-1">账户余额</div>
          </div>
        </div>
      </div>

      <!-- 帮助与设置 -->
      <div class="mx-3 mt-6">
        <h3 class="text-white font-semibold mb-3">帮助与支持</h3>
        <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <div 
            v-for="(item, index) in helpItems" 
            :key="index"
            class="flex items-center justify-between p-4 border-b border-gray-700/30 last:border-b-0 cursor-pointer"
            @click="item.action && item.action()"
          >
            <div class="flex items-center">
              <span class="text-xl mr-3">{{ item.icon }}</span>
              <span class="text-white">{{ item.name }}</span>
            </div>
            <span class="text-gray-500">→</span>
          </div>
        </div>
      </div>

      <!-- 版本信息 -->
      <div class="mx-3 mt-6 text-center">
        <div class="text-gray-500 text-xs">COCO CLAW v1.0.0</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const isLoggedIn = ref(false)
const userInfo = ref({})
const myResources = ref({
  activePlans: 0,
  balance: 0
})

const menuItems = [
  { name: '我的订单', icon: '📋', path: '/orders' },
  { name: '我的 API', icon: '🔑', path: '/my-api' },
  { name: '充值记录', icon: '💰', path: '/orders?type=recharge' },
  { name: '兑换码', icon: '🎫', path: '/my-api' }
]

const helpItems = [
  { name: '使用文档', icon: '📖', action: () => showToast('文档开发中') },
  { name: '联系客服', icon: '🎧', action: () => showToast('客服开发中') },
  { name: '关于我们', icon: 'ℹ️', action: () => showToast('关于开发中') },
  { name: '隐私政策', icon: '🔒', path: '/privacy' }
]

onMounted(() => {
  const userData = localStorage.getItem('userInfo')
  if (userData) {
    isLoggedIn.value = true
    try {
      userInfo.value = JSON.parse(userData)
    } catch {
      userInfo.value = {}
    }
  }
  
  // 加载资源统计
  loadResources()
})

const loadResources = async () => {
  // TODO: 从API获取
  myResources.value = {
    activePlans: 1,
    balance: 12.5
  }
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  isLoggedIn.value = false
  userInfo.value = {}
  showToast('已退出登录')
  router.push('/')
}

useHead({
  title: '我的 - COCO CLAW'
})
</script>
