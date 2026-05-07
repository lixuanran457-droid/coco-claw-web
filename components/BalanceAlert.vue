<template>
  <Transition name="slide">
    <div v-if="show" class="balance-alert">
      <div class="alert-icon" :class="alertType">
        <span v-if="alertType === 'warning'">⚠️</span>
        <span v-else-if="alertType === 'danger'">🚨</span>
        <span v-else>💡</span>
      </div>
      <div class="alert-content">
        <h4 class="alert-title">{{ title }}</h4>
        <p class="alert-message">{{ message }}</p>
      </div>
      <div class="alert-actions">
        <button v-if="showRecharge" class="btn-primary" @click="handleRecharge">
          立即充值
        </button>
        <button class="btn-dismiss" @click="dismiss">
          {{ dismissText }}
        </button>
      </div>
      <button class="close-btn" @click="dismiss">×</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  type: 'info' | 'warning' | 'danger'
  title: string
  message: string
  showRecharge?: boolean
  dismissText?: string
  autoDismissAfter?: number // 秒
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'recharge'): void
}>()

const alertType = computed(() => props.type)

const dismiss = () => {
  emit('close')
}

const handleRecharge = () => {
  emit('recharge')
}
</script>

<style scoped>
.balance-alert {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  max-width: 380px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.balance-alert.warning {
  border-color: rgba(250, 173, 20, 0.5);
}

.balance-alert.danger {
  border-color: rgba(245, 34, 45, 0.5);
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #fff;
}

.balance-alert.warning .alert-title {
  color: #faad14;
}

.balance-alert.danger .alert-title {
  color: #f5222d;
}

.alert-message {
  font-size: 0.875rem;
  color: #888;
  line-height: 1.5;
  margin: 0;
}

.alert-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-dismiss {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #888;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-dismiss:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: #ccc;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
