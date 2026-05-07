<template>
  <div class="empty-state">
    <div class="empty-illustration">
      <div class="empty-icon" :style="{ fontSize: iconSize }">{{ icon }}</div>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-action">
      <slot name="action"></slot>
    </div>
    <div v-else-if="actionText" class="empty-action">
      <button class="empty-btn" @click="$emit('action')">
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 图标
  icon: {
    type: String,
    default: '📦'
  },
  // 标题
  title: {
    type: String,
    default: '暂无数据'
  },
  // 描述
  description: {
    type: String,
    default: ''
  },
  // 操作按钮文字
  actionText: {
    type: String,
    default: ''
  },
  // 图标大小
  iconSize: {
    type: String,
    default: '48px'
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(147, 112, 219, 0.1));
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px;
}

.empty-description {
  font-size: 14px;
  color: rgba(165, 180, 252, 0.6);
  margin: 0 0 20px;
  max-width: 280px;
  line-height: 1.5;
}

.empty-action {
  margin-top: 8px;
}

.empty-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.empty-btn:active {
  transform: scale(0.98);
}
</style>
