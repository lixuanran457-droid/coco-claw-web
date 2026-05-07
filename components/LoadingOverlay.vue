<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="loading-overlay">
        <div class="loading-spinner" :class="[`spinner-${type}`]">
          <template v-if="type === 'spinner'">
            <div class="spinner-circle"></div>
          </template>
          <template v-else-if="type === 'dots'">
            <div class="spinner-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>
          <template v-else-if="type === 'pulse'">
            <div class="spinner-pulse"></div>
          </template>
        </div>
        <p v-if="text" class="loading-text">{{ text }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'spinner',
    validator: (v: string) => ['spinner', 'dots', 'pulse'].includes(v)
  }
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 转圈 */
.spinner-circle {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 脉冲 */
.spinner-pulse {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

/* 三个点 */
.spinner-dots {
  display: flex;
  gap: 8px;
}

.spinner-dots span {
  width: 12px;
  height: 12px;
  background: #6366f1;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.spinner-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.loading-text {
  margin-top: 16px;
  color: rgba(165, 180, 252, 0.9);
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
