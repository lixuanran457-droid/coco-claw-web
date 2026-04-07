<template>
  <div class="skill-list">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-3 gap-3">
      <div 
        v-for="i in 6" 
        :key="i"
        class="cyber-card p-3 animate-pulse"
      >
        <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-cyber-border"></div>
        <div class="space-y-2">
          <div class="h-4 bg-cyber-border rounded w-3/4 mx-auto"></div>
          <div class="h-3 bg-cyber-border rounded w-full"></div>
          <div class="h-3 bg-cyber-border rounded w-2/3"></div>
          <div class="h-6 bg-cyber-border rounded w-1/2 mt-3"></div>
        </div>
      </div>
    </div>

    <!-- Skills Grid -->
    <div v-else-if="skills.length > 0" class="grid grid-cols-3 gap-3">
      <SkillCard
        v-for="skill in skills"
        :key="skill.id"
        :skill="skill"
        @click="$emit('skill-click', skill)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12">
      <span class="text-6xl mb-4">🔍</span>
      <p class="text-cyber-muted text-center">暂无 SKILL 数据</p>
      <button 
        class="cyber-btn-outline mt-4"
        @click="$emit('retry')"
      >
        重试
      </button>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && !loading" class="mt-6 text-center">
      <button 
        class="cyber-btn-outline"
        :disabled="loadingMore"
        @click="$emit('load-more')"
      >
        <span v-if="loadingMore">加载中...</span>
        <span v-else>加载更多</span>
      </button>
    </div>

    <!-- End Message -->
    <div v-if="!hasMore && skills.length > 0" class="mt-6 text-center">
      <div class="cyber-divider"></div>
      <p class="text-cyber-muted text-sm py-4">— 已加载全部 —</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '~/stores/skill'

interface Props {
  skills: Skill[]
  loading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  skills: () => [],
  loading: false,
  loadingMore: false,
  hasMore: true
})

defineEmits<{
  'skill-click': [skill: Skill]
  'load-more': []
  'retry': []
}>()
</script>
