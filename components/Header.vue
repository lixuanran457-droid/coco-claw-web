<template>
  <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
    <div class="px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo & Title -->
        <NuxtLink to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
            💎
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">COCO CLAW</h1>
            <p class="text-xs text-gray-400">真正便宜的 TOKEN</p>
          </div>
        </NuxtLink>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- User -->
          <NuxtLink 
            v-if="isLoggedIn" 
            to="/profile"
            class="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg"
          >
            <span class="text-lg">👤</span>
            <span class="text-sm text-gray-300">{{ userName }}</span>
          </NuxtLink>
          
          <!-- Login Button -->
          <NuxtLink 
            v-else 
            to="/login"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            登录
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const userName = ref('')

onMounted(() => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      isLoggedIn.value = true
      userName.value = user.nickname || user.username || '用户'
    } catch {
      isLoggedIn.value = false
    }
  }
})
</script>
