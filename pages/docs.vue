<template>
  <div class="docs-page">
    <!-- 顶部导航 -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="logo">🏠 COCO CLAW</div>
        <div class="nav-links">
          <NuxtLink to="/">首页</NuxtLink>
          <NuxtLink to="/shop">商城</NuxtLink>
          <NuxtLink to="/skills">Skills</NuxtLink>
          <NuxtLink to="/pricing">定价</NuxtLink>
          <NuxtLink to="/docs" class="active">文档</NuxtLink>
          <NuxtLink to="/my-api">控制台</NuxtLink>
          <NuxtLink to="/login" class="btn-login">登录</NuxtLink>
        </div>
      </div>
    </nav>

    <div class="docs-container">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <h4>快速开始</h4>
          <a href="#overview" class="active">概览</a>
          <a href="#quickstart">快速入门</a>
          <a href="#authentication">认证</a>
        </div>
        <div class="sidebar-section">
          <h4>API参考</h4>
          <a href="#chat">对话接口</a>
          <a href="#models">模型列表</a>
          <a href="#errors">错误码</a>
        </div>
        <div class="sidebar-section">
          <h4>SDK</h4>
          <a href="#sdk-python">Python</a>
          <a href="#sdk-node">Node.js</a>
          <a href="#sdk-java">Java</a>
        </div>
        <div class="sidebar-section">
          <h4>资源</h4>
          <a href="#billing">计费</a>
          <a href="#limits">限制</a>
          <a href="#best-practices">最佳实践</a>
        </div>
      </aside>

      <!-- 主内容 -->
      <main class="docs-content">
        <!-- 概览 -->
        <section id="overview" class="doc-section">
          <h1>API 文档</h1>
          <p class="lead">COCO CLAW 提供稳定、快速的 AI 模型 API 服务，支持 OpenAI、Claude、DeepSeek 等多种模型。</p>
          
          <div class="feature-grid">
            <div class="feature-card">
              <h3>🌐 全球加速</h3>
              <p>多节点部署，毫秒级响应</p>
            </div>
            <div class="feature-card">
              <h3>💰 按量计费</h3>
              <p>用多少付多少，实时扣费</p>
            </div>
            <div class="feature-card">
              <h3>🔒 安全可靠</h3>
              <p>数据加密，99.9% 可用性</p>
            </div>
            <div class="feature-card">
              <h3>📊 用量统计</h3>
              <p>详细日志，实时监控</p>
            </div>
          </div>
        </section>

        <!-- 快速入门 -->
        <section id="quickstart" class="doc-section">
          <h2>快速入门</h2>
          
          <h3>1. 获取 API Key</h3>
          <p>登录后在控制台创建您的 API Key：</p>
          <ol>
            <li>注册并登录 COCO CLAW 账号</li>
            <li>进入「控制台 → API密钥」</li>
            <li>点击「创建新密钥」</li>
            <li>复制生成的 Key（请妥善保管）</li>
          </ol>

          <h3>2. 安装 SDK</h3>
          <div class="code-tabs">
            <div class="code-tab active" data-lang="python">Python</div>
            <div class="code-tab" data-lang="node">Node.js</div>
            <div class="code-tab" data-lang="curl">cURL</div>
          </div>
          <div class="code-block" data-lang="python">
            <pre><code>pip install coco-claw-sdk</code></pre>
          </div>
          <div class="code-block hidden" data-lang="node">
            <pre><code>npm install coco-claw-sdk</code></pre>
          </div>
          <div class="code-block hidden" data-lang="curl">
            <pre><code># 无需安装，直接使用 cURL</code></pre>
          </div>

          <h3>3. 发送请求</h3>
          <div class="code-tabs">
            <div class="code-tab active" data-lang="python">Python</div>
            <div class="code-tab" data-lang="node">Node.js</div>
            <div class="code-tab" data-lang="curl">cURL</div>
          </div>
          <div class="code-block" data-lang="python">
            <pre><code>from coco_claw import CocoClaw

client = CocoClaw(api_key="sk-coco-xxxxxxxxxxxx")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手"},
        {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
)

print(response.choices[0].message.content)</code></pre>
          </div>
          <div class="code-block hidden" data-lang="node">
            <pre><code>import { CocoClaw } from 'coco-claw-sdk';

const client = new CocoClaw({ apiKey: 'sk-coco-xxxxxxxxxxxx' });

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: '你是一个有帮助的助手' },
    { role: 'user', content: '你好，请介绍一下你自己' }
  ]
});

console.log(response.choices[0].message.content);</code></pre>
          </div>
          <div class="code-block hidden" data-lang="curl">
            <pre><code>curl https://api.cococlaw.com/v1/chat/completions \
  -H "Authorization: Bearer sk-coco-xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
  }'</code></pre>
          </div>
        </section>

        <!-- 认证 -->
        <section id="authentication" class="doc-section">
          <h2>认证</h2>
          <p>COCO CLAW API 使用 API Key 进行认证。您可以在请求的 Header 中添加您的 Key：</p>
          <div class="code-block">
            <pre><code>Authorization: Bearer sk-coco-xxxxxxxxxxxx</code></pre>
          </div>
          <div class="warning">
            <strong>⚠️ 安全提示：</strong>请勿将 API Key 暴露在前端代码或公开仓库中。建议使用环境变量存储。
          </div>
        </section>

        <!-- 对话接口 -->
        <section id="chat" class="doc-section">
          <h2>对话接口</h2>
          <p>POST <code>/v1/chat/completions</code></p>
          
          <h3>请求参数</h3>
          <table class="param-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>类型</th>
                <th>必填</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>model</td>
                <td>string</td>
                <td>是</td>
                <td>模型名称，如 gpt-4o、claude-3-sonnet</td>
              </tr>
              <tr>
                <td>messages</td>
                <td>array</td>
                <td>是</td>
                <td>对话消息数组</td>
              </tr>
              <tr>
                <td>stream</td>
                <td>boolean</td>
                <td>否</td>
                <td>是否启用流式输出，默认 false</td>
              </tr>
              <tr>
                <td>temperature</td>
                <td>number</td>
                <td>否</td>
                <td>创造性参数，0-2，默认 1</td>
              </tr>
              <tr>
                <td>max_tokens</td>
                <td>integer</td>
                <td>否</td>
                <td>最大输出 Token 数</td>
              </tr>
            </tbody>
          </table>

          <h3>响应示例</h3>
          <div class="code-block">
            <pre><code>{
  "id": "chatcmpl-xxx",
  "model": "gpt-4o",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "你好！我是..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 150,
    "total_tokens": 170
  }
}</code></pre>
          </div>
        </section>

        <!-- 模型列表 -->
        <section id="models" class="doc-section">
          <h2>支持的模型</h2>
          <table class="model-table">
            <thead>
              <tr>
                <th>模型</th>
                <th>输入价格</th>
                <th>输出价格</th>
                <th>上下文</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>GPT-4o</strong></td>
                <td>¥15/1M tokens</td>
                <td>¥60/1M tokens</td>
                <td>128K</td>
              </tr>
              <tr>
                <td><strong>GPT-4o Mini</strong></td>
                <td>¥1.5/1M tokens</td>
                <td>¥6/1M tokens</td>
                <td>128K</td>
              </tr>
              <tr>
                <td><strong>Claude 3.5 Sonnet</strong></td>
                <td>¥11.25/1M tokens</td>
                <td>¥45/1M tokens</td>
                <td>200K</td>
              </tr>
              <tr>
                <td><strong>Claude 3 Haiku</strong></td>
                <td>¥0.75/1M tokens</td>
                <td>¥3/1M tokens</td>
                <td>200K</td>
              </tr>
              <tr>
                <td><strong>DeepSeek V3</strong></td>
                <td>¥0.5/1M tokens</td>
                <td>¥2/1M tokens</td>
                <td>64K</td>
              </tr>
              <tr>
                <td><strong>DeepSeek R1</strong></td>
                <td>¥0.5/1M tokens</td>
                <td>¥2/1M tokens</td>
                <td>64K</td>
              </tr>
            </tbody>
          </table>
          <p class="note">查看最新价格：<NuxtLink to="/pricing">定价页面</NuxtLink></p>
        </section>

        <!-- 错误码 -->
        <section id="errors" class="doc-section">
          <h2>错误码</h2>
          <table class="error-table">
            <thead>
              <tr>
                <th>错误码</th>
                <th>说明</th>
                <th>解决方案</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>401</code></td>
                <td>API Key 无效或已过期</td>
                <td>检查 Key 是否正确，或在控制台重新生成</td>
              </tr>
              <tr>
                <td><code>429</code></td>
                <td>请求过于频繁</td>
                <td>降低请求频率，或升级套餐</td>
              </tr>
              <tr>
                <td><code>500</code></td>
                <td>服务器内部错误</td>
                <td>稍后重试，或联系技术支持</td>
              </tr>
              <tr>
                <td><code>insufficient_balance</code></td>
                <td>余额不足</td>
                <td>前往充值：<NuxtLink to="/tokens">充值页面</NuxtLink></td>
              </tr>
              <tr>
                <td><code>quota_exceeded</code></td>
                <td>超出配额限制</td>
                <td>升级套餐或等待配额重置</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 限制 -->
        <section id="limits" class="doc-section">
          <h2>使用限制</h2>
          <div class="limits-grid">
            <div class="limit-card">
              <h3>免费用户</h3>
              <ul>
                <li>100 请求/分钟</li>
                <li>100,000 Tokens/天</li>
                <li>支持所有模型</li>
              </ul>
            </div>
            <div class="limit-card">
              <h3>付费用户</h3>
              <ul>
                <li>1,000 请求/分钟</li>
                <li>无日额度限制</li>
                <li>支持所有模型</li>
              </ul>
            </div>
            <div class="limit-card">
              <h3>企业用户</h3>
              <ul>
                <li>自定义限制</li>
                <li>无限制</li>
                <li>专属节点</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 最佳实践 -->
        <section id="best-practices" class="doc-section">
          <h2>最佳实践</h2>
          
          <h3>1. 优化 Token 使用</h3>
          <ul>
            <li>使用简洁的提示词</li>
            <li>及时清理对话历史</li>
            <li>利用 system prompt 复用上下文</li>
          </ul>

          <h3>2. 错误处理</h3>
          <div class="code-block">
            <pre><code>try {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: '你好' }]
  });
} catch (error) {
  if (error.code === 'insufficient_balance') {
    // 余额不足，引导充值
  } else if (error.code === '429') {
    // 限流，等待后重试
  }
}</code></pre>
          </div>

          <h3>3. 安全建议</h3>
          <ul>
            <li>API Key 存储在环境变量中</li>
            <li>不要在前端暴露 Key</li>
            <li>定期轮换 Key</li>
            <li>启用用量告警</li>
          </ul>
        </section>

        <!-- 联系支持 -->
        <section class="doc-section support">
          <h2>需要帮助？</h2>
          <p>遇到问题？我们随时为您提供支持。</p>
          <div class="support-links">
            <a href="/faq" class="support-btn">查看FAQ</a>
            <a href="mailto:support@cococlaw.com" class="support-btn">联系客服</a>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 文档页面逻辑
</script>

<style scoped>
.docs-page {
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

/* 文档容器 */
.docs-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
}

/* 侧边栏 */
.sidebar {
  width: 260px;
  padding: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 70px;
  height: calc(100vh - 70px);
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.sidebar-section a {
  display: block;
  padding: 0.5rem 0;
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.sidebar-section a:hover,
.sidebar-section a.active {
  color: #667eea;
}

/* 主内容 */
.docs-content {
  flex: 1;
  padding: 3rem;
  max-width: 900px;
}

.doc-section {
  margin-bottom: 4rem;
  scroll-margin-top: 100px;
}

.doc-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.doc-section h2 {
  font-size: 1.75rem;
  margin: 2rem 0 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.doc-section h2:first-of-type {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}

.doc-section h3 {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem;
  color: #ccc;
}

.lead {
  font-size: 1.25rem;
  color: #888;
  line-height: 1.6;
}

code {
  background: rgba(102, 126, 234, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

/* 功能卡片 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.feature-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.feature-card p {
  color: #888;
  margin: 0;
  font-size: 0.9rem;
}

/* 代码块 */
.code-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.code-tab {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #888;
}

.code-tab.active {
  background: rgba(102, 126, 234, 0.3);
  color: #fff;
}

.code-block {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1.25rem;
  overflow-x: auto;
}

.code-block.hidden {
  display: none;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  background: none;
  padding: 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #e0e0e0;
}

/* 警告 */
.warning {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: #ffc107;
}

/* 表格 */
.param-table,
.model-table,
.error-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
}

.param-table th,
.param-table td,
.model-table th,
.model-table td,
.error-table th,
.error-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.param-table th,
.model-table th,
.error-table th {
  background: rgba(102, 126, 234, 0.2);
  font-weight: 600;
  color: #667eea;
}

.param-table td code,
.error-table td code {
  background: rgba(255, 255, 255, 0.1);
}

.note {
  color: #888;
  margin-top: 0.5rem;
}

.note a {
  color: #667eea;
}

/* 限制卡片 */
.limits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.limit-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.limit-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.limit-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.limit-card li {
  padding: 0.25rem 0;
  color: #888;
  font-size: 0.9rem;
}

/* 支持 */
.support {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
}

.support p {
  color: #888;
  margin-bottom: 1.5rem;
}

.support-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.support-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  transition: opacity 0.3s;
}

.support-btn:hover {
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 768px) {
  .docs-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    position: relative;
    top: 0;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .feature-grid,
  .limits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
