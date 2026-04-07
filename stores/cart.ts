import { defineStore } from 'pinia'
import type { Skill, CartItem } from './skill'

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

      // Sync with backend
      try {
        await api.addToCart(skill.id, quantity)
      } catch (error) {
        console.error('Failed to sync cart with backend:', error)
      }
    },

    // Remove item from cart
    async removeFromCart(itemId: string) {
      const index = this.items.findIndex(item => item.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
      }

      try {
        await api.removeFromCart(itemId)
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
            await api.updateCartItem(itemId, quantity)
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
      const selectedIds = this.items.filter(item => item.selected).map(item => item.id)
      this.items = this.items.filter(item => !item.selected)
      
      try {
        for (const id of selectedIds) {
          await api.removeFromCart(id)
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
        // Load from local storage for demo
        this.loadFromLocalStorage()
      } finally {
        this.loading = false
      }
    },

    // Save to local storage
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('coco_claw_cart', JSON.stringify(this.items))
      }
    },

    // Load from local storage
    loadFromLocalStorage() {
      if (process.client) {
        const saved = localStorage.getItem('coco_claw_cart')
        if (saved) {
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
