<template>
  <div class="address-page min-h-screen pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">收货地址</h1>
        <button 
          @click="goToAddAddress"
          class="p-2 -mr-2 rounded-lg hover:bg-cyber-card transition-colors text-cyber-primary"
        >
          <span class="text-xl">+</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Loading -->
      <div v-if="userStore.loading" class="flex flex-col items-center justify-center py-20">
        <span class="text-5xl animate-spin">⟳</span>
        <p class="text-cyber-muted mt-4">加载中...</p>
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="addresses.length === 0" 
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="text-7xl mb-6">📍</span>
        <h2 class="text-xl font-bold text-cyber-text mb-2">暂无收货地址</h2>
        <p class="text-cyber-muted mb-6">添加收货地址，方便快捷购物</p>
        <button @click="goToAddAddress" class="cyber-btn">
          添加地址
        </button>
      </div>

      <!-- Address List -->
      <div v-else class="space-y-3">
        <div 
          v-for="address in addresses" 
          :key="address.id"
          class="cyber-card p-4 rounded-xl"
        >
          <!-- Address Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-cyber-text">{{ address.name }}</span>
                <span class="text-cyber-muted">{{ address.phone }}</span>
                <span 
                  v-if="address.isDefault"
                  class="px-2 py-0.5 rounded-full bg-cyber-primary/20 text-cyber-primary text-xs"
                >
                  默认
                </span>
                <span 
                  v-if="address.label"
                  class="px-2 py-0.5 rounded-full bg-cyber-secondary/20 text-cyber-secondary text-xs"
                >
                  {{ getLabelName(address.label) }}
                </span>
              </div>
              <p class="text-sm text-cyber-muted">
                {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
              </p>
            </div>
          </div>

          <!-- Address Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-cyber-border">
            <!-- Set Default -->
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                :checked="address.isDefault"
                @change="setDefault(address.id)"
                class="w-4 h-4 accent-cyber-primary"
              />
              <span class="ml-2 text-sm text-cyber-muted">设为默认</span>
            </label>

            <div class="flex items-center gap-4">
              <!-- Edit -->
              <button 
                @click="goToEditAddress(address.id)"
                class="text-sm text-cyber-muted hover:text-cyber-primary transition-colors"
              >
                ✏️ 编辑
              </button>
              <!-- Delete -->
              <button 
                @click="handleDelete(address.id)"
                class="text-sm text-cyber-muted hover:text-cyber-danger transition-colors"
              >
                🗑️ 删除
              </button>
            </div>
          </div>
        </div>

        <!-- Add More -->
        <button 
          @click="goToAddAddress"
          class="w-full py-4 rounded-xl border-2 border-dashed border-cyber-border text-cyber-muted hover:border-cyber-primary hover:text-cyber-primary transition-colors"
        >
          + 添加新地址
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50">
      <div class="flex justify-around py-2">
        <NuxtLink to="/" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🏠</span>
          <span class="text-xs mt-1">首页</span>
        </NuxtLink>
        <NuxtLink to="/skills" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🔍</span>
          <span class="text-xs mt-1">发现</span>
        </NuxtLink>
        <NuxtLink to="/cart" class="flex flex-col items-center p-2 text-cyber-muted hover:text-cyber-primary transition-colors">
          <span class="text-xl">🛒</span>
          <span class="text-xs mt-1">购物车</span>
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
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Get addresses
const addresses = computed(() => userStore.addresses)

// Get label name
const getLabelName = (label: string) => {
  const names: Record<string, string> = {
    home: '家',
    work: '公司',
    other: '其他'
  }
  return names[label] || '其他'
}

// Go to add address
const goToAddAddress = () => {
  navigateTo('/address/edit')
}

// Go to edit address
const goToEditAddress = (id: string) => {
  navigateTo(`/address/edit?id=${id}`)
}

// Set default
const setDefault = async (id: string) => {
  await userStore.setDefaultAddress(id)
}

// Delete address
const handleDelete = async (id: string) => {
  if (confirm('确定要删除该地址吗？')) {
    await userStore.deleteAddress(id)
  }
}

// Initialize
onMounted(async () => {
  await userStore.fetchAddresses()
})

useHead({
  title: '收货地址 - COCO CLAW'
})
</script>
