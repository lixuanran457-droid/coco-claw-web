<template>
  <div 
    class="cyber-card p-3 cursor-pointer group"
    @click="$emit('click', skill)"
  >
    <!-- Icon & Badge -->
    <div class="relative mb-3">
      <div class="w-14 h-14 mx-auto rounded-xl bg-cyber-gradient flex items-center justify-center text-3xl shadow-cyber">
        {{ skill.icon }}
      </div>
      
      <!-- Safety Level Badge -->
      <div 
        class="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-xs font-medium"
        :class="safetyLevelClass"
      >
        {{ safetyLevelText }}
      </div>
      
      <!-- Rank Badge (for top skills) -->
      <div 
        v-if="skill.rank"
        class="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-cyber-gradient flex items-center justify-center text-sm font-bold shadow-cyber-lg"
      >
        {{ rankEmoji }}
      </div>
    </div>

    <!-- Info -->
    <div class="space-y-2">
      <!-- Name -->
      <h3 class="font-semibold text-cyber-text truncate text-sm group-hover:text-cyber-primary transition-colors">
        {{ skill.name }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-cyber-muted line-clamp-2 h-8">
        {{ skill.description }}
      </p>

      <!-- Stats -->
      <div class="flex items-center justify-between text-xs text-cyber-muted">
        <span class="flex items-center">
          ⭐ {{ skill.rating.toFixed(1) }}
        </span>
        <span>销量 {{ formatNumber(skill.salesCount) }}</span>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between pt-2 border-t border-cyber-border">
        <div>
          <span class="text-lg font-bold text-cyber-primary">¥{{ skill.price }}</span>
          <span 
            v-if="skill.originalPrice && skill.originalPrice > skill.price"
            class="ml-1 text-xs text-cyber-muted line-through"
          >
            ¥{{ skill.originalPrice }}
          </span>
        </div>
        
        <!-- Platform Badge -->
        <span class="text-xs px-2 py-0.5 rounded bg-cyber-card border border-cyber-border">
          {{ skill.platform }}
        </span>
      </div>

      <!-- Features Preview -->
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="(feature, index) in skill.features.slice(0, 2)" 
          :key="index"
          class="text-xs px-1.5 py-0.5 rounded bg-cyber-secondary/10 text-cyber-secondary"
        >
          {{ feature }}
        </span>
        <span 
          v-if="skill.features.length > 2"
          class="text-xs px-1.5 py-0.5 rounded bg-cyber-muted/10 text-cyber-muted"
        >
          +{{ skill.features.length - 2 }}
        </span>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      <div class="absolute inset-0 rounded-lg border-2 border-cyber-primary/50"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/stores/skill'

const props = defineProps<{
  skill: Skill
}>()

defineEmits<{
  click: [skill: Skill]
}>()

// Safety level styling
const safetyLevelClass = computed(() => {
  switch (props.skill.safetyLevel) {
    case 'high':
      return 'bg-green-500/20 text-green-400 border border-green-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
    case 'low':
      return 'bg-red-500/20 text-red-400 border border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }
})

const safetyLevelText = computed(() => {
  switch (props.skill.safetyLevel) {
    case 'high':
      return '安全'
    case 'medium':
      return '注意'
    case 'low':
      return '风险'
    default:
      return '未知'
  }
})

// Rank emoji
const rankEmoji = computed(() => {
  switch (props.skill.rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    case 4:
      return '4️⃣'
    default:
      return props.skill.rank
  }
})

// Format number
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
