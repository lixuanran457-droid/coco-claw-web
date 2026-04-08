import { defineStore } from 'pinia'

export interface Skill {
  id: string
  name: string
  icon: string
  description: string
  price: number
  priceType: number // 0-免费, 1-付费
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
  status?: number // 0-下架, 1-上架
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
  currencySymbol: string
  configLoaded: boolean
}

const API_BASE = '/api'

// API functions
const api = {
  async getSkills(params: {
    page?: number
    pageSize?: number
    category?: string
    sort?: string
    keyword?: string
  }) {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.pageSize) query.set('pageSize', params.pageSize.toString())
    if (params.category && params.category !== 'all') query.set('category', params.category)
    if (params.sort) query.set('sort', params.sort)
    if (params.keyword) query.set('keyword', params.keyword)

    const response = await fetch(`${API_BASE}/skills?${query}`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      // 转换后端数据格式到前端格式
      const skills = (result.data.records || result.data.list || []).map((item: any) => ({
        id: item.id?.toString() || '',
        name: item.name || '',
        icon: item.icon || '🤖',
        description: item.description || '',
        price: Number(item.price) || 0,
        priceType: item.priceType ?? 1,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        category: item.category || 'tool',
        platform: item.platform || '通用',
        salesCount: item.salesCount || 0,
        rating: Number(item.rating) || 4.5,
        reviewCount: item.reviewCount || 0,
        safetyLevel: (item.safetyLevel as 'high' | 'medium' | 'low') || 'high',
        features: item.features ? (typeof item.features === 'string' ? item.features.split(',') : item.features) : [],
        author: item.author || '系统',
        updateTime: item.updateTime || new Date().toISOString().split('T')[0],
        isFeatured: item.isFeatured === 1 || item.isFeatured === true,
        status: item.status ?? 1
      }))
      return {
        data: {
          skills,
          pagination: {
            page: result.data.current || 1,
            pageSize: result.data.size || 30,
            total: result.data.total || 0,
            totalPages: result.data.pages || 1
          }
        }
      }
    }
    throw new Error(result.message || '获取技能列表失败')
  },

  async getSkillById(id: string) {
    const response = await fetch(`${API_BASE}/skills/${id}`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      const item = result.data
      return {
        data: {
          id: item.id?.toString() || '',
          name: item.name || '',
          icon: item.icon || '🤖',
          description: item.description || '',
          price: Number(item.price) || 0,
          priceType: item.priceType ?? 1,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          category: item.category || 'tool',
          platform: item.platform || '通用',
          salesCount: item.salesCount || 0,
          rating: Number(item.rating) || 4.5,
          reviewCount: item.reviewCount || 0,
          safetyLevel: (item.safetyLevel as 'high' | 'medium' | 'low') || 'high',
          features: item.features ? (typeof item.features === 'string' ? item.features.split(',') : item.features) : [],
          author: item.author || '系统',
          updateTime: item.updateTime || new Date().toISOString().split('T')[0],
          isFeatured: item.isFeatured === 1 || item.isFeatured === true,
          status: item.status ?? 1
        }
      }
    }
    throw new Error(result.message || '获取技能详情失败')
  },

  async getSkillCategories() {
    const response = await fetch(`${API_BASE}/categories`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return {
        data: {
          categories: (result.data || []).map((item: any) => ({
            id: item.id?.toString() || item.categoryCode || 'all',
            name: item.name || item.categoryName || '全部',
            icon: item.icon || '📦',
            count: item.count || 0
          }))
        }
      }
    }
    // 如果API失败，返回默认分类
    return {
      data: {
        categories: [
          { id: 'all', name: '全部', icon: '🛒', count: 0 },
          { id: 'productivity', name: '效率工具', icon: '⚡', count: 0 },
          { id: 'automation', name: '自动化', icon: '🤖', count: 0 },
          { id: 'data', name: '数据处理', icon: '📊', count: 0 },
          { id: 'security', name: '安全防护', icon: '🛡️', count: 0 },
          { id: 'media', name: '媒体工具', icon: '🎬', count: 0 },
          { id: 'shopping', name: '购物助手', icon: '🛍️', count: 0 },
          { id: 'design', name: '设计工具', icon: '🎨', count: 0 }
        ]
      }
    }
  },

  async getTopSkills(limit: number) {
    const response = await fetch(`${API_BASE}/skills/featured?limit=${limit}`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return {
        data: {
          skills: (result.data || []).map((item: any, index: number) => ({
            id: item.id?.toString() || '',
            name: item.name || '',
            icon: item.icon || '🤖',
            description: item.description || '',
            price: Number(item.price) || 0,
            priceType: item.priceType ?? 1,
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            category: item.category || 'tool',
            platform: item.platform || '通用',
            salesCount: item.salesCount || 0,
            rating: Number(item.rating) || 4.5,
            reviewCount: item.reviewCount || 0,
            safetyLevel: (item.safetyLevel as 'high' | 'medium' | 'low') || 'high',
            features: item.features ? (typeof item.features === 'string' ? item.features.split(',') : item.features) : [],
            author: item.author || '系统',
            updateTime: item.updateTime || new Date().toISOString().split('T')[0],
            isFeatured: true,
            rank: index + 1
          }))
        }
      }
    }
    return { data: { skills: [] } }
  },

  async getStats() {
    const response = await fetch(`${API_BASE}/recommend/stats`, {
      credentials: 'include'
    })
    const result = await response.json()
    if (result.code === 200) {
      return { data: result.data }
    }
    return { data: null }
  }
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
    setCurrencySymbol(symbol: string) {
      this.currencySymbol = symbol
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currency_symbol', symbol)
      }
    },

    async fetchConfig() {
      if (this.configLoaded) return

      try {
        // 获取货币符号
        const currencyRes = await fetch(`${API_BASE}/config/currency`, {
          credentials: 'include'
        })
        const currencyResult = await currencyRes.json()
        if (currencyResult.code === 200 && currencyResult.data) {
          this.setCurrencySymbol(currencyResult.data)
        }

        this.configLoaded = true
      } catch (error) {
        console.error('获取配置失败:', error)
      }
    },

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

        this.skills = data.skills || []
        if (data.pagination) {
          this.pagination = { ...this.pagination, ...data.pagination }
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch skills'
        console.error('Error fetching skills:', error)
        this.skills = [] // 不再使用Mock数据
      } finally {
        this.loading = false
      }
    },

    async fetchSkillById(id: string) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.getSkillById(id)
        this.currentSkill = data
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch skill'
        console.error('Error fetching skill:', error)
        this.currentSkill = null
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const { data } = await api.getSkillCategories()
        this.categories = data.categories || []
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.categories = [
          { id: 'all', name: '全部', icon: '🛒', count: 0 }
        ]
      }
    },

    async fetchTopSkills(limit: number = 4) {
      try {
        const { data } = await api.getTopSkills(limit)
        this.topSkills = data.skills || []
      } catch (error) {
        console.error('Error fetching top skills:', error)
        this.topSkills = []
      }
    },

    async fetchStats() {
      try {
        const { data } = await api.getStats()
        if (data) {
          this.stats = data
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // 不再使用Mock数据
        this.stats = null
      }
    },

    setPage(page: number) {
      this.pagination.page = page
    },

    clearError() {
      this.error = null
    }
  }
})
