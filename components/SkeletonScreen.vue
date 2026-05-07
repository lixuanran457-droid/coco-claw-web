<template>
  <div class="skeleton-wrapper">
    <!-- 骨架屏类型 -->
    <template v-if="type === 'card'">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'list'">
      <div v-for="i in count" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-text">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'table'">
      <div class="skeleton-table">
        <div class="skeleton-table-header">
          <div v-for="i in 5" :key="i" class="skeleton-line header-cell"></div>
        </div>
        <div v-for="i in count" :key="i" class="skeleton-table-row">
          <div v-for="j in 5" :key="j" class="skeleton-line cell"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'detail'">
      <div class="skeleton-detail">
        <div class="skeleton-line title large"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-grid">
          <div v-for="i in 4" :key="i" class="skeleton-stat">
            <div class="skeleton-line title small"></div>
            <div class="skeleton-line"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="i in count" :key="i" class="skeleton-item">
        <div class="skeleton-line"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 骨架屏类型
  type: {
    type: String,
    default: 'default',
    validator: (v: string) => ['default', 'card', 'list', 'table', 'detail'].includes(v)
  },
  // 重复次数
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
.skeleton-wrapper {
  width: 100%;
}

.skeleton-card {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.skeleton-image {
  height: 120px;
  background: linear-gradient(90deg, rgba(51, 65, 85, 0.3) 25%, rgba(51, 65, 85, 0.5) 50%, rgba(51, 65, 85, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 12px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, rgba(51, 65, 85, 0.3) 25%, rgba(51, 65, 85, 0.5) 50%, rgba(51, 65, 85, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-line.title {
  width: 60%;
  height: 16px;
}

.skeleton-line.short {
  width: 40%;
}

.skeleton-line.large {
  width: 80%;
  height: 24px;
}

.skeleton-line.small {
  width: 50%;
  height: 10px;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(51, 65, 85, 0.3) 25%, rgba(51, 65, 85, 0.5) 50%, rgba(51, 65, 85, 0.3) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-text {
  flex: 1;
}

.skeleton-table {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
  background: rgba(51, 65, 85, 0.3);
}

.skeleton-table-header .skeleton-line {
  margin-bottom: 0;
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
}

.skeleton-detail {
  padding: 16px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
}

.skeleton-detail .skeleton-line {
  margin-bottom: 16px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.skeleton-stat {
  background: rgba(51, 65, 85, 0.3);
  padding: 16px;
  border-radius: 8px;
}

.skeleton-stat .skeleton-line {
  margin-bottom: 8px;
}

.skeleton-item {
  padding: 12px 0;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
