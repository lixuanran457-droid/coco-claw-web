<template>
  <div class="home-wrapper">
    <!-- 顶部导航栏 -->
    <header class="home-header">
      <div class="header-container">
        <div class="logo" @click="scrollToTop">
          <div class="logo-icon">C</div>
          <div class="logo-text">
            <span class="brand-name">COCO CLAW</span>
            <span class="brand-slogan">真正便宜的 TOKEN</span>
          </div>
        </div>
        <nav class="main-nav">
          <a href="#" class="nav-link active">首页</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('/shop')">商城</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('/skills')">Skills</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('/my-api')">控制台</a>
          <a href="#" class="nav-link">文档</a>
        </nav>
        <div class="header-actions">
          <div v-if="isLoggedIn" class="user-menu">
            <span class="user-avatar">{{ userInitial }}</span>
            <NuxtLink to="/my-api" class="btn-primary">控制台</NuxtLink>
          </div>
          <template v-else>
            <NuxtLink to="/login" class="btn-text">登录</NuxtLink>
            <NuxtLink to="/register" class="btn-primary">立即开始</NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">🔥 新用户首充50元送10元</div>
        <h1 class="hero-title">
          <span class="gradient-text">AI 触手可及</span>
        </h1>
        <p class="hero-subtitle">
          聚合 OpenAI、Claude、Gemini 等顶级 AI 模型<br/>
          最便宜的 TOKEN 价格，让 AI 普惠每个人
        </p>
        <div class="hero-actions">
          <NuxtLink to="/register" class="btn-hero-primary">
            <span>免费试用</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
          <NuxtLink to="/shop" class="btn-hero-secondary">查看套餐</NuxtLink>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">50K+</span>
            <span class="stat-desc">活跃用户</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">99.9%</span>
            <span class="stat-desc">服务可用性</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">100ms</span>
            <span class="stat-desc">平均响应</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        <div class="floating-cards">
          <div class="float-card card-1">
            <span class="card-icon">⚡</span>
            <span class="card-text">极速响应</span>
          </div>
          <div class="float-card card-2">
            <span class="card-icon">🔒</span>
            <span class="card-text">安全可靠</span>
          </div>
          <div class="float-card card-3">
            <span class="card-icon">💰</span>
            <span class="card-text">价格实惠</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能入口 -->
    <section class="features-section">
      <div class="section-container">
        <div class="feature-cards">
          <NuxtLink to="/shop" class="feature-card">
            <div class="feature-icon">🛒</div>
            <h3>TOKEN 商城</h3>
            <p>多种套餐按需选择</p>
          </NuxtLink>
          <NuxtLink to="/skills" class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>AI Skills</h3>
            <p>专业场景智能体</p>
          </NuxtLink>
          <NuxtLink to="/my-api" class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>控制台</h3>
            <p>管理 API 和资源</p>
          </NuxtLink>
          <a href="#" class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>开发者文档</h3>
            <p>快速接入指南</p>
          </a>
        </div>
      </div>
    </section>

    <!-- 精选套餐 -->
    <section class="packages-section">
      <div class="section-container">
        <div class="section-header">
          <h2>精选套餐</h2>
          <p>高性价比，满足不同需求</p>
        </div>
        <div class="packages-grid">
          <div v-for="pkg in packages" :key="pkg.id" :class="['package-card', { popular: pkg.popular }]">
            <div v-if="pkg.popular" class="popular-tag">🔥 推荐</div>
            <div class="package-icon">{{ pkg.icon }}</div>
            <h3 class="package-name">{{ pkg.name }}</h3>
            <p class="package-desc">{{ pkg.desc }}</p>
            <div class="package-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ pkg.price }}</span>
              <span class="price-unit">/{{ pkg.unit }}</span>
            </div>
            <div class="package-original" v-if="pkg.original > pkg.price">
              原价 ¥{{ pkg.original }}
            </div>
            <ul class="package-features">
              <li v-for="(feature, i) in pkg.features" :key="i">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
            <button class="package-btn" @click="handleBuy(pkg)">立即购买</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 为什么选择我们 -->
    <section class="advantages-section">
      <div class="section-container">
        <div class="section-header">
          <h2>为什么选择我们</h2>
          <p>专业可靠，值得信赖</p>
        </div>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>极速响应</h3>
            <p>智能路由优化，平均响应时间 &lt; 100ms，告别漫长等待</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🔒</div>
            <h3>安全可靠</h3>
            <p>企业级加密保护，数据隔离存储，您的隐私绝对安全</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">💰</div>
            <h3>价格实惠</h3>
            <p>官方价格30%-70%折扣，按需付费，拒绝浪费</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🎯</div>
            <h3>稳定可用</h3>
            <p>多节点部署，99.9% 服务可用性保障，业务不中断</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">💬</div>
            <h3>全模型支持</h3>
            <p>OpenAI、Claude、Gemini 等主流模型一键切换</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h3>便捷接入</h3>
            <p>兼容 OpenAI API，零代码改造，即接即用</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <div class="section-container">
        <div class="section-header">
          <h2>常见问题</h2>
        </div>
        <div class="faq-list">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggleFaq(index)">
              <span>{{ faq.q }}</span>
              <svg :class="['faq-arrow', { open: openFaq === index }]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div :class="['faq-answer', { open: openFaq === index }]">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="logo">
              <div class="logo-icon">C</div>
              <span class="logo-text">COCO CLAW</span>
            </div>
            <p class="footer-desc">
              聚合顶级 AI 模型<br/>
              让 AI 普惠每个人
            </p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>产品</h4>
              <a href="#">TOKEN 商城</a>
              <a href="#">AI Skills</a>
              <a href="#">开发者文档</a>
            </div>
            <div class="link-group">
              <h4>支持</h4>
              <a href="#">常见问题</a>
              <a href="#">联系客服</a>
              <a href="#">使用条款</a>
            </div>
            <div class="link-group">
              <h4>联系我们</h4>
              <a href="#">商务合作</a>
              <a href="#">技术支持</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 COCO CLAW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 登录状态
const isLoggedIn = ref(false)
const userInfo = ref(null)

// 用户首字母
const userInitial = computed(() => {
  return userInfo.value?.username?.[0]?.toUpperCase() || 'U'
})

// FAQ
const openFaq = ref(null)
const faqs = [
  { q: 'COCO CLAW 是什么？', a: 'COCO CLAW 是一个聚合多个顶级 AI 模型的平台，包括 OpenAI GPT、Claude、Gemini 等，为用户提供稳定、快速、便宜的 AI 服务。' },
  { q: '充值后多久到账？', a: '支付成功后，TOKEN 通常会在几秒钟内到账。如遇延迟，请联系客服。' },
  { q: '支持哪些支付方式？', a: '我们支持支付宝、微信支付、信用卡等多种支付方式。' },
  { q: 'TOKEN 可以退款吗？', a: '未使用的 TOKEN 支持退款，请联系客服处理。' },
  { q: '如何获取 API Key？', a: '注册登录后，在控制台页面可以免费创建一个 API Key。' }
]

// 套餐数据
const packages = [
  {
    id: 1,
    name: '体验版',
    icon: '🌱',
    desc: '适合新手试用',
    price: 9.9,
    original: 19.9,
    unit: '月',
    popular: false,
    features: ['100次/天', '基础模型', '社区支持']
  },
  {
    id: 2,
    name: '月卡会员',
    icon: '🌟',
    desc: '性价比之选',
    price: 49,
    original: 79,
    unit: '月',
    popular: true,
    features: ['1000次/天', '全部模型', '优先客服', '无广告']
  },
  {
    id: 3,
    name: '季卡会员',
    icon: '🚀',
    desc: '进阶用户推荐',
    price: 129,
    original: 199,
    unit: '季',
    popular: false,
    features: ['1500次/天', '全部模型', '优先客服', '无广告', '专属福利']
  },
  {
    id: 4,
    name: '年卡会员',
    icon: '👑',
    desc: '长期用户首选',
    price: 399,
    original: 599,
    unit: '年',
    popular: false,
    features: ['2000次/天', '全部模型', '专属客服', '无广告', '专属福利', '优先体验']
  }
]

onMounted(() => {
  checkLoginStatus()
  // 模拟加载配置
  loadConfig()
})

const checkLoginStatus = () => {
  const storedUser = localStorage.getItem('userInfo')
  if (storedUser) {
    isLoggedIn.value = true
    userInfo.value = JSON.parse(storedUser)
  }
}

const loadConfig = async () => {
  // 从 API 或本地加载配置
}

const navigateTo = (path) => {
  router.push(path)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const handleBuy = (pkg) => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  router.push('/shop')
}

useHead({ title: 'COCO CLAW - 真正便宜的 TOKEN' })
</script>

<style scoped>
/* 全局变量 */
.home-wrapper {
  --primary: #f97316;
  --primary-dark: #ea580c;
  --accent: #3b82f6;
  --bg-dark: #0f0f23;
  --bg-card: rgba(30, 58, 95, 0.4);
  --border: rgba(99, 102, 241, 0.2);
  --text-primary: #ffffff;
  --text-secondary: rgba(165, 180, 252, 0.7);
  --text-muted: rgba(165, 180, 252, 0.5);
}

/* 通用样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-wrapper {
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text-primary);
}

/* Header */
.home-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.25rem;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 700;
  font-size: 1.125rem;
}

.brand-slogan {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.main-nav {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
  border-radius: 1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.btn-text {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9375rem;
  transition: color 0.2s;
}

.btn-text:hover {
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

/* Hero */
.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem;
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2));
  border: 1px solid rgba(249, 115, 22, 0.3);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), #fbbf24, var(--primary));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-hero-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
}

.btn-hero-secondary {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--accent);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-hero-secondary:hover {
  background: rgba(99, 102, 241, 0.2);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #67e8f9, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

.hero-visual {
  flex: 1;
  position: relative;
  height: 400px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: var(--primary);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: var(--accent);
  top: 20%;
  right: 10%;
  animation-delay: -3s;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -60%) scale(1.1); }
}

.floating-cards {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.float-card {
  background: rgba(30, 58, 95, 0.6);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: fit-content;
  animation: slideIn 0.5s ease-out backwards;
}

.card-1 { animation-delay: 0.2s; align-self: flex-start; }
.card-2 { animation-delay: 0.4s; align-self: center; }
.card-3 { animation-delay: 0.6s; align-self: flex-end; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.card-icon {
  font-size: 1.5rem;
}

.card-text {
  font-weight: 600;
  font-size: 0.9375rem;
}

/* Section 通用 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.section-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Features */
.features-section {
  padding: 3rem 0;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 12px 32px rgba(249, 115, 22, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Packages */
.packages-section {
  padding: 5rem 0;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.package-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.15);
}

.package-card.popular {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.15));
  border-color: var(--primary);
}

.popular-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.package-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.package-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.package-desc {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.package-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.price-symbol {
  font-size: 1.25rem;
  color: var(--primary);
}

.price-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary);
}

.price-unit {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.package-original {
  color: var(--text-muted);
  font-size: 0.875rem;
  text-decoration: line-through;
  margin-bottom: 1.5rem;
}

.package-features {
  list-style: none;
  margin-bottom: 1.5rem;
}

.package-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.package-features li:last-child {
  border-bottom: none;
}

.package-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s;
}

.package-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
}

/* Advantages */
.advantages-section {
  padding: 5rem 0;
  background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.05), transparent);
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.advantage-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.advantage-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.advantage-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.advantage-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.advantage-card p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

/* FAQ */
.faq-section {
  padding: 5rem 0;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.faq-question:hover {
  background: rgba(99, 102, 241, 0.1);
}

.faq-arrow {
  transition: transform 0.3s;
}

.faq-arrow.open {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer.open {
  max-height: 200px;
}

.faq-answer p {
  padding: 0 1.5rem 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Footer */
.home-footer {
  background: rgba(26, 26, 46, 0.8);
  border-top: 1px solid var(--border);
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: flex;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  flex: 1;
}

.footer-brand .logo {
  margin-bottom: 1rem;
}

.footer-desc {
  color: var(--text-muted);
  line-height: 1.8;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.link-group h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.link-group a {
  display: block;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.375rem 0;
  transition: color 0.2s;
}

.link-group a:hover {
  color: white;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-visual {
    display: none;
  }
  
  .feature-cards,
  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .footer-main {
    flex-direction: column;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .feature-cards,
  .packages-grid,
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 2rem;
  }
}
</style>
