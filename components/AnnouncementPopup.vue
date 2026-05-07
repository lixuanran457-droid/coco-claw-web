<template>
  <Transition name="fade">
    <div v-if="show" class="popup-overlay" @click.self="close">
      <div class="popup-container" :class="{ urgent: announcement.priority === 2 }">
        <button class="close-btn" @click="close">×</button>
        
        <!-- 头部 -->
        <div class="popup-header">
          <span class="type-badge" :class="`type-${announcement.type}`">
            {{ announcement.typeName }}
          </span>
          <span v-if="announcement.priority === 2" class="priority-badge">紧急</span>
        </div>

        <!-- 标题 -->
        <h2 class="popup-title">{{ announcement.title }}</h2>

        <!-- 内容 -->
        <div class="popup-content" v-html="formatContent(announcement.content)"></div>

        <!-- 链接 -->
        <div v-if="announcement.linkUrl" class="popup-action">
          <a :href="announcement.linkUrl" target="_blank" class="action-link">
            查看详情 →
          </a>
        </div>

        <!-- 底部 -->
        <div class="popup-footer">
          <span class="create-time">{{ formatTime(announcement.createTime) }}</span>
          <button class="know-btn" @click="close">我知道了</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Announcement {
  id: number
  title: string
  content: string
  type: number
  typeName: string
  priority: number
  linkUrl?: string
  createTime: string
}

const props = defineProps<{
  show: boolean
  announcement: Announcement | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}

const formatContent = (content: string) => {
  // 简单的内容格式化，支持换行
  return content.replace(/\n/g, '<br>')
}

const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.popup-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.popup-container.urgent {
  border-color: #f5222d;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 34, 45, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(245, 34, 45, 0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #fff;
}

.popup-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-badge.type-0 {
  background: rgba(24, 144, 255, 0.2);
  color: #1890ff;
}

.type-badge.type-1 {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.type-badge.type-2 {
  background: rgba(250, 173, 20, 0.2);
  color: #faad14;
}

.type-badge.type-3 {
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.popup-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
}

.popup-content {
  color: #ccc;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.popup-content::-webkit-scrollbar {
  width: 4px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 2px;
}

.popup-action {
  margin-bottom: 1.5rem;
}

.action-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.action-link:hover {
  text-decoration: underline;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.create-time {
  color: #666;
  font-size: 0.875rem;
}

.know-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s;
}

.know-btn:hover {
  opacity: 0.9;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .popup-container {
  animation: slideIn 0.3s ease;
}

.fade-leave-active .popup-container {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}
</style>
