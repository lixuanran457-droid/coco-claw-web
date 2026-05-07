<template>
  <div class="usage-detail-page">
    <!-- 顶部导航 -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="logo">🏠 COCO CLAW</div>
        <div class="nav-links">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/shop">商城</NuxtLink>
          <NuxtLink to="/skills">Skills</NuxtLink>
          <NuxtLink to="/my-api" class="active">控制台</NuxtLink>
          <NuxtLink to="/login" class="btn-login">登录</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="content-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <nav class="side-nav">
          <NuxtLink to="/my-api" class="nav-item">💰 概览</NuxtLink>
          <NuxtLink to="/usage-detail" class="nav-item active">📊 使用记录</NuxtLink>
          <NuxtLink to="/api-keys" class="nav-item">🔑 API密钥</NuxtLink>
          <NuxtLink to="/tokens" class="nav-item">💳 充值</NuxtLink>
        </nav>
      </aside>

      <!-- 主内容 -->
      <main class="main-content">
        <div class="page-header">
          <h1>使用记录</h1>
          <div class="header-actions">
            <select v-model="timeRange" class="time-select">
              <option value="7">最近7天</option>
              <option value="30">最近30天</option>
              <option value="90">最近90天</option>
            </select>
            <button class="export-btn" @click="exportData">📥 导出</button>
          </div>
        </div>

        <!-- 使用量图表 -->
        <div class="chart-section">
          <div class="chart-card">
            <h3>Token使用趋势</h3>
            <div class="chart-container">
              <canvas ref="usageChartRef"></canvas>
            </div>
          </div>
          <div class="chart-card">
            <h3>消费金额趋势</h3>
            <div class="chart-container">
              <canvas ref="costChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- 统计概览 -->
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalUsage) }}</div>
            <div class="stat-label">总使用量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ totalCost.toFixed(2) }}</div>
            <div class="stat-label">总消费</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ requestCount }}</div>
            <div class="stat-label">请求次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ avgResponseTime }}ms</div>
            <div class="stat-label">平均响应</div>
          </div>
        </div>

        <!-- 模型分布 -->
        <div class="model-distribution">
          <h3>模型使用分布</h3>
          <div class="model-list">
            <div v-for="model in modelUsage" :key="model.name" class="model-item">
              <div class="model-info">
                <span class="model-name">{{ model.name }}</span>
                <span class="model-count">{{ formatNumber(model.count) }} Tokens</span>
              </div>
              <div class="model-bar">
                <div class="model-bar-fill" :style="{ width: model.percent + '%' }"></div>
              </div>
              <span class="model-percent">{{ model.percent.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- 使用明细表格 -->
        <div class="usage-table-section">
          <h3>使用明细</h3>
          <table class="usage-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>模型</th>
                <th>输入Token</th>
                <th>输出Token</th>
                <th>金额</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in usageList" :key="item.id">
                <td>{{ formatDateTime(item.createTime) }}</td>
                <td>
                  <span class="model-badge">{{ item.model }}</span>
                </td>
                <td>{{ formatNumber(item.inputTokens) }}</td>
                <td>{{ formatNumber(item.outputTokens) }}</td>
                <td class="cost">¥{{ item.cost.toFixed(4) }}</td>
                <td>
                  <span :class="['status-badge', item.success ? 'success' : 'failed']">
                    {{ item.success ? '成功' : '失败' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 分页 -->
          <div class="pagination">
            <button :disabled="page <= 1" @click="page--">上一页</button>
            <span class="page-info">第 {{ page }} / {{ totalPages }} 页</span>
            <button :disabled="page >= totalPages" @click="page++">下一页</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const timeRange = ref('30')
const page = ref(1)
const pageSize = 20

// 统计数据
const totalUsage = ref(125680)
const totalCost = ref(45.68)
const requestCount = ref(1256)
const avgResponseTime = ref(380)

// 模型使用分布
const modelUsage = ref([
  { name: 'GPT-4o', count: 45600, percent: 36.3 },
  { name: 'Claude 3.5 Sonnet', count: 38400, percent: 30.6 },
  { name: 'GPT-4o Mini', count: 22100, percent: 17.6 },
  { name: 'DeepSeek V3', count: 14580, percent: 11.6 },
  { name: 'Claude 3 Haiku', count: 5000, percent: 4.0 },
])

// 使用明细
const usageList = ref([
  { id: 1, model: 'GPT-4o', inputTokens: 1200, outputTokens: 850, cost: 0.072, success: true, createTime: '2024-01-15 14:30:25' },
  { id: 2, model: 'Claude 3.5 Sonnet', inputTokens: 850, outputTokens: 1200, cost: 0.092, success: true, createTime: '2024-01-15 14:28:10' },
  { id: 3, model: 'GPT-4o Mini', inputTokens: 200, outputTokens: 350, cost: 0.006, success: true, createTime: '2024-01-15 14:25:00' },
  { id: 4, model: 'DeepSeek V3', inputTokens: 500, outputTokens: 800, cost: 0.021, success: true, createTime: '2024-01-15 14:22:45' },
  { id: 5, model: 'GPT-4o', inputTokens: 1500, outputTokens: 2100, cost: 0.156, success: false, createTime: '2024-01-15 14:20:30' },
  { id: 6, model: 'Claude 3 Haiku', inputTokens: 180, outputTokens: 220, cost: 0.003, success: true, createTime: '2024-01-15 14:18:15' },
  { id: 7, model: 'GPT-4o', inputTokens: 980, outputTokens: 1100, cost: 0.091, success: true, createTime: '2024-01-15 14:15:00' },
  { id: 8, model: 'Claude 3.5 Sonnet', inputTokens: 1100, outputTokens: 950, cost: 0.093, success: true, createTime: '2024-01-15 14:12:40' },
])

const totalPages = computed(() => Math.ceil(usageList.value.length / pageSize))

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const exportData = () => {
  // 实现导出功能
  alert('导出功能开发中...')
}
</script>

<style scoped>
.usage-detail-page {
  min-height: 100vh;
  background: #0a0a0f;
  color: #e0e0e0;
  font-family: 'Inter', 'PingFang SC', sans-serif;
}

/* 导航 */
.top-nav {
  padding: 1rem 2rem;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #fff;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  color: #fff !important;
}

/* 内容容器 */
.content-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
}

/* 侧边栏 */
.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.side-nav {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
}

.nav-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #888;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  margin-bottom: 0.25rem;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

/* 主内容 */
.main-content {
  flex: 1;
  min-width: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.time-select {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
}

.export-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 8px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn:hover {
  background: rgba(102, 126, 234, 0.3);
}

/* 图表区域 */
.chart-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
}

.chart-card h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #888;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  min-height: 10px;
  transition: height 0.3s;
}

/* 简化图表显示 - 实际项目应该用ECharts等图表库 */
.chart-container::before {
  content: '';
  flex: 1;
  height: 80%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.chart-container::after {
  content: '';
  flex: 1;
  height: 60%;
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  color: #888;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* 模型分布 */
.model-distribution {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.model-distribution h3 {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #888;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.model-info {
  width: 180px;
  display: flex;
  flex-direction: column;
}

.model-name {
  font-weight: 500;
}

.model-count {
  font-size: 0.875rem;
  color: #888;
}

.model-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.model-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.model-percent {
  width: 50px;
  text-align: right;
  color: #667eea;
  font-weight: 500;
}

/* 使用明细表格 */
.usage-table-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
}

.usage-table-section h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #888;
}

.usage-table {
  width: 100%;
  border-collapse: collapse;
}

.usage-table th,
.usage-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.usage-table th {
  color: #666;
  font-weight: 500;
  font-size: 0.875rem;
}

.usage-table td {
  font-size: 0.875rem;
}

.model-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  font-size: 0.75rem;
}

.cost {
  color: #667eea;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.status-badge.success {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.status-badge.failed {
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #888;
  font-size: 0.875rem;
}

/* 响应式 */
@media (max-width: 1024px) {
  .chart-section {
    grid-template-columns: 1fr;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
}
</style>
