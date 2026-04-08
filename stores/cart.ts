import { defineStore } from 'pinia'
import type { Skill, CartItem } from './skill'

const API_BASE = '/api'

// API functions
const api = {
  async getCart() {
    const response = await fetch(`${API_BASE}/cart/list`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return {
        data: {
          items: (result.data || []).map((item: any) => ({
            id: item.id?.toString() || `cart_${Date.now()}`,
            skill: {
              id: item.skillId?.toString() || '',
              name: item.skillName || '',
              icon: item.icon || '🤖',
              description: item.description || '',
              price: Number(item.price) || 0,
              priceType: item.priceType ?? 1,
              originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
              category: item.category || 'tool',
              platform: item.platform || '通用',
              salesCount: item.salesCount || 0,
              rating: Number(item.rating) || 4.5,
              reviewCount: 0,
              safetyLevel: 'high' as const,
              features: [],
              author: item.author || '系统',
              updateTime: new Date().toISOString().split('T')[0]
            },
            quantity: item.quantity || 1,
            selected: true
          }))
        }
      }
    }
    throw new Error(result.message || '获取购物车失败')
  },

  async addToCart(skillId: string, quantity: number = 1) {
    const response = await fetch(`${API_BASE}/cart/add?skillId=${skillId}&quantity=${quantity}`, {
      method: 'POST',
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return { data: true }
    }
    throw new Error(result.message || '添加失败')
  },

  async removeFromCart(cartId: string) {
    const response = await fetch(`${API_BASE}/cart/remove/${cartId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return { data: true }
    }
    throw new Error(result.message || '删除失败')
  },

  async updateCartItem(cartId: string, quantity: number) {
    const response = await fetch(`${API_BASE}/cart/update?cartId=${cartId}&quantity=${quantity}`, {
      method: 'PUT',
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return { data: true }
    }
    throw new Error(result.message || '更新失败')
  },

  async clearCart() {
    const response = await fetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return { data: true }
    }
    throw new Error(result.message || '清空失败')
  },

  async getCartCount() {
    try {
      const response = await fetch(`${API_BASE}/cart/count`, {
        credentials: 'include'
      })
      const result = await response.json()
      if (result.code === 200) {
        return { data: result.data || 0 }
      }
    } catch (error) {
      console.error('获取购物车数量失败:', error)
    }
    return { data: 0 }
  }
}

export interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    selectedItems: (state) => state.items.filter(item => item.selected),

    totalPrice: (state) => {
      return state.items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.skill.price * item.quantity, 0)
    },

    originalTotalPrice: (state) => {
      return state.items
        .filter(item => item.selected)
        .reduce((sum, item) => {
          const price = item.skill.originalPrice || item.skill.price
          return sum + price * item.quantity
        }, 0)
    },

    discount: (state) => {
      const total = state.items
        .filter(item => item.selected)
        .reduce((sum, item) => sum + item.skill.price * item.quantity, 0)
      const original = state.items
        .filter(item => item.selected)
        .reduce((sum, item) => {
          const price = item.skill.originalPrice || item.skill.price
          return sum + price * item.quantity
        }, 0)
      return original - total
    },

    isAllSelected: (state) => {
      if (state.items.length === 0) return false
      return state.items.every(item => item.selected)
    }
  },

  actions: {
    // Add item to cart
    async addToCart(skill: Skill, quantity: number = 1) {
      // 先更新本地状态
      const existingItem = this.items.find(item => item.skill.id === skill.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: `cart_${Date.now()}`,
          skill,
          quantity,
          selected: true
        })
      }

      // 同步到后端
      try {
        await api.addToCart(skill.id, quantity)
      } catch (error) {
        console.error('Failed to sync cart with backend:', error)
        // 后端同步失败，但本地已添加
      }
    },

    // Remove item from cart
    async removeFromCart(itemId: string) {
      const index = this.items.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
      }

      try {
        // 如果是后端ID格式，调用API删除
        if (!itemId.startsWith('cart_')) {
          await api.removeFromCart(itemId)
        }
      } catch (error) {
        console.error('Failed to sync cart with backend:', error)
      }
    },

    // Update item quantity
    async updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(itemId)
        } else {
          item.quantity = quantity
          try {
            if (!itemId.startsWith('cart_')) {
              await api.updateCartItem(itemId, quantity)
            }
          } catch (error) {
            console.error('Failed to sync cart with backend:', error)
          }
        }
      }
    },

    // Toggle item selection
    toggleSelect(itemId: string) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        item.selected = !item.selected
      }
    },

    // Toggle all selection
    toggleSelectAll() {
      const isAll = this.isAllSelected
      this.items.forEach(item => {
        item.selected = !isAll
      })
    },

    // Clear selected items
    async clearSelected() {
      const selectedItems = this.items.filter(item => item.selected)
      this.items = this.items.filter(item => !item.selected)

      try {
        for (const item of selectedItems) {
          if (!item.id.startsWith('cart_')) {
            await api.removeFromCart(item.id)
          }
        }
      } catch (error) {
        console.error('Failed to sync cart with backend:', error)
      }
    },

    // Clear entire cart
    async clearCart() {
      this.items = []

      try {
        await api.clearCart()
      } catch (error) {
        console.error('Failed to sync cart with backend:', error)
      }
    },

    // Fetch cart from backend
    async fetchCart() {
      this.loading = true
      try {
        const { data } = await api.getCart()
        this.items = data.items || []
      } catch (error) {
        console.error('Failed to fetch cart:', error)
        // 后端获取失败，清空本地购物车
        this.items = []
      } finally {
        this.loading = false
      }
    },

    // Fetch cart count
    async fetchCartCount(): Promise<number> {
      try {
        const { data } = await api.getCartCount()
        return data
      } catch (error) {
        console.error('Failed to fetch cart count:', error)
        return 0
      }
    },

    // Save to local storage (backup)
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('coco_claw_cart', JSON.stringify(this.items))
      }
    },

    // Load from local storage (fallback)
    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('coco_claw_cart')
        if (saved && this.items.length === 0) {
          try {
            this.items = JSON.parse(saved)
          } catch (e) {
            console.error('Failed to parse cart from localStorage:', e)
          }
        }
      }
    },

    // Check if skill is in cart
    isInCart(skillId: string): boolean {
      return this.items.some(item => item.skill.id === skillId)
    },

    // Get item quantity in cart
    getItemQuantity(skillId: string): number {
      const item = this.items.find(item => item.skill.id === skillId)
      return item?.quantity || 0
    }
  }
})
