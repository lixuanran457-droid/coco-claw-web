<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3">
        <h1 class="text-lg font-bold text-cyber-text">我的技能</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <span class="text-5xl animate-spin">⟳</span>
      <p class="text-cyber-muted mt-4">加载中...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="userSkills.length === 0" class="flex flex-col items-center justify-center py-20 px-4">
      <span class="text-7xl mb-6">🎯</span>
      <h2 class="text-xl font-bold text-cyber-text mb-2">暂无技能</h2>
      <p class="text-cyber-muted mb-6 text-center">您还没有购买任何技能，快去挑选吧！</p>
      <NuxtLink to="/">
        <button class="cyber-btn">浏览技能商店</button>
      </NuxtLink>
    </div>

    <!-- Skills List -->
    <div v-else class="px-4 py-4">
      <div class="space-y-4">
        <div 
          v-for="skill in userSkills" 
          :key="skill.id"
          class="cyber-card p-4 rounded-xl"
        >
          <div class="flex items-start gap-4">
            <!-- Skill Icon -->
            <div 
              class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              :style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
            >
              {{ skill.skillIcon || '🎯' }}
            </div>

            <!-- Skill Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-cyber-text truncate">{{ skill.skillName }}</h3>
                <span 
                  v-if="skill.isExpired"
                  class="px-2 py-0.5 text-xs rounded bg-cyber-danger/20 text-cyber-danger"
                >
                  已过期
                </span>
                <span 
                  v-else-if="skill.remainUsage === 0"
                  class="px-2 py-0.5 text-xs rounded bg-cyber-warning/20 text-cyber-warning"
                >
                  次数用完
                </span>
                <span 
                  v-else
                  class="px-2 py-0.5 text-xs rounded bg-cyber-success/20 text-cyber-success"
                >
                  正常使用
                </span>
              </div>

              <!-- Usage Info -->
              <div class="flex items-center gap-4 text-sm text-cyber-muted mb-2">
                <span v-if="skill.unlimited">
                  使用次数: 无限
                </span>
                <span v-else>
                  剩余次数: {{ skill.remainUsage }} / {{ skill.maxUsageCount }}
                </span>
                <span v-if="skill.expireTime">
                  有效期至: {{ formatDate(skill.expireTime) }}
                </span>
              </div>

              <!-- Progress Bar -->
              <div v-if="!skill.unlimited && !skill.isExpired" class="mb-3">
                <div class="h-2 bg-cyber-darker rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-cyber-gradient transition-all"
                    :style="{ width: `${(skill.remainUsage / skill.maxUsageCount) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <button 
                  @click="viewSkillDetail(skill)"
                  :disabled="skill.isExpired || skill.remainUsage === 0"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    skill.isExpired || skill.remainUsage === 0
                      ? 'bg-cyber-card text-cyber-muted cursor-not-allowed'
                      : 'bg-cyber-gradient text-white hover:shadow-cyber'
                  ]"
                >
                  {{ skill.isExpired || skill.remainUsage === 0 ? '暂不可用' : '使用技能' }}
                </button>
                <button 
                  @click="copyApiKey(skill)"
                  class="px-4 py-2 rounded-lg text-sm font-medium bg-cyber-card text-cyber-text hover:bg-cyber-darker transition-colors"
                >
                  复制API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skill Detail Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="selectedSkill"
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          @click.self="selectedSkill = null"
        >
          <div class="cyber-card p-6 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-cyber-text">{{ selectedSkill.skillName }}</h2>
              <button 
                @click="selectedSkill = null"
                class="p-2 rounded-lg hover:bg-cyber-darker transition-colors"
              >
                ✕
              </button>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <h3 class="text-sm font-medium text-cyber-muted mb-2">技能描述</h3>
              <p class="text-cyber-text text-sm">{{ selectedSkill.skillDescription || '暂无描述' }}</p>
            </div>

            <!-- Usage Info -->
            <div class="mb-4 p-4 bg-cyber-darker rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-cyber-muted">使用次数</p>
                  <p class="text-lg font-bold text-cyber-text">{{ selectedSkill.usageCount }} 次</p>
                </div>
                <div>
                  <p class="text-cyber-muted">剩余次数</p>
                  <p class="text-lg font-bold text-cyber-success">
                    {{ selectedSkill.unlimited ? '无限' : selectedSkill.remainUsage + ' 次' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- API Info -->
            <div class="mb-4">
              <h3 class="text-sm font-medium text-cyber-muted mb-2">API密钥</h3>
              <div class="flex items-center gap-2">
                <input 
                  type="text" 
                  :value="selectedSkill.apiKey || '未配置'"
                  readonly
                  class="flex-1 px-3 py-2 bg-cyber-darker rounded-lg text-sm text-cyber-text border border-cyber-border"
                />
                <button 
                  @click="copyText(selectedSkill.apiKey)"
                  class="px-4 py-2 bg-cyber-primary text-white rounded-lg text-sm hover:bg-cyber-primary/80 transition-colors"
                >
                  复制
                </button>
              </div>
            </div>

            <!-- API Endpoint -->
            <div v-if="selectedSkill.apiEndpoint" class="mb-4">
              <h3 class="text-sm font-medium text-cyber-muted mb-2">API端点</h3>
              <div class="flex items-center gap-2">
                <input 
                  type="text" 
                  :value="selectedSkill.apiEndpoint"
                  readonly
                  class="flex-1 px-3 py-2 bg-cyber-darker rounded-lg text-sm text-cyber-text border border-cyber-border"
                />
                <button 
                  @click="copyText(selectedSkill.apiEndpoint)"
                  class="px-4 py-2 bg-cyber-primary text-white rounded-lg text-sm hover:bg-cyber-primary/80 transition-colors"
                >
                  复制
                </button>
              </div>
            </div>

            <!-- Documentation -->
            <div v-if="selectedSkill.apiDocumentation" class="mb-4">
              <h3 class="text-sm font-medium text-cyber-muted mb-2">使用文档</h3>
              <a 
                :href="selectedSkill.apiDocumentation"
                target="_blank"
                class="text-cyber-primary hover:underline"
              >
                点击查看API文档 →
              </a>
            </div>

            <!-- Use Button -->
            <button 
              @click="useSkill(selectedSkill)"
              :disabled="selectedSkill.isExpired || selectedSkill.remainUsage === 0"
              :class="[
                'w-full py-3 rounded-xl font-bold transition-all',
                selectedSkill.isExpired || selectedSkill.remainUsage === 0
                  ? 'bg-cyber-card text-cyber-muted cursor-not-allowed'
                  : 'bg-cyber-gradient text-white hover:shadow-cyber'
              ]"
            >
              {{ selectedSkill.isExpired ? '技能已过期' : selectedSkill.remainUsage === 0 ? '使用次数已用完' : '使用此技能' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

const apiBase = '/api'

// State
const loading = ref(true)
const userSkills = ref<any[]>([])
const selectedSkill = ref<any>(null)

// Fetch user skills
const fetchUserSkills = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${apiBase}/user/skill/list`)
    if (response.data.code === 200) {
      userSkills.value = response.data.data
    }
  } catch (error) {
    console.error('获取用户技能失败:', error)
  } finally {
    loading.value = false
  }
}

// View skill detail
const viewSkillDetail = (skill: any) => {
  selectedSkill.value = skill
}

// Use skill
const useSkill = async (skill: any) => {
  try {
    const response = await axios.post(`${apiBase}/user/skill/use/${skill.skillId}`)
    if (response.data.code === 200) {
      // Update local state
      skill.usageCount = response.data.data.usageCount
      skill.remainUsage = response.data.data.remainUsage
      alert(`技能使用成功！剩余 ${skill.remainUsage === -1 ? '无限' : skill.remainUsage} 次`)
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '使用技能失败')
  }
}

// Copy API Key
const copyApiKey = (skill: any) => {
  copyText(skill.apiKey)
}

// Copy text to clipboard
const copyText = (text: string) => {
  if (!text) return
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板')
  }).catch(() => {
    alert('复制失败')
  })
}

// Format date
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// Initialize
onMounted(() => {
  fetchUserSkills()
})

useHead({
  title: '我的技能 - COCO CLAW'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
