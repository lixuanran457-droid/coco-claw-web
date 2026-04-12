// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@vant/nuxt',
    '@pinia/nuxt'
  ],
  
  css: [
    '~/assets/css/main.css'
  ],
  
  app: {
    head: {
      title: 'COCO CLAW - SKILL 交易市场',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { charset: 'utf-8' },
        { name: 'description', content: 'COCO CLAW - 专业的 SKILL 交易市场' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
      ]
    }
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api'
    }
  },
  
  vite: {
    css: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer')
        ]
      }
    }
  },
  
  compatibilityDate: '2024-01-01',

  nitro: {
    experimental: {
      websocket: true
    }
  }
})
