<template>
  <div class="console-wrapper">
    <!-- 顶部导航栏 -->
    <header class="console-header-bar">
      <div class="header-left">
        <div class="logo" @click="navigateTo('/')">
          <span class="logo-icon">C</span>
          <span class="logo-text">COCO CLAW</span>
        </div>
      </div>
      <nav class="header-nav">
        <a href="#" @click.prevent="navigateTo('/')">首页</a>
        <a href="#" @click.prevent="navigateTo('/shop')">商城</a>
        <a href="#" @click.prevent="navigateTo('/skills')">Skills</a>
        <a href="#" class="active">控制台</a>
        <a href="#">文档</a>
      </nav>
      <div class="header-right">
        <div class="user-info" v-if="isLoggedIn">
          <span class="user-avatar">{{ userInfo?.username?.[0]?.toUpperCase() || 'U' }}</span>
          <span class="user-name">{{ userInfo?.username || '用户' }}</span>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </div>
        <NuxtLink v-else to="/login" class="login-btn">登录</NuxtLink>
      </div>
    </header>

    <div class="console-container">
      <!-- 左侧导航 -->
      <aside class="console-sidebar">
        <nav class="console-nav">
          <button 
            v-for="item in navItems" 
            :key="item.id"
            :class="['console-nav-item', { active: activeSection === item.id }]"
            @click="activeSection = item.id"
          >
            <span v-html="item.icon"></span>
            <span class="nav-label">{{ item.name }}</span>
          </button>
        </nav>
        <div class="console-sidebar-footer">
          <button class="console-nav-item" @click="navigateTo('/')">
            <span>🏠</span>
            <span class="nav-label">返回首页</span>
          </button>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="console-main">
        <!-- 概览页面 -->
        <div v-show="activeSection === 'overview'" class="console-section active">
          <div class="section-header">
            <h1>账户概览</h1>
          </div>
          
          <!-- 统计卡片 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon token-icon">💰</div>
              <div class="stat-content">
                <div class="stat-value">{{ formatNumber(userStats.tokenBalance) }}</div>
                <div class="stat-label">TOKEN余额</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon usage-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">{{ formatNumber(userStats.totalUsed) }}</div>
                <div class="stat-label">已使用TOKEN</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon package-icon">📦</div>
              <div class="stat-content">
                <div class="stat-value">{{ userStats.packageDays || 0 }}天</div>
                <div class="stat-label">套餐剩余</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon keys-icon">🔑</div>
              <div class="stat-content">
                <div class="stat-value">{{ apiKeys.length }}</div>
                <div class="stat-label">API Keys</div>
              </div>
            </div>
          </div>

          <!-- 当前资源和快速操作 -->
          <div class="dashboard-row">
            <div class="dashboard-card current-resource">
              <h3>当前资源</h3>
              <div class="resource-info">
                <div class="resource-type" v-if="currentSubscription">
                  <span class="resource-icon">{{ currentSubscription.icon }}</span>
                  <span class="resource-name">{{ currentSubscription.name }}</span>
                  <span class="badge badge-green">使用中</span>
                </div>
                <div class="resource-balance" v-if="userStats.tokenBalance > 0">
                  <span>余额充值</span>
                  <span class="balance-value">{{ formatNumber(userStats.tokenBalance) }}</span>
                </div>
              </div>
            </div>
            <div class="dashboard-card quick-actions">
              <h3>快速操作</h3>
              <div class="action-buttons">
                <button class="action-btn" @click="activeSection = 'redeem'">
                  <span class="action-icon">🎫</span>
                  <span>兑换码</span>
                </button>
                <button class="action-btn" @click="activeSection = 'apikey'">
                  <span class="action-icon">🔑</span>
                  <span>新建Key</span>
                </button>
                <button class="action-btn" @click="activeSection = 'binding'">
                  <span class="action-icon">🔗</span>
                  <span>绑定</span>
                </button>
                <button class="action-btn primary" @click="navigateTo('/shop')">
                  <span class="action-icon">💳</span>
                  <span>充值</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- API Key 管理页面 -->
        <div v-show="activeSection === 'apikey'" class="console-section">
          <div class="section-header">
            <h1>API Key 管理</h1>
            <button class="btn-primary" @click="showCreateApiKeyModal = true">
              <span>+</span> 新建 Key
            </button>
          </div>

          <div class="apikey-list">
            <div v-for="key in apiKeys" :key="key.id" class="apikey-card">
              <div class="apikey-header">
                <span class="apikey-name">{{ key.name }}</span>
                <span :class="['badge', key.status === 'active' ? 'badge-green' : 'badge-gray']">
                  {{ key.status === 'active' ? '生效中' : '已禁用' }}
                </span>
              </div>
              <div class="apikey-content">
                <code>{{ maskApiKey(key.key) }}</code>
                <button class="copy-btn" @click="copyToClipboard(key.key)">复制</button>
              </div>
              <div class="apikey-meta">
                <span>创建时间: {{ key.createdAt }}</span>
                <span>最后使用: {{ key.lastUsed || '暂无' }}</span>
              </div>
            </div>
            <div v-if="apiKeys.length === 0" class="empty-state">
              <p>暂无 API Key</p>
              <button class="btn-primary" @click="showCreateApiKeyModal = true">创建第一个 Key</button>
            </div>
          </div>

          <!-- API 调用说明 -->
          <div class="usage-guide">
            <h3>API 调用示例</h3>
            <div class="code-block">
              <pre>curl -X POST https://api.cococlaws.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</pre>
            </div>
          </div>
        </div>

        <!-- 资源管理页面 -->
        <div v-show="activeSection === 'resource'" class="console-section">
          <div class="section-header">
            <h1>资源管理</h1>
          </div>

          <!-- 订阅套餐列表 -->
          <div class="resource-section">
            <h3>订阅套餐</h3>
            <div class="subscription-list">
              <div 
                v-for="sub in subscriptions" 
                :key="sub.id"
                :class="['subscription-card', { active: currentSubscription?.id === sub.id }]"
                @click="switchToSubscription(sub)"
              >
                <div class="sub-header">
                  <span class="sub-icon">{{ sub.icon }}</span>
                  <span class="sub-name">{{ sub.name }}</span>
                  <span v-if="currentSubscription?.id === sub.id" class="badge badge-green">当前使用</span>
                </div>
                <div class="sub-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: sub.usagePercent + '%' }"></div>
                  </div>
                  <div class="progress-info">
                    <span>已用 {{ formatNumber(sub.usedQuota) }}</span>
                    <span>剩余 {{ formatNumber(sub.remainingQuota) }}</span>
                  </div>
                </div>
                <div class="sub-footer">
                  <span>有效期至: {{ sub.expireTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 余额 -->
          <div class="resource-section">
            <h3>余额</h3>
            <div 
              :class="['balance-card', { active: userStats.useBalance }]"
              @click="toggleBalancePayment"
            >
              <div class="balance-info">
                <span class="balance-icon">💰</span>
                <span class="balance-amount">${{ userStats.tokenBalance.toFixed(2) }}</span>
              </div>
              <div class="balance-actions">
                <button class="btn-outline" @click.stop="navigateTo('/shop')">充值</button>
                <span v-if="userStats.useBalance" class="badge badge-green">按量付费中</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 兑换码页面 -->
        <div v-show="activeSection === 'redeem'" class="console-section">
          <div class="section-header">
            <h1>兑换码</h1>
          </div>

          <div class="redeem-form">
            <input 
              v-model="redeemCode" 
              type="text" 
              placeholder="请输入兑换码"
              class="redeem-input"
              @keyup.enter="handleRedeem"
            />
            <button class="btn-primary" @click="handleRedeem" :disabled="redeeming">
              {{ redeeming ? '兑换中...' : '兑换' }}
            </button>
          </div>
          <p class="redeem-hint">购买后获得的兑换码可在此处激活</p>

          <!-- 兑换历史 -->
          <div class="redeem-history">
            <h3>兑换记录</h3>
            <div v-if="redeemHistory.length > 0" class="history-list">
              <div v-for="record in redeemHistory" :key="record.id" class="history-item">
                <div class="history-info">
                  <span class="history-code">{{ record.code }}</span>
                  <span class="badge badge-purple">{{ record.packageName }}</span>
                </div>
                <div class="history-meta">
                  <span>{{ record.redeemedAt }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>暂无兑换记录</p>
            </div>
          </div>
        </div>

        <!-- 订单管理页面 -->
        <div v-show="activeSection === 'orders'" class="console-section">
          <div class="section-header">
            <h1>订单管理</h1>
          </div>

          <div class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-card">
              <div class="order-header">
                <span class="order-id">订单号: {{ order.id }}</span>
                <span :class="['badge', getOrderStatusClass(order.status)]">
                  {{ getOrderStatusText(order.status) }}
                </span>
              </div>
              <div class="order-items">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <span>{{ item.icon }} {{ item.name }}</span>
                  <span>× {{ item.qty }}</span>
                  <span class="price">¥{{ item.price }}</span>
                </div>
              </div>
              <div class="order-footer">
                <span>总计: <strong class="total-price">¥{{ order.total }}</strong></span>
                <span>{{ order.createdAt }}</span>
              </div>
            </div>
            <div v-if="orders.length === 0" class="empty-state">
              <p>暂无订单记录</p>
            </div>
          </div>
        </div>

        <!-- 第三方绑定页面 -->
        <div v-show="activeSection === 'binding'" class="console-section">
          <div class="section-header">
            <h1>第三方绑定</h1>
          </div>

          <div class="binding-list">
            <div v-for="binding in thirdPartyBindings" :key="binding.id" class="binding-card">
              <div class="binding-info">
                <span class="binding-icon">{{ binding.icon }}</span>
                <div class="binding-details">
                  <span class="binding-name">{{ binding.name }}</span>
                  <span class="binding-status">
                    {{ binding.bound ? '已绑定: ' + binding.account : '未绑定' }}
                  </span>
                </div>
              </div>
              <button 
                :class="['btn', binding.bound ? 'btn-outline' : 'btn-primary']"
                @click="handleThirdPartyBinding(binding)"
              >
                {{ binding.bound ? '重新绑定' : '立即绑定' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 使用记录页面 -->
        <div v-show="activeSection === 'usage'" class="console-section">
          <div class="section-header">
            <h1>使用记录</h1>
          </div>

          <div class="usage-stats">
            <div class="usage-stat-row">
              <div class="usage-stat">
                <span class="stat-label">总使用量</span>
                <span class="stat-value">{{ formatNumber(usageStats.totalUsed) }}</span>
              </div>
              <div class="usage-stat">
                <span class="stat-label">今日使用</span>
                <span class="stat-value">{{ formatNumber(usageStats.todayUsed) }}</span>
              </div>
              <div class="usage-stat">
                <span class="stat-label">本月使用</span>
                <span class="stat-value">{{ formatNumber(usageStats.monthUsed) }}</span>
              </div>
            </div>
            <div class="usage-stat-row">
              <div class="usage-stat">
                <span class="stat-label">消费金额</span>
                <span class="stat-value">${{ usageStats.totalCost.toFixed(2) }}</span>
              </div>
              <div class="usage-stat">
                <span class="stat-label">调用次数</span>
                <span class="stat-value">{{ formatNumber(usageStats.callCount) }}</span>
              </div>
            </div>
          </div>

          <!-- 使用趋势图 -->
          <div class="usage-chart">
            <h3>使用趋势</h3>
            <div class="chart-placeholder">
              <p>图表加载中...</p>
            </div>
          </div>

          <!-- 使用明细 -->
          <div class="usage-records">
            <h3>使用明细</h3>
            <table class="records-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>模型</th>
                  <th>输入</th>
                  <th>输出</th>
                  <th>消费</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in usageRecords" :key="record.id">
                  <td>{{ record.time }}</td>
                  <td>{{ record.model }}</td>
                  <td>{{ formatNumber(record.input) }}</td>
                  <td>{{ formatNumber(record.output) }}</td>
                  <td>${{ record.cost.toFixed(4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- 创建 API Key 弹窗 -->
    <div v-if="showCreateApiKeyModal" class="modal-overlay" @click.self="showCreateApiKeyModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>新建 API Key</h3>
          <button class="modal-close" @click="showCreateApiKeyModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Key 名称</label>
            <input v-model="newApiKeyName" type="text" placeholder="例如: 开发测试" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" @click="showCreateApiKeyModal = false">取消</button>
          <button class="btn-primary" @click="createApiKey">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showFailToast } from 'vant'

const router = useRouter()

// 登录状态
const isLoggedIn = ref(false)
const userInfo = ref(null)

// 导航
const activeSection = ref('overview')
const navItems = [
  { id: 'overview', name: '概览', icon: '📊' },
  { id: 'apikey', name: 'API Key', icon: '🔑' },
  { id: 'resource', name: '资源管理', icon: '💎' },
  { id: 'redeem', name: '兑换码', icon: '🎫' },
  { id: 'orders', name: '订单管理', icon: '📦' },
  { id: 'binding', name: '第三方绑定', icon: '🔗' },
  { id: 'usage', name: '使用记录', icon: '📈' }
]

// 用户统计数据
const userStats = ref({
  tokenBalance: 1250,
  totalUsed: 3420,
  packageDays: 28,
  useBalance: false
})

// API Keys
const apiKeys = ref([
  {
    id: 1,
    name: '开发测试',
    key: 'sk-cococlaws-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    status: 'active',
    createdAt: '2026-04-01',
    lastUsed: '2026-04-15 10:30'
  }
])
const showCreateApiKeyModal = ref(false)
const newApiKeyName = ref('')

// 订阅套餐
const subscriptions = ref([
  {
    id: 1,
    name: '月卡会员',
    icon: '🌟',
    usedQuota: 15000,
    remainingQuota: 15000,
    totalQuota: 30000,
    usagePercent: 50,
    expireTime: '2026-05-01',
    isActive: true
  }
])

const currentSubscription = computed(() => {
  return subscriptions.value.find(s => s.isActive)
})

// 兑换码
const redeemCode = ref('')
const redeeming = ref(false)
const redeemHistory = ref([
  { id: 1, code: 'NEWUSER500', packageName: '新手礼包', redeemedAt: '2026-04-10' }
])

// 订单
const orders = ref([
  {
    id: 'CC20260415001',
    status: 'paid',
    items: [{ id: 1, icon: '🌟', name: '月卡会员', qty: 1, price: 49 }],
    total: 49,
    createdAt: '2026-04-15 14:30'
  }
])

// 第三方绑定
const thirdPartyBindings = ref([
  { id: 1, name: 'AskToken', icon: '🤖', bound: true, account: 'user***@email.com' },
  { id: 2, name: 'OpenAI', icon: '💬', bound: false, account: '' }
])

// 使用记录
const usageStats = ref({
  totalUsed: 3420,
  todayUsed: 156,
  monthUsed: 12580,
  totalCost: 8.56,
  callCount: 328
})

const usageRecords = ref([
  { id: 1, time: '2026-04-15 14:30', model: 'gpt-3.5-turbo', input: 120, output: 340, cost: 0.0045 },
  { id: 2, time: '2026-04-15 14:25', model: 'gpt-3.5-turbo', input: 85, output: 220, cost: 0.0032 }
])

// 初始化
onMounted(() => {
  checkLoginStatus()
})

const checkLoginStatus = () => {
  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    isLoggedIn.value = true
    userInfo.value = JSON.parse(storedUser)
    loadUserData()
  }
}

const loadUserData = async () => {
  // 模拟加载用户数据
  try {
    // 实际项目中这里调用 API
    // const res = await axios.get('/api/user/dashboard')
  } catch (error) {
    console.error('加载用户数据失败')
  }
}

// 导航
const navigateTo = (path) => {
  router.push(path)
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  userInfo.value = null
  router.push('/login')
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

// 格式化 API Key
const maskApiKey = (key) => {
  if (!key) return ''
  return key.substring(0, 20) + '...' + key.substring(key.length - 8)
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccessToast('已复制到剪贴板')
  } catch {
    showFailToast('复制失败')
  }
}

// 创建 API Key
const createApiKey = async () => {
  if (!newApiKeyName.value.trim()) {
    showToast('请输入 Key 名称')
    return
  }
  
  // 模拟创建
  const newKey = {
    id: Date.now(),
    name: newApiKeyName.value,
    key: 'sk-cococlaws-' + Math.random().toString(36).substring(2, 34),
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    lastUsed: null
  }
  
  apiKeys.value.unshift(newKey)
  showCreateApiKeyModal.value = false
  newApiKeyName.value = ''
  showSuccessToast('API Key 创建成功')
}

// 切换订阅
const switchToSubscription = (sub) => {
  subscriptions.value.forEach(s => s.isActive = s.id === sub.id)
  showSuccessToast('已切换到 ' + sub.name)
}

// 切换余额支付
const toggleBalancePayment = () => {
  userStats.value.useBalance = !userStats.value.useBalance
  showToast(userStats.value.useBalance ? '已启用余额支付' : '已关闭余额支付')
}

// 兑换码
const handleRedeem = async () => {
  if (!redeemCode.value.trim()) {
    showToast('请输入兑换码')
    return
  }
  
  redeeming.value = true
  try {
    // 模拟兑换
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccessToast('兑换成功！已获得月卡会员')
    redeemHistory.value.unshift({
      id: Date.now(),
      code: redeemCode.value,
      packageName: '月卡会员',
      redeemedAt: new Date().toLocaleString()
    })
    redeemCode.value = ''
  } catch {
    showFailToast('兑换失败')
  } finally {
    redeeming.value = false
  }
}

// 第三方绑定
const handleThirdPartyBinding = (binding) => {
  showToast('跳转到绑定页面...')
}

// 订单状态
const getOrderStatusClass = (status) => {
  const map = {
    pending: 'badge-yellow',
    paid: 'badge-green',
    processing: 'badge-blue',
    refunded: 'badge-red'
  }
  return map[status] || 'badge-gray'
}

const getOrderStatusText = (status) => {
  const map = {
    pending: '待支付',
    paid: '已支付',
    processing: '处理中',
    refunded: '已退款'
  }
  return map[status] || status
}

useHead({ title: '控制台 - COCO CLAW' })
</script>

<style scoped>
/* 全局布局 */
.console-wrapper {
  min-height: 100vh;
  background: #0f0f23;
  color: #e2e8f0;
}

/* 顶部导航栏 */
.console-header-bar {
  height: 64px;
  background: #1a1a2e;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: white;
}

.logo-text {
  font-weight: 700;
  font-size: 1.125rem;
  color: white;
}

.header-nav {
  display: flex;
  gap: 2rem;
}

.header-nav a {
  color: rgba(165, 180, 252, 0.7);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
}

.header-nav a:hover,
.header-nav a.active {
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  color: white;
  font-size: 0.875rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: rgba(165, 180, 252, 0.7);
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(99, 102, 241, 0.1);
  color: white;
}

.login-btn {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

/* 主容器 */
.console-container {
  display: flex;
  min-height: calc(100vh - 64px);
}

/* 侧边栏 */
.console-sidebar {
  width: 220px;
  background: #1a1a2e;
  border-right: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  flex-direction: column;
}

.console-nav {
  flex: 1;
  padding: 1rem 0.75rem;
}

.console-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(165, 180, 252, 0.7);
  font-size: 0.9375rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
}

.console-nav-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: white;
}

.console-nav-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(147, 112, 219, 0.1));
  color: #67e8f9;
}

.console-sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
}

/* 主内容区 */
.console-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.console-section {
  display: none;
}

.console-section.active {
  display: block;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.4), rgba(88, 28, 135, 0.4));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.token-icon { background: rgba(251, 191, 36, 0.2); }
.usage-icon { background: rgba(99, 102, 241, 0.2); }
.package-icon { background: rgba(34, 197, 94, 0.2); }
.keys-icon { background: rgba(168, 85, 247, 0.2); }

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  color: rgba(165, 180, 252, 0.6);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Dashboard 布局 */
.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.dashboard-card {
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.4), rgba(88, 28, 135, 0.4));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
}

.dashboard-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.resource-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-type {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.resource-icon {
  font-size: 2rem;
}

.resource-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.resource-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  color: rgba(165, 180, 252, 0.7);
}

.balance-value {
  font-weight: 700;
  color: #34d399;
}

/* 快速操作 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  color: rgba(165, 180, 252, 0.8);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  color: white;
}

.action-btn.primary {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2));
  border-color: rgba(249, 115, 22, 0.3);
  color: #fbbf24;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.3));
}

/* 徽章 */
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-green { background: rgba(34, 197, 94, 0.2); color: #34d399; }
.badge-yellow { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-red { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.badge-gray { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
.badge-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }

/* 按钮 */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: rgba(165, 180, 252, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(99, 102, 241, 0.1);
  color: white;
}

/* API Key 列表 */
.apikey-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.apikey-card {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
}

.apikey-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.apikey-name {
  font-weight: 600;
  color: white;
}

.apikey-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.apikey-content code {
  flex: 1;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  color: rgba(165, 180, 252, 0.8);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #60a5fa;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(99, 102, 241, 0.3);
  color: white;
}

.apikey-meta {
  display: flex;
  gap: 2rem;
  color: rgba(165, 180, 252, 0.5);
  font-size: 0.8125rem;
}

/* 使用指南 */
.usage-guide {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
}

.usage-guide h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.code-block {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.code-block pre {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8125rem;
  color: #67e8f9;
  line-height: 1.6;
  margin: 0;
}

/* 资源管理 */
.resource-section {
  margin-bottom: 2rem;
}

.resource-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.subscription-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subscription-card {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.subscription-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
}

.subscription-card.active {
  border-color: #34d399;
  background: rgba(34, 197, 94, 0.1);
}

.sub-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.sub-icon {
  font-size: 1.5rem;
}

.sub-name {
  flex: 1;
  font-weight: 600;
  color: white;
}

.sub-progress {
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 8px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: rgba(165, 180, 252, 0.6);
}

.sub-footer {
  font-size: 0.8125rem;
  color: rgba(165, 180, 252, 0.5);
}

/* 余额卡片 */
.balance-card {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.balance-card:hover {
  border-color: rgba(99, 102, 241, 0.4);
}

.balance-card.active {
  border-color: #34d399;
  background: rgba(34, 197, 94, 0.1);
}

.balance-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.balance-icon {
  font-size: 1.5rem;
}

.balance-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #34d399;
}

.balance-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 兑换码 */
.redeem-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.redeem-input {
  flex: 1;
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9375rem;
}

.redeem-input::placeholder {
  color: rgba(165, 180, 252, 0.5);
}

.redeem-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.redeem-hint {
  color: rgba(165, 180, 252, 0.5);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.redeem-history {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
}

.redeem-history h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.history-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.history-code {
  font-family: monospace;
  color: rgba(165, 180, 252, 0.8);
}

.history-meta {
  color: rgba(165, 180, 252, 0.5);
  font-size: 0.8125rem;
}

/* 订单列表 */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-family: monospace;
  color: rgba(165, 180, 252, 0.7);
  font-size: 0.875rem;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  color: rgba(165, 180, 252, 0.8);
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item .price {
  color: #fbbf24;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(165, 180, 252, 0.6);
  font-size: 0.875rem;
}

.total-price {
  color: #fbbf24;
  font-size: 1rem;
}

/* 第三方绑定 */
.binding-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.binding-card {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.binding-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.binding-icon {
  font-size: 2rem;
}

.binding-name {
  display: block;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.binding-status {
  font-size: 0.875rem;
  color: rgba(165, 180, 252, 0.6);
}

/* 使用记录 */
.usage-stats {
  margin-bottom: 2rem;
}

.usage-stat-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.usage-stat {
  flex: 1;
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: center;
}

.usage-stat .stat-label {
  display: block;
  color: rgba(165, 180, 252, 0.6);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.usage-stat .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #67e8f9;
}

.usage-chart {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.usage-chart h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(165, 180, 252, 0.5);
}

.usage-records {
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
}

.usage-records h3 {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.records-table th {
  color: rgba(165, 180, 252, 0.6);
  font-weight: 500;
  font-size: 0.8125rem;
}

.records-table td {
  color: rgba(165, 180, 252, 0.8);
  font-size: 0.875rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(165, 180, 252, 0.5);
}

.empty-state p {
  margin-bottom: 1rem;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 1rem;
  width: 90%;
  max-width: 480px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
}

.modal-close {
  background: transparent;
  border: none;
  color: rgba(165, 180, 252, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: white;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: rgba(165, 180, 252, 0.8);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  background: rgba(30, 58, 95, 0.4);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9375rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
}

/* 响应式 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-row {
    grid-template-columns: 1fr;
  }
  
  .header-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .console-sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .console-sidebar.open {
    transform: translateX(0);
  }
  
  .console-main {
    padding: 1rem;
  }
}
</style>
