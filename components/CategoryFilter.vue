<template>
  <div class="category-filter">
    <!-- Horizontal Scrollable Categories -->
    <div class="relative">
      <div 
        ref="scrollContainer"
        class="flex gap-2 overflow-x-auto scrollbar-hide px-4 -mx-4"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-btn flex-shrink-0"
          :class="{ 'active': selectedCategory === category.id }"
          @click="handleSelect(category.id)"
        >
          <span class="mr-1">{{ category.icon }}</span>
          <span>{{ category.name }}</span>
          <span class="ml-1 text-xs opacity-60">({{ category.count }})</span>
        </button>
      </div>

      <!-- Gradient Fade Indicators -->
      <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cyber-darker to-transparent pointer-events-none"></div>
      <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cyber-darker to-transparent pointer-events-none"></div>
    </div>

    <!-- Sort Options (optional) -->
    <div v-if="showSort" class="mt-3 px-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-cyber-muted">排序：</span>
        <div class="flex gap-2">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            class="sort-btn"
            :class="{ 'active': selectedSort === option.value }"
            @click="handleSort(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/stores/skill'

interface SortOption {
  label: string
  value: string
}

interface Props {
  categories: Category[]
  selectedCategory?: string
  selectedSort?: string
  showSort?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  selectedCategory: 'all',
  selectedSort: 'default',
  showSort: false
})

const emit = defineEmits<{
  'update:selectedCategory': [value: string]
  'update:selectedSort': [value: string]
}>()

const scrollContainer = ref<HTMLElement>()

const sortOptions: SortOption[] = [
  { label: '默认', value: 'default' },
  { label: '销量', value: 'sales' },
  { label: '评分', value: 'rating' },
  { label: '价格', value: 'price' }
]

const handleSelect = (categoryId: string) => {
  emit('update:selectedCategory', categoryId)
}

const handleSort = (sortValue: string) => {
  emit('update:selectedSort', sortValue)
}

// Auto-scroll to selected category
watch(() => props.selectedCategory, (newVal, oldVal) => {
  if (newVal !== oldVal && scrollContainer.value) {
    const activeBtn = scrollContainer.value.querySelector('.category-btn.active') as HTMLElement
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.category-btn {
  @apply px-4 py-2 rounded-full text-sm font-medium;
  @apply bg-cyber-card border border-cyber-border;
  @apply text-cyber-muted;
  @apply transition-all duration-300;
  white-space: nowrap;
}

.category-btn:hover {
  @apply border-cyber-primary text-cyber-primary;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
}

.category-btn.active {
  @apply border-cyber-primary text-cyber-primary;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.sort-btn {
  @apply px-3 py-1 rounded text-xs;
  @apply text-cyber-muted;
  @apply transition-all duration-200;
}

.sort-btn:hover {
  @apply text-cyber-primary;
}

.sort-btn.active {
  @apply text-cyber-primary bg-cyber-primary/10;
}
</style>
