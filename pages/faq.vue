<template>
  <div class="faq-page">
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
      <h1>常见问题</h1>
      <p>找到您想了解的问题答案</p>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索问题..."
          @input="filterFaqs"
        />
        <span class="search-icon">🔍</span>
      </div>
    </header>

    <!-- 分类导航 -->
    <div class="category-nav">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['category-btn', { active: activeCategory === cat.id }]"
        @click="activeCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- FAQ列表 -->
    <main class="faq-content">
      <div class="faq-list">
        <div 
          v-for="faq in filteredFaqs" 
          :key="faq.id" 
          class="faq-item"
        >
          <details>
            <summary>
              <span class="faq-question">{{ faq.question }}</span>
              <span class="expand-icon">▶</span>
            </summary>
            <div class="faq-answer">
              <p>{{ faq.answer }}</p>
              <div v-if="faq.example" class="faq-example">
                <strong>示例：</strong>{{ faq.example }}
              </div>
            </div>
          </details>
        </div>
      </div>

      <div v-if="filteredFaqs.length === 0" class="no-results">
        <p>没有找到相关问题</p>
        <p class="hint">您可以联系客服获取帮助</p>
        <a href="mailto:support@cococlaw.com" class="contact-btn">联系客服</a>
      </div>
    </main>

    <!-- 联系支持 -->
    <section class="contact-section">
      <h2>没有找到答案？</h2>
      <p>我们的客服团队随时为您服务</p>
      <div class="contact-methods">
        <div class="contact-item">
          <span class="icon">📧</span>
          <span>support@cococlaw.com</span>
        </div>
        <div class="contact-item">
          <span class="icon">💬</span>
          <span>在线客服 (9:00-18:00)</span>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2024 COCO CLAW. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部', icon: '📚' },
  { id: 'account', name: '账户', icon: '👤' },
  { id: 'billing', name: '计费', icon: '💰' },
  { id: 'api', name: 'API使用', icon: '🔌' },
  { id: 'technical', name: '技术问题', icon: '⚙️' },
]

const faqs = [
  // 账户相关
  {
    id: 1,
    category: 'account',
    question: '如何注册账号？',
    answer: '点击页面右上角的"注册"按钮，填写邮箱和密码即可完成注册。新用户注册即送100 Tokens体验额度。',
  },
  {
    id: 2,
    category: 'account',
    question: '忘记密码怎么办？',
    answer: '点击登录页的"忘记密码"，输入注册邮箱，我们会发送重置链接到您的邮箱。',
  },
  {
    id: 3,
    category: 'account',
    question: '如何修改密码？',
    answer: '登录后进入"个人中心 → 安全设置"，可以修改密码。建议定期更换密码以保护账户安全。',
  },
  {
    id: 4,
    category: 'account',
    question: '如何删除账号？',
    answer: '请联系客服申请账号注销。请注意，账号注销后将无法恢复，所有数据和余额将被清空。',
  },

  // 计费相关
  {
    id: 5,
    category: 'billing',
    question: 'Token是什么？如何计算？',
    answer: 'Token是文本处理的基本单位。API调用会消耗输入Token（您的提问）和输出Token（AI的回答）。',
    example: '1个中文汉字 ≈ 1-2 Tokens，1个英文单词 ≈ 1-1.5 Tokens',
  },
  {
    id: 6,
    category: 'billing',
    question: '余额会过期吗？',
    answer: '充值余额永不过期，可以随时使用。套餐余额（如月卡）在有效期内使用。',
  },
  {
    id: 7,
    category: 'billing',
    question: '如何查看消费明细？',
    answer: '登录后进入"控制台 → 使用记录"，可以查看详细的调用记录、消费金额和使用图表。',
  },
  {
    id: 8,
    category: 'billing',
    question: '支持哪些支付方式？',
    answer: '我们支持支付宝、微信支付、信用卡（Stripe）等多种支付方式。具体以支付页面显示为准。',
  },
  {
    id: 9,
    category: 'billing',
    question: '支持退款吗？',
    answer: '未使用的余额在购买后7天内可申请退款。需提供订单号和退款原因，联系客服处理。',
  },
  {
    id: 10,
    category: 'billing',
    question: '有免费额度吗？',
    answer: '新用户注册赠送100 Tokens体验额度，可用于测试API功能。体验额度有效期为30天。',
  },
  {
    id: 11,
    category: 'billing',
    question: '如何获取发票？',
    answer: '企业用户可在"控制台 → 发票管理"申请电子发票。个人用户可申请普通发票或增值税专用发票。',
  },

  // API使用
  {
    id: 12,
    category: 'api',
    question: '如何获取API Key？',
    answer: '登录后进入"控制台 → API密钥"，点击"创建新密钥"即可生成。請妥善保管您的Key，不要泄露给他人。',
  },
  {
    id: 13,
    category: 'api',
    question: 'API调用有频率限制吗？',
    answer: '免费用户：100请求/分钟，10万Tokens/天；付费用户：1000请求/分钟，无日额度限制。',
  },
  {
    id: 14,
    category: 'api',
    question: '如何查看API用量？',
    answer: '进入"控制台 → 使用记录"，可以查看每日、每周、每月的用量统计和消费明细。',
  },
  {
    id: 15,
    category: 'api',
    question: 'API调用失败怎么办？',
    answer: '检查错误码：401表示Key无效，429表示请求过快，500表示服务器错误。可前往状态页面查看服务状态。',
  },
  {
    id: 16,
    category: 'api',
    question: '支持流式输出吗？',
    answer: '是的，在请求参数中设置 stream: true 即可启用流式输出，适合长文本生成场景。',
  },
  {
    id: 17,
    category: 'api',
    question: '如何选择合适的模型？',
    answer: 'GPT-4o：最强大，适合复杂任务；GPT-4o Mini：性价比高，适合日常使用；Claude：长文本理解好；DeepSeek：国产模型，低成本。',
  },

  // 技术问题
  {
    id: 18,
    category: 'technical',
    question: 'API的响应速度如何？',
    answer: '我们的服务响应时间通常在200-800ms之间，取决于模型和请求复杂度。使用量高峰时可能会有延迟。',
  },
  {
    id: 19,
    category: 'technical',
    question: '数据会被保存吗？',
    answer: 'API调用数据仅用于计费和日志，不会用于模型训练。我们遵循严格的数据安全标准。',
  },
  {
    id: 20,
    category: 'technical',
    question: '如何处理网络错误？',
    answer: '建议在代码中添加重试机制，使用指数退避策略。对于超时错误，可适当增加超时时间。',
  },
  {
    id: 21,
    category: 'technical',
    question: '支持Webhook回调吗？',
    answer: '是的，企业用户可配置Webhook URL，我们会在异步任务完成时通知您。',
  },
  {
    id: 22,
    category: 'technical',
    question: '如何优化Token使用？',
    answer: '1) 使用简洁的提示词；2) 及时清理对话历史；3) 合理设置max_tokens参数；4) 选择性价比高的模型。',
  },
  {
    id: 23,
    category: 'technical',
    question: '遇到服务不可用怎么办？',
    answer: '查看我们的状态页面了解服务状态。遇到问题可联系客服，我们会尽快处理。',
  },
]

const filteredFaqs = computed(() => {
  return faqs.filter(faq => {
    const matchCategory = activeCategory.value === 'all' || faq.category === activeCategory.value
    const matchSearch = searchQuery.value === '' || 
      faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

const filterFaqs = () => {
  // 搜索时会自动触发computed更新
}
</script>

<style scoped>
.faq-page {
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
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-box input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
}

.search-box input::placeholder {
  color: #666;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

/* 分类导航 */
.category-nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #888;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover,
.category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

/* FAQ内容 */
.faq-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.faq-item details {
  width: 100%;
}

.faq-item summary {
  padding: 1.25rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-question {
  flex: 1;
}

.expand-icon {
  transition: transform 0.3s;
  color: #667eea;
}

.faq-item details[open] .expand-icon {
  transform: rotate(90deg);
}

.faq-answer {
  padding: 0 1.25rem 1.25rem;
  color: #888;
  line-height: 1.6;
}

.faq-example {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
}

/* 无结果 */
.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.no-results p {
  margin-bottom: 0.5rem;
}

.hint {
  color: #888;
  margin-bottom: 1.5rem;
}

.contact-btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
}

/* 联系区域 */
.contact-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.contact-section h2 {
  margin-bottom: 0.5rem;
}

.contact-section p {
  color: #888;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ccc;
}

.contact-item .icon {
  font-size: 1.5rem;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 2rem;
  color: #666;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 响应式 */
@media (max-width: 768px) {
  .category-nav {
    gap: 0.5rem;
  }
  
  .contact-methods {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
