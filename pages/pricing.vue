<template>
  <div class="pricing-page">
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

    <!-- Hero区域 -->
    <header class="hero">
      <h1>简单透明的价格</h1>
      <p>按量付费，用多少付多少，无需预付</p>
    </header>

    <!-- 计费说明 -->
    <section class="billing-info">
      <h2>计费说明</h2>
      <div class="billing-grid">
        <div class="billing-card">
          <h3>💰 Token计费</h3>
          <p>按照API调用消耗的Token数量计费</p>
          <div class="price-tag">1元 = 10,000 Tokens</div>
        </div>
        <div class="billing-card">
          <h3>📊 按需计费</h3>
          <p>只为您实际使用的部分收费</p>
          <div class="price-tag">无最低消费</div>
        </div>
        <div class="billing-card">
          <h3>🔄 实时扣费</h3>
          <p>每次API调用后立即从余额扣除</p>
          <div class="price-tag">秒级更新</div>
        </div>
      </div>
    </section>

    <!-- 价格表格 -->
    <section class="price-table">
      <h2>套餐价格</h2>
      <table>
        <thead>
          <tr>
            <th>模型</th>
            <th>输入 (1M Tokens)</th>
            <th>输出 (1M Tokens)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GPT-4o</td>
            <td>¥15.00</td>
            <td>¥60.00</td>
          </tr>
          <tr>
            <td>GPT-4o Mini</td>
            <td>¥1.50</td>
            <td>¥6.00</td>
          </tr>
          <tr>
            <td>Claude 3.5 Sonnet</td>
            <td>¥11.25</td>
            <td>¥45.00</td>
          </tr>
          <tr>
            <td>Claude 3 Haiku</td>
            <td>¥0.75</td>
            <td>¥3.00</td>
          </tr>
          <tr>
            <td>DeepSeek V3</td>
            <td>¥0.50</td>
            <td>¥2.00</td>
          </tr>
          <tr>
            <td>DeepSeek R1</td>
            <td>¥0.50</td>
            <td>¥2.00</td>
          </tr>
        </tbody>
      </table>
      <p class="table-note">* 1M = 1,000,000 Tokens</p>
    </section>

    <!-- 套餐推荐 -->
    <section class="packages">
      <h2>推荐套餐</h2>
      <div class="package-grid">
        <div class="package-card">
          <h3>入门版</h3>
          <div class="price">¥10</div>
          <div class="tokens">100,000 Tokens</div>
          <ul>
            <li>✓ 支持所有模型</li>
            <li>✓ API密钥</li>
            <li>✓ 技术支持</li>
          </ul>
          <button class="btn-buy">立即购买</button>
        </div>
        <div class="package-card featured">
          <div class="badge">推荐</div>
          <h3>标准版</h3>
          <div class="price">¥50</div>
          <div class="tokens">500,000 Tokens</div>
          <ul>
            <li>✓ 支持所有模型</li>
            <li>✓ API密钥</li>
            <li>✓ 优先响应</li>
            <li>✓ 使用统计</li>
          </ul>
          <button class="btn-buy primary">立即购买</button>
        </div>
        <div class="package-card">
          <h3>专业版</h3>
          <div class="price">¥100</div>
          <div class="tokens">1,000,000 Tokens</div>
          <ul>
            <li>✓ 支持所有模型</li>
            <li>✓ API密钥</li>
            <li>✓ 专属客服</li>
            <li>✓ 使用统计</li>
            <li>✓ 批量操作</li>
          </ul>
          <button class="btn-buy">立即购买</button>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-preview">
      <h2>常见问题</h2>
      <div class="faq-list">
        <details>
          <summary>Token是什么？如何计算？</summary>
          <p>Token是文本处理的基本单位。1个中文汉字约等于1-2个Token，1个英文单词约等于1-1.5个Token。API请求和响应都会消耗Token。</p>
        </details>
        <details>
          <summary>余额会过期吗？</summary>
          <p>充值余额永不过期，可以随时使用。套餐余额（如月卡）在有效期内使用。</p>
        </details>
        <details>
          <summary>如何查看用量明细？</summary>
          <p>登录后在"控制台 - 使用记录"中可以查看详细的调用记录、消费明细和使用图表。</p>
        </details>
        <details>
          <summary>支持退款吗？</summary>
          <p>未使用的余额在购买后7天内可申请退款，需联系客服处理。</p>
        </details>
        <details>
          <summary>有免费额度吗？</summary>
          <p>新用户注册赠送100 Tokens体验额度，可用于测试API。</p>
        </details>
      </div>
      <NuxtLink to="/faq" class="more-link">查看更多问题 →</NuxtLink>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2024 COCO CLAW. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 定价页面逻辑
</script>

<style scoped>
.pricing-page {
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
  color: #fff;
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
  padding: 5rem 2rem;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.1) 0%, rgba(10, 10, 15, 0) 100%);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  color: #888;
}

/* 计费说明 */
.billing-info {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.billing-info h2,
.price-table h2,
.packages h2,
.faq-preview h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.billing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.billing-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.billing-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.billing-card p {
  color: #888;
  margin-bottom: 1rem;
}

.price-tag {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

/* 价格表格 */
.price-table {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.price-table table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.price-table th,
.price-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.price-table th {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  font-weight: 600;
}

.price-table td:first-child {
  text-align: left;
  padding-left: 1.5rem;
}

.table-note {
  text-align: center;
  color: #666;
  margin-top: 1rem;
  font-size: 0.875rem;
}

/* 套餐 */
.packages {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.package-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.package-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
}

.package-card.featured {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.package-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.package-card .price {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.package-card .tokens {
  color: #888;
  margin-bottom: 1.5rem;
}

.package-card ul {
  list-style: none;
  padding: 0;
  text-align: left;
  margin-bottom: 1.5rem;
}

.package-card li {
  padding: 0.5rem 0;
  color: #ccc;
}

.btn-buy {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #667eea;
  background: transparent;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-buy:hover {
  background: #667eea;
  color: #fff;
}

.btn-buy.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
}

.btn-buy.primary:hover {
  opacity: 0.9;
}

/* FAQ */
.faq-preview {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-list details {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.faq-list summary {
  padding: 1.25rem;
  cursor: pointer;
  font-weight: 500;
  list-style: none;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary::before {
  content: '▶';
  margin-right: 0.75rem;
  transition: transform 0.3s;
}

.faq-list details[open] summary::before {
  transform: rotate(90deg);
}

.faq-list p {
  padding: 0 1.25rem 1.25rem;
  color: #888;
  line-height: 1.6;
}

.more-link {
  display: block;
  text-align: center;
  margin-top: 2rem;
  color: #667eea;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 2rem;
  color: #666;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
