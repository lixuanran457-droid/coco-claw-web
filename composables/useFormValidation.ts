import { reactive, computed } from 'vue'

/**
 * 表单验证 composable
 * 使用方式:
 * const { rules, validate, validateField, clearValidate } = useFormValidation({
 *   email: [{ type: 'required', message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
 *   password: [{ type: 'required', message: '请输入密码' }, { type: 'minLength', value: 6, message: '密码至少6位' }]
 * })
 */
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  message?: string
  value?: any
  validator?: (value: any) => boolean | string
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export function useFormValidation(initialRules: ValidationRules = {}) {
  const rules = reactive<ValidationRules>({ ...initialRules })
  const errors = reactive<Record<string, string>>({})
  const touched = reactive<Record<string, boolean>>({})

  // 验证规则
  const validators: Record<string, (value: any, rule: ValidationRule) => string | null> = {
    required: (value, rule) => {
      if (value === null || value === undefined || value === '') {
        return rule.message || '此字段为必填项'
      }
      return null
    },
    email: (value, rule) => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return rule.message || '邮箱格式不正确'
      }
      return null
    },
    minLength: (value, rule) => {
      if (!value) return null
      if (value.length < (rule.value || 0)) {
        return rule.message || `至少${rule.value}个字符`
      }
      return null
    },
    maxLength: (value, rule) => {
      if (!value) return null
      if (value.length > (rule.value || 0)) {
        return rule.message || `最多${rule.value}个字符`
      }
      return null
    },
    pattern: (value, rule) => {
      if (!value) return null
      const regex = rule.value instanceof RegExp ? rule.value : new RegExp(rule.value)
      if (!regex.test(value)) {
        return rule.message || '格式不正确'
      }
      return null
    },
    custom: (value, rule) => {
      if (rule.validator) {
        const result = rule.validator(value)
        if (typeof result === 'string') return result
        if (!result) return rule.message || '验证失败'
      }
      return null
    }
  }

  // 验证单个字段
  const validateField = (field: string, value: any): boolean => {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    for (const rule of fieldRules) {
      const validator = validators[rule.type]
      if (validator) {
        const error = validator(value, rule)
        if (error) {
          errors[field] = error
          return false
        }
      }
    }

    errors[field] = ''
    return true
  }

  // 验证所有字段
  const validate = (values: Record<string, any>): boolean => {
    let isValid = true
    for (const field in rules) {
      if (!validateField(field, values[field])) {
        isValid = false
      }
    }
    return isValid
  }

  // 标记字段已触碰
  const touch = (field: string) => {
    touched[field] = true
  }

  // 清除验证
  const clearValidate = (field?: string) => {
    if (field) {
      errors[field] = ''
      touched[field] = false
    } else {
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
      Object.keys(touched).forEach(key => {
        touched[key] = false
      })
    }
  }

  // 获取字段错误
  const getFieldError = (field: string) => {
    return touched[field] ? errors[field] : ''
  }

  // 是否有错误
  const hasError = computed(() => {
    return Object.values(errors).some(e => e !== '')
  })

  // 添加规则
  const addRule = (field: string, rule: ValidationRule) => {
    if (!rules[field]) {
      rules[field] = []
    }
    rules[field].push(rule)
  }

  // 移除规则
  const removeRule = (field: string, type: string) => {
    if (rules[field]) {
      rules[field] = rules[field].filter(r => r.type !== type)
    }
  }

  return {
    rules,
    errors,
    touched,
    validate,
    validateField,
    touch,
    clearValidate,
    getFieldError,
    hasError,
    addRule,
    removeRule
  }
}

/**
 * 常用验证规则预设
 */
export const commonRules = {
  email: [
    { type: 'required', message: '请输入邮箱地址' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  password: [
    { type: 'required', message: '请输入密码' },
    { type: 'minLength', value: 6, message: '密码至少6位' }
  ],
  captcha: [
    { type: 'required', message: '请输入验证码' },
    { type: 'minLength', value: 4, message: '验证码至少4位' }
  ],
  phone: [
    { type: 'required', message: '请输入手机号' },
    { type: 'pattern', value: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
  ],
  nickname: [
    { type: 'maxLength', value: 20, message: '昵称最多20个字符' }
  ]
}
