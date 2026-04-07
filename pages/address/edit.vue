<template>
  <div class="address-edit-page min-h-screen pb-24">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-border">
      <div class="px-4 py-3 flex items-center justify-between">
        <button 
          @click="$router.back()"
          class="p-2 -ml-2 rounded-lg hover:bg-cyber-card transition-colors"
        >
          <span class="text-xl">←</span>
        </button>
        <h1 class="text-lg font-bold text-cyber-text">{{ isEditing ? '编辑地址' : '新增地址' }}</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <!-- Form -->
    <div class="px-4 py-4">
      <div class="cyber-card p-4 rounded-xl space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm text-cyber-muted mb-2">收货人</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="请输入收货人姓名"
            class="cyber-input"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm text-cyber-muted mb-2">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            class="cyber-input"
            maxlength="11"
          />
        </div>

        <!-- Province/City/District -->
        <div>
          <label class="block text-sm text-cyber-muted mb-2">省/市/区</label>
          <div class="grid grid-cols-3 gap-2">
            <select v-model="form.province" class="cyber-input">
              <option value="">请选择</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
            <select v-model="form.city" class="cyber-input">
              <option value="">请选择</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
            <select v-model="form.district" class="cyber-input">
              <option value="">请选择</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
        </div>

        <!-- Detail Address -->
        <div>
          <label class="block text-sm text-cyber-muted mb-2">详细地址</label>
          <textarea
            v-model="form.detail"
            placeholder="请输入详细地址（街道、门牌号等）"
            class="cyber-input min-h-[80px] resize-none"
          ></textarea>
        </div>

        <!-- Label -->
        <div>
          <label class="block text-sm text-cyber-muted mb-2">地址标签</label>
          <div class="flex gap-2">
            <button 
              v-for="label in labels" 
              :key="label.value"
              @click="form.label = label.value"
              :class="[
                'px-4 py-2 rounded-full text-sm transition-all',
                form.label === label.value
                  ? 'bg-cyber-gradient text-white'
                  : 'bg-cyber-card text-cyber-muted hover:text-cyber-text'
              ]"
            >
              {{ label.name }}
            </button>
          </div>
        </div>

        <!-- Default Address -->
        <div class="flex items-center justify-between py-2">
          <span class="text-cyber-text">设为默认地址</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="form.isDefault"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-cyber-border rounded-full peer peer-checked:bg-cyber-gradient transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6">
        <button 
          @click="handleSave"
          :disabled="!canSave || userStore.loading"
          class="cyber-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="userStore.loading" class="animate-spin mr-2">⟳</span>
          {{ userStore.loading ? '保存中...' : '保存地址' }}
        </button>
      </div>

      <!-- Delete Button (Editing Only) -->
      <div v-if="isEditing" class="mt-4">
        <button 
          @click="handleDelete"
          class="w-full py-4 rounded-xl bg-cyber-danger/20 border border-cyber-danger/50 text-cyber-danger font-medium hover:bg-cyber-danger/30 transition-colors"
        >
          删除地址
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, type Address } from '~/stores/user'

const route = useRoute()
const userStore = useUserStore()

// Check if editing
const isEditing = computed(() => !!route.query.id)

// Labels
const labels = [
  { value: 'home', name: '家' },
  { value: 'work', name: '公司' },
  { value: 'other', name: '其他' }
]

// Provinces (simplified for demo)
const provinces = ['北京市', '上海市', '广东省', '浙江省', '江苏省', '四川省']

// Cities by province (simplified)
const citiesByProvince: Record<string, string[]> = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '广东省': ['广州市', '深圳市', '东莞市', '佛山市'],
  '浙江省': ['杭州市', '宁波市', '温州市'],
  '江苏省': ['南京市', '苏州市', '无锡市'],
  '四川省': ['成都市', '绵阳市', '德阳市']
}

// Districts by city (simplified)
const districtsByCity: Record<string, string[]> = {
  '北京市': ['东城区', '西城区', '朝阳区', '海淀区'],
  '上海市': ['黄浦区', '徐汇区', '浦东新区'],
  '广州市': ['天河区', '越秀区', '海珠区', '番禺区'],
  '深圳市': ['南山区', '福田区', '罗湖区', '龙岗区'],
  '东莞市': ['莞城区', '南城区', '东城区'],
  '佛山市': ['禅城区', '南海区', '顺德区'],
  '杭州市': ['西湖区', '上城区', '拱墅区'],
  '宁波市': ['海曙区', '江北区', '鄞州区'],
  '温州市': ['鹿城区', '龙湾区'],
  '南京市': ['玄武区', '秦淮区', '鼓楼区'],
  '苏州市': ['姑苏区', '工业园区'],
  '无锡市': ['梁溪区', '锡山区'],
  '成都市': ['锦江区', '青羊区', '金牛区', '武侯区'],
  '绵阳市': ['涪城区', '游仙区'],
  '德阳市': ['旌阳区']
}

// Form
const form = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  label: 'other',
  isDefault: false
})

// Watch province to reset city
watch(() => form.value.province, () => {
  form.value.city = ''
  form.value.district = ''
})

// Watch city to reset district
watch(() => form.value.city, () => {
  form.value.district = ''
})

// Computed cities
const cities = computed(() => {
  return citiesByProvince[form.value.province] || []
})

// Computed districts
const districts = computed(() => {
  return districtsByCity[form.value.city] || []
})

// Can save
const canSave = computed(() => {
  return (
    form.value.name.trim() &&
    form.value.phone.length === 11 &&
    form.value.province &&
    form.value.city &&
    form.value.district &&
    form.value.detail.trim()
  )
})

// Get address by id
const getAddressById = (id: string): Address | undefined => {
  return userStore.addresses.find(addr => addr.id === id)
}

// Load address for editing
const loadAddress = (id: string) => {
  const address = getAddressById(id)
  if (address) {
    form.value = {
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      label: address.label || 'other',
      isDefault: address.isDefault
    }
  }
}

// Handle save
const handleSave = async () => {
  if (!canSave.value) return

  if (isEditing.value) {
    // Update existing address
    const result = await userStore.updateAddress(route.query.id as string, {
      name: form.value.name,
      phone: form.value.phone,
      province: form.value.province,
      city: form.value.city,
      district: form.value.district,
      detail: form.value.detail,
      label: form.value.label as any,
      isDefault: form.value.isDefault
    })

    if (result.success) {
      navigateTo('/address')
    }
  } else {
    // Add new address
    const result = await userStore.addAddress({
      name: form.value.name,
      phone: form.value.phone,
      province: form.value.province,
      city: form.value.city,
      district: form.value.district,
      detail: form.value.detail,
      label: form.value.label as any,
      isDefault: form.value.isDefault
    })

    if (result.success) {
      navigateTo('/address')
    }
  }
}

// Handle delete
const handleDelete = async () => {
  if (isEditing.value && confirm('确定要删除该地址吗？')) {
    const result = await userStore.deleteAddress(route.query.id as string)
    if (result.success) {
      navigateTo('/address')
    }
  }
}

// Initialize
onMounted(async () => {
  await userStore.fetchAddresses()
  
  if (isEditing.value) {
    loadAddress(route.query.id as string)
  }
})

useHead({
  title: '编辑地址 - COCO CLAW'
})
</script>
