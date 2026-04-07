import { defineStore } from 'pinia'

export interface Skill {
  id: string
  name: string
  icon: string
  description: string
  price: number
  originalPrice?: number
  category: string
  platform: string
  salesCount: number
  rating: number
  reviewCount: number
  safetyLevel: 'high' | 'medium' | 'low'
  features: string[]
  author: string
  updateTime: string
  isFeatured?: boolean
  rank?: number
}

export interface CartItem {
  id: string
  skill: Skill
  quantity: number
  selected: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface SkillState {
  skills: Skill[]
  currentSkill: Skill | null
  categories: Category[]
  topSkills: Skill[]
  stats: {
    totalSkills: number
    totalPlatforms: number
    totalUsers: number
    totalOrders: number
  } | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  // 新增配置相关状态
  currencySymbol: string
  configLoaded: boolean
}

export const useSkillStore = defineStore('skill', {
  state: (): SkillState => ({
    skills: [],
    currentSkill: null,
    categories: [],
    topSkills: [],
    stats: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 30,
      total: 0,
      totalPages: 0
    },
    // 配置相关
    currencySymbol: '¥',
    configLoaded: false
  }),

  getters: {
    featuredSkills: (state) => state.skills.filter(s => s.isFeatured).slice(0, 8),
    
    getSkillById: (state) => (id: string) => {
      return state.skills.find(s => s.id === id)
    },

    skillsByCategory: (state) => (category: string) => {
      if (!category || category === 'all') return state.skills
      return state.skills.filter(s => s.category === category)
    },

    topFourSkills: (state) => state.topSkills.slice(0, 4)
  },

  actions: {
    // 设置货币符号
    setCurrencySymbol(symbol: string) {
      this.currencySymbol = symbol
      // 同步到 localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currency_symbol', symbol)
      }
    },

    // 获取系统配置
    async fetchConfig() {
      if (this.configLoaded) return
      
      try {
        // 获取分页大小
        const pageSizeRes = await fetch('/api/config/page-size')
        const pageSizeResult = await pageSizeRes.json()
        if (pageSizeResult.code === 200 && pageSizeResult.data) {
          this.pagination.pageSize = pageSizeResult.data
        }

        // 获取货币符号
        const currencyRes = await fetch('/api/config/currency')
        const currencyResult = await currencyRes.json()
        if (currencyResult.code === 200 && currencyResult.data) {
          this.setCurrencySymbol(currencyResult.data)
        }

        this.configLoaded = true
      } catch (error) {
        console.error('获取配置失败:', error)
      }
    },

    // Fetch all skills with pagination
    async fetchSkills(params?: {
      page?: number
      pageSize?: number
      category?: string
      sort?: string
      keyword?: string
    }) {
      this.loading = true
      this.error = null
      try {
        // 确保配置已加载
        if (!this.configLoaded) {
          await this.fetchConfig()
        }

        const { data } = await api.getSkills({
          page: params?.page || this.pagination.page,
          pageSize: params?.pageSize || this.pagination.pageSize,
          category: params?.category,
          sort: params?.sort,
          keyword: params?.keyword
        })
        
        this.skills = data.data || data.skills || []
        if (data.pagination) {
          this.pagination = { ...this.pagination, ...data.pagination }
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch skills'
        console.error('Error fetching skills:', error)
        // Use mock data for demo
        this.skills = this.getMockSkills()
      } finally {
        this.loading = false
      }
    },

    // Fetch single skill by ID
    async fetchSkillById(id: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.getSkillById(id)
        this.currentSkill = data
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch skill'
        console.error('Error fetching skill:', error)
        // Use mock data for demo
        this.currentSkill = this.getMockSkills().find(s => s.id === id) || this.getMockSkills()[0]
      } finally {
        this.loading = false
      }
    },

    // Fetch categories
    async fetchCategories() {
      try {
        const { data } = await api.getSkillCategories()
        this.categories = data.categories || []
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Use mock categories
        this.categories = this.getMockCategories()
      }
    },

    // Fetch top skills
    async fetchTopSkills(limit: number = 4) {
      try {
        const { data } = await api.getTopSkills(limit)
        this.topSkills = data.skills || []
      } catch (error) {
        console.error('Error fetching top skills:', error)
        // Use mock data
        const mockSkills = this.getMockSkills()
        this.topSkills = mockSkills.slice(0, limit).map((s, i) => ({
          ...s,
          rank: i + 1
        }))
      }
    },

    // Fetch stats
    async fetchStats() {
      try {
        const { data } = await api.getStats()
        this.stats = data
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Use mock stats
        this.stats = {
          totalSkills: 156,
          totalPlatforms: 12,
          totalUsers: 24580,
          totalOrders: 89342
        }
      }
    },

    // Set current page
    setPage(page: number) {
      this.pagination.page = page
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Mock data generators for demo
    getMockSkills(): Skill[] {
      return [
        {
          id: '1',
          name: 'AutoFill Pro',
          icon: '🤖',
          description: '智能表单自动填充助手，支持多种场景自动识别和填充',
          price: 99,
          originalPrice: 199,
          category: 'automation',
          platform: 'Chrome',
          salesCount: 12580,
          rating: 4.8,
          reviewCount: 2341,
          safetyLevel: 'high',
          features: ['智能识别', '自动填充', '多场景支持', '隐私保护'],
          author: 'TechMaster',
          updateTime: '2024-01-15',
          isFeatured: true
        },
        {
          id: '2',
          name: 'DataExtractor',
          icon: '📊',
          description: '网页数据提取工具，快速抓取结构化数据',
          price: 149,
          category: 'data',
          platform: 'Firefox',
          salesCount: 8934,
          rating: 4.6,
          reviewCount: 1567,
          safetyLevel: 'high',
          features: ['批量提取', '格式转换', '定时任务', '云同步'],
          author: 'DataPro',
          updateTime: '2024-01-12'
        },
        {
          id: '3',
          name: 'SmartTranslator',
          icon: '🌐',
          description: '多语言实时翻译，支持100+语言互译',
          price: 79,
          originalPrice: 129,
          category: 'productivity',
          platform: 'Edge',
          salesCount: 23456,
          rating: 4.9,
          reviewCount: 5678,
          safetyLevel: 'high',
          features: ['实时翻译', '离线模式', '专业术语', '语音输入'],
          author: 'LangMaster',
          updateTime: '2024-01-18',
          isFeatured: true
        },
        {
          id: '4',
          name: 'PriceTracker',
          icon: '💰',
          description: '电商价格监控，自动提醒价格变动',
          price: 59,
          category: 'shopping',
          platform: 'Safari',
          salesCount: 15678,
          rating: 4.7,
          reviewCount: 3456,
          safetyLevel: 'medium',
          features: ['价格监控', '历史记录', '降价提醒', '比价功能'],
          author: 'ShopSmart',
          updateTime: '2024-01-10'
        },
        {
          id: '5',
          name: 'AdBlocker Ultimate',
          icon: '🛡️',
          description: '强力广告拦截，保护隐私安全',
          price: 0,
          category: 'security',
          platform: 'All Browsers',
          salesCount: 156789,
          rating: 4.5,
          reviewCount: 34567,
          safetyLevel: 'high',
          features: ['广告拦截', '隐私保护', '恶意网站屏蔽', '轻量化'],
          author: 'SecureNet',
          updateTime: '2024-01-20'
        },
        {
          id: '6',
          name: 'ScreenshotPlus',
          icon: '📸',
          description: '高级截图工具，支持滚动截图和标注',
          price: 89,
          category: 'productivity',
          platform: 'Chrome',
          salesCount: 9876,
          rating: 4.8,
          reviewCount: 2198,
          safetyLevel: 'high',
          features: ['滚动截图', '区域截图', '标注工具', '云存储'],
          author: 'ScreenPro',
          updateTime: '2024-01-14'
        },
        {
          id: '7',
          name: 'NoteMaster',
          icon: '📝',
          description: '智能笔记管理，多端同步',
          price: 69,
          originalPrice: 99,
          category: 'productivity',
          platform: 'Cross-platform',
          salesCount: 18765,
          rating: 4.7,
          reviewCount: 4234,
          safetyLevel: 'high',
          features: ['Markdown', '多端同步', '标签管理', '搜索功能'],
          author: 'NotePro',
          updateTime: '2024-01-16',
          isFeatured: true
        },
        {
          id: '8',
          name: 'VideoDownloader',
          icon: '📥',
          description: '多平台视频下载，支持4K画质',
          price: 129,
          category: 'media',
          platform: 'Desktop',
          salesCount: 7654,
          rating: 4.4,
          reviewCount: 1876,
          safetyLevel: 'medium',
          features: ['多平台支持', '批量下载', '格式转换', '音质选择'],
          author: 'MediaTool',
          updateTime: '2024-01-08'
        },
        {
          id: '9',
          name: 'FocusMode',
          icon: '🎯',
          description: '专注模式，提高工作效率',
          price: 49,
          category: 'productivity',
          platform: 'All Browsers',
          salesCount: 12345,
          rating: 4.6,
          reviewCount: 2987,
          safetyLevel: 'high',
          features: ['番茄钟', '网站屏蔽', '统计报告', '白噪音'],
          author: 'FocusLab',
          updateTime: '2024-01-17',
          isFeatured: true
        },
        {
          id: '10',
          name: 'ClipboardManager',
          icon: '📋',
          description: '剪贴板管理器，历史记录同步',
          price: 39,
          category: 'productivity',
          platform: 'Windows',
          salesCount: 8765,
          rating: 4.5,
          reviewCount: 1543,
          safetyLevel: 'high',
          features: ['历史记录', '云同步', '分组管理', '快捷键支持'],
          author: 'ClipMaster',
          updateTime: '2024-01-11'
        },
        {
          id: '11',
          name: 'ColorPicker Pro',
          icon: '🎨',
          description: '专业取色器，支持多种格式',
          price: 29,
          category: 'design',
          platform: 'Cross-platform',
          salesCount: 5432,
          rating: 4.3,
          reviewCount: 876,
          safetyLevel: 'high',
          features: ['多种格式', '颜色渐变', '历史记录', '导出功能'],
          author: 'DesignPro',
          updateTime: '2024-01-05'
        },
        {
          id: '12',
          name: 'TabManager',
          icon: '📑',
          description: '标签页管理器，分组整理',
          price: 0,
          category: 'productivity',
          platform: 'Chrome',
          salesCount: 45678,
          rating: 4.7,
          reviewCount: 8765,
          safetyLevel: 'high',
          features: ['标签分组', '会话保存', '搜索功能', '快捷操作'],
          author: 'TabPro',
          updateTime: '2024-01-19',
          isFeatured: true
        }
      ]
    },

    getMockCategories(): Category[] {
      return [
        { id: 'all', name: '全部', icon: '🛒', count: 156 },
        { id: 'productivity', name: '效率工具', icon: '⚡', count: 45 },
        { id: 'automation', name: '自动化', icon: '🤖', count: 28 },
        { id: 'data', name: '数据处理', icon: '📊', count: 23 },
        { id: 'security', name: '安全防护', icon: '🛡️', count: 18 },
        { id: 'media', name: '媒体工具', icon: '🎬', count: 15 },
        { id: 'shopping', name: '购物助手', icon: '🛍️', count: 14 },
        { id: 'design', name: '设计工具', icon: '🎨', count: 13 }
      ]
    }
  }
})

// API functions (simplified)
const api = {
  async getSkills(params: any) {
    // In real app, this would call the backend API
    // For demo, return mock data
    return {
      data: {
        skills: [],
        pagination: { page: 1, pageSize: 30, total: 0 }
      }
    }
  },
  
  async getSkillById(id: string) {
    return { data: null }
  },
  
  async getSkillCategories() {
    return { data: { categories: [] } }
  },
  
  async getTopSkills(limit: number) {
    return { data: { skills: [] } }
  },
  
  async getStats() {
    return { data: null }
  }
}
