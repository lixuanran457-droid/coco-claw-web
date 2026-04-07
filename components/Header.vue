<template>
  <header class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
    <div class="px-4 py-3">
      <!-- Logo & Title -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-cyber-gradient flex items-center justify-center text-xl animate-pulse-glow">
            🐾
          </div>
          <div>
            <h1 class="text-lg font-bold neon-text text-cyber-primary">COCO CLAW</h1>
            <p class="text-xs text-cyber-muted">SKILL 交易市场</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <button 
            @click="$emit('search')"
            class="p-2 rounded-lg hover:bg-cyber-card transition-colors"
          >
            <span class="text-xl">🔍</span>
          </button>

          <!-- Cart Button -->
          <NuxtLink to="/cart" class="relative p-2 rounded-lg hover:bg-cyber-card transition-colors">
            <span class="text-xl">🛒</span>
            <span 
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyber-accent text-xs font-bold flex items-center justify-center animate-bounce"
            >
              {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Search Bar (collapsible) -->
      <Transition name="slide">
        <div v-if="showSearch" class="mt-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索 SKILL..."
              class="cyber-input pr-10"
              @keyup.enter="handleSearch"
              autofocus
            />
            <button 
              @click="handleSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-primary hover:text-cyber-secondary transition-colors"
            >
              🔍
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
  showSearch?: boolean
}>()

const emit = defineEmits<{
  search: []
  'update:showSearch': [value: boolean]
}>()

const cartStore = useCartStore()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/skills?keyword=${encodeURIComponent(searchQuery.value)}`)
  }
}

// Sync with parent
watch(() => props.showSearch, (val) => {
  if (!val) {
    searchQuery.value = ''
  }
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
