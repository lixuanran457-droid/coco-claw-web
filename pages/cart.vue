<template>
  <div class="cart-page min-h-screen pb-36">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">购物车</h1>
        <button 
          v-if="cartStore.items.length > 0"
          @click="handleClearCart"
          class="p-2 -mr-2 rounded-lg hover:bg-cyber-card transition-colors text-cyber-muted hover:text-cyber-danger"
        >
          <span class="text-xl">🗑️</span>
        </button>
        <div v-else class="w-10"></div>
      </div>
    </div>

    <!-- Cart Items -->
    <div class="px-4 py-4">
      <!-- Empty State -->
      <div 
        v-if="cartStore.items.length === 0" 
        class="flex flex-col items-center justify-center py-20"
      >
        <span class="text-7xl mb-6">🛒</span>
        <h2 class="text-xl font-bold text-cyber-text mb-2">购物车是空的</h2>
        <p class="text-cyber-muted mb-6">快去挑选心仪的 SKILL 吧</p>
        <NuxtLink to="/skills">
          <button class="cyber-btn">
            <span class="mr-2">🔍</span>
            去发现
          </button>
        </NuxtLink>
      </div>

      <!-- Cart List -->
      <div v-else class="space-y-4">
        <!-- Select All -->
        <div class="flex items-center justify-between py-2">
          <label class="flex items-center cursor-pointer">
            <input 
              type="checkbox"
              :checked="cartStore.isAllSelected"
              @change="cartStore.toggleSelectAll()"
              class="w-5 h-5 rounded accent-cyber-primary"
            />
            <span class="ml-2 text-cyber-text">全选</span>
          </label>
          <button 
            v-if="cartStore.selectedItems.length > 0"
            @click="cartStore.clearSelected()"
            class="text-sm text-cyber-danger hover:text-red-400"
          >
            删除选中
          </button>
        </div>

        <!-- Items -->
        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="cyber-card p-4"
          >
            <div class="flex gap-3">
              <!-- Checkbox -->
              <label class="flex items-center flex-shrink-0">
                <input 
                  type="checkbox"
                  :checked="item.selected"
                  @change="cartStore.toggleSelect(item.id)"
                  class="w-5 h-5 rounded accent-cyber-primary"
                />
              </label>

              <!-- Icon -->
              <div class="w-16 h-16 rounded-xl bg-cyber-gradient flex items-center justify-center text-2xl flex-shrink-0">
                {{ item.skill.icon }}
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-cyber-text truncate">{{ item.skill.name }}</h3>
                <p class="text-xs text-cyber-muted truncate mt-1">{{ item.skill.description }}</p>
                
                <div class="flex items-center justify-between mt-2">
                  <span class="text-lg font-bold text-cyber-primary">¥{{ item.skill.price }}</span>
                  
                  <!-- Quantity Control -->
                  <div class="flex items-center gap-2">
                    <button 
                      @click="updateQuantity(item, -1)"
                      class="w-8 h-8 rounded-lg bg-cyber-darker border border-cyber-border flex items-center justify-center text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary transition-colors"
                      :disabled="item.quantity <= 1"
                    >
                      −
                    </button>
                    <span class="w-8 text-center text-cyber-text font-medium">
                      {{ item.quantity }}
                    </span>
                    <button 
                      @click="updateQuantity(item, 1)"
                      class="w-8 h-8 rounded-lg bg-cyber-darker border border-cyber-border flex items-center justify-center text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <!-- Delete -->
              <button 
                @click="cartStore.removeFromCart(item.id)"
                class="p-2 text-cyber-muted hover:text-cyber-danger transition-colors flex-shrink-0"
              >
                <span class="text-lg">✕</span>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Fixed Bottom Summary -->
    <div 
      v-if="cartStore.items.length > 0"
      class="fixed bottom-0 left-0 right-0 bg-cyber-darker/95 backdrop-blur-md border-t border-cyber-border safe-area-bottom z-50"
    >
      <div class="p-4">
        <!-- Summary -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-cyber-muted">合计</div>
            <div class="text-2xl font-bold text-cyber-primary">
              ¥{{ cartStore.totalPrice.toFixed(2) }}
            </div>
            <div 
              v-if="cartStore.discount > 0"
              class="text-xs text-cyber-success"
            >
              节省 ¥{{ cartStore.discount.toFixed(2) }}
            </div>
          </div>
          <button 
            class="cyber-btn"
            :disabled="cartStore.selectedItems.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': cartStore.selectedItems.length === 0 }"
            @click="handleCheckout"
          >
            结算 ({{ cartStore.selectedItems.length }})
          </button>
        </div>

        <!-- Selected Info -->
        <div class="text-sm text-cyber-muted text-center">
          已选择 {{ cartStore.selectedItems.length }} 件商品，共 {{ cartStore.totalItems }} 件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import type { CartItem } from '~/stores/cart'

const cartStore = useCartStore()

// Load cart on mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
})

// Methods
const updateQuantity = (item: CartItem, delta: number) => {
  const newQuantity = item.quantity + delta
  if (newQuantity > 0) {
    cartStore.updateQuantity(item.id, newQuantity)
    cartStore.saveToLocalStorage()
  }
}

const handleClearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    cartStore.clearCart()
    cartStore.saveToLocalStorage()
  }
}

const handleCheckout = () => {
  if (cartStore.selectedItems.length === 0) return
  
  // Navigate to order page with cart data
  navigateTo('/order')
}

// SEO
useHead({
  title: '购物车 - COCO CLAW'
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
