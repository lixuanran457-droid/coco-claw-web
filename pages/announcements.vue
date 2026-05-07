<template>
  <div class="announcements-page">
    <!-- 顶部导航 -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="logo">🏠 COCO CLAW</div>
        <div class="nav-links">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/shop">商城</NuxtLink>
          <NuxtLink to="/skills">Skills</NuxtLink>
          <NuxtLink to="/pricing">定价</NuxtLink>
          <NuxtLink to="/docs">文档</NuxtLink>
          <NuxtLink to="/my-api">控制台</NuxtLink>
          <NuxtLink to="/login" class="btn-login">登录</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <header class="hero">
      <h1>公告中心</h1>
      <p>了解最新动态、活动信息和系统通知</p>
    </header>

    <!-- 公告列表 -->
    <main class="announcement-list">
      <div class="filter-bar">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-btn', { active: activeFilter === filter.value }]"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="announcements">
        <article 
          v-for="item in filteredAnnouncements" 
          :key="item.id" 
          class="announcement-card"
          :class="{ pinned: item.pinned }"
        >
          <div class="card-header">
            <div class="badges">
              <span class="type-badge" :class="`type-${item.type}`">
                {{ item.typeName }}
              </span>
              <span v-if="item.pinned" class="pinned-badge">置顶</span>
              <span v-if="item.priority === 2" class="urgent-badge">紧急</span>
            </div>
            <span class="date">{{ formatDate(item.createTime) }}</span>
          </div>
          
          <h3 class="card-title" @click="viewDetail(item)">
            {{ item.title }}
          </h3>
          
          <p class="card-content">{{ item.content }}</p>
          
          <div class="card-footer">
            <span class="views">👁 {{ item.viewCount }} 次阅读</span>
            <button class="read-more" @click="viewDetail(item)">阅读全文 →</button>
          </div>
        </article>
      </div>

      <div v-if="filteredAnnouncements.length === 0" class="empty-state">
        <p>暂无公告</p>
      </div>
    </main>

    <!-- 公告详情弹窗 -->
    <Transition name="fade">
      <div v-if="selectedAnnouncement" class="detail-overlay" @click.self="closeDetail">
        <div class="detail-modal">
          <button class="close-btn" @click="closeDetail">×</button>
          
          <div class="detail-header">
            <div class="badges">
              <span class="type-badge" :class="`type-${selectedAnnouncement.type}`">
                {{ selectedAnnouncement.typeName }}
              </span>
            </div>
            <span class="date">{{ formatDate(selectedAnnouncement.createTime) }}</span>
          </div>
          
          <h2 class="detail-title">{{ selectedAnnouncement.title }}</h2>
          
          <div class="detail-content">
            <p v-for="(paragraph, idx) in selectedAnnouncement.content.split('\n')" :key="idx">
              {{ paragraph }}
            </p>
          </div>
          
          <div v-if="selectedAnnouncement.linkUrl" class="detail-action">
            <a :href="selectedAnnouncement.linkUrl" target="_blank" class="action-btn">
              查看详情 →
            </a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2024 COCO CLAW. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Announcement {
  id: number
  title: string
  content: string
  type: number
  typeName: string
  priority: number
  pinned: boolean
  viewCount: number
  linkUrl?: string
  createTime: string
}

const activeFilter = ref('all')
const selectedAnnouncement = ref<Announcement | null>(null)

const filters = [
  { label: '全部', value: 'all' },
  { label: '系统公告', value: '0' },
  { label: '更新日志', value: '1' },
  { label: '活动公告', value: '2' },
  { label: '维护通知', value: '3' },
]

// 模拟数据
const announcements = ref<Announcement[]>([
  {
    id: 1,
    title: '🎉 COCO CLAW 正式上线！',
    content: '欢迎使用COCO CLAW AI服务平台！

我们提供稳定、快速、可靠的AI模型API服务，支持GPT-4、Claude、DeepSeek等多种模型。

主要特性：
• 高速响应：毫秒级延迟
• 价格实惠：按量计费，用多少付多少
• 稳定可靠：99.9% 服务可用性
• 文档完善：详细的API文档和示例代码

立即注册体验吧！',
    type: 0,
    typeName: '系统公告',
    priority: 1,
    pinned: true,
    viewCount: 1234,
    createTime: '2024-01-15 10:00:00',
  },
  {
    id: 2,
    title: '📢 新增 DeepSeek R1 模型',
    content: '我们已新增 DeepSeek R1 模型！

DeepSeek R1 是国产高性能推理模型，具有强大的逻辑推理能力。

价格优势：
• 输入：¥0.5/1M Tokens
• 输出：¥2/1M Tokens

欢迎体验！',
    type: 1,
    typeName: '更新日志',
    priority: 0,
    pinned: false,
    viewCount: 567,
    linkUrl: '/docs',
    createTime: '2024-01-10 14:30:00',
  },
  {
    id: 3,
    title: '⚠️ 系统维护通知',
    content: '尊敬的用户：

我们将于本周日凌晨进行系统升级维护。

维护时间：周日 02:00 - 04:00
影响范围：API服务可能短暂不可用

请您提前做好准备，如有紧急问题请联系客服。',
    type: 3,
    typeName: '维护通知',
    priority: 2,
    pinned: false,
    viewCount: 890,
    createTime: '2024-01-08 09:00:00',
  },
  {
    id: 4,
    title: '🎁 新年优惠活动',
    content: '新年特惠！充值享好礼！

活动内容：
• 充值满100元，赠送10元
• 充值满500元，赠送80元
• 充值满1000元，赠送200元

活动时间：即日起至1月31日',
    type: 2,
    typeName: '活动公告',
    priority: 1,
    pinned: false,
    viewCount: 456,
    createTime: '2024-01-05 12:00:00',
  },
])

const filteredAnnouncements = computed(() => {
  if (activeFilter.value === 'all') {
    return announcements.value
  }
  return announcements.value.filter(a => a.type.toString() === activeFilter.value)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const viewDetail = (item: Announcement) => {
  selectedAnnouncement.value = item
}

const closeDetail = () => {
  selectedAnnouncement.value = null
}
</script>

<style scoped>
.announcements-page {
  min-height: 100vh;
  background: #0a0a0f;
  color: #e0e0e0;
  font-family: 'Inter', 'PingFang SC', sans-serif;
}

/* 导航 */
.top-nav {
  padding: 1rem 2rem;
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
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

.nav-links a:hover {
  color: #fff;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  color: #fff !important;
}

/* Hero */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, rgba(10, 10, 15, 0) 100%);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero p {
  color: #888;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

/* 公告列表 */
.announcement-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.announcements {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.announcement-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.announcement-card:hover {
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.announcement-card.pinned {
  border-color: rgba(250, 173, 20, 0.5);
  background: linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(10, 10, 15, 0) 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
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

.pinned-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background: rgba(250, 173, 20, 0.2);
  color: #faad14;
}

.urgent-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}

.date {
  color: #666;
  font-size: 0.875rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: color 0.3s;
}

.card-title:hover {
  color: #667eea;
}

.card-content {
  color: #888;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.views {
  color: #666;
  font-size: 0.875rem;
}

.read-more {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s;
}

.read-more:hover {
  opacity: 0.8;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #666;
}

/* 详情弹窗 */
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.detail-modal {
  background: #1a1a2e;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
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
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-content {
  color: #ccc;
  line-height: 1.8;
}

.detail-content p {
  margin-bottom: 1rem;
}

.detail-action {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 2rem;
  color: #666;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
</style>
