import { showToast, showFailToast, showSuccessToast } from 'vant'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmType?: 'primary' | 'danger' | 'warning'
}

/**
 * 确认弹窗 composable
 * 使用方式:
 * const { confirm, confirmDanger, alert } = useConfirm()
 *
 * // 普通确认
 * const isConfirmed = await confirm({
 *   title: '确认删除',
 *   message: '确定要删除这个API Key吗？此操作不可恢复。',
 *   confirmText: '删除',
 *   confirmType: 'danger'
 * })
 *
 * // 危险操作确认（红色按钮）
 * await confirmDanger({
 *   title: '确认重置',
 *   message: '确定要重置密码吗？'
 * })
 *
 * // 简单提示
 * await alert({
 *   message: '操作完成！'
 * })
 */

// 简单确认函数
export const useConfirm = () => {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const {
        title = '确认操作',
        message,
        confirmText = '确认',
        cancelText = '取消',
        confirmType = 'primary'
      } = options

      const typeColors: Record<string, string> = {
        primary: '#3b82f6',
        danger: '#ef4444',
        warning: '#f59e0b'
      }

      // 创建遮罩层
      const overlay = document.createElement('div')
      overlay.className = 'confirm-overlay'
      overlay.innerHTML = `
        <div class="confirm-dialog">
          <div class="confirm-header">${title}</div>
          <div class="confirm-message">${message}</div>
          <div class="confirm-actions">
            <button class="confirm-cancel">${cancelText}</button>
            <button class="confirm-btn" style="background: ${typeColors[confirmType]}">${confirmText}</button>
          </div>
        </div>
      `

      // 添加样式
      const style = document.createElement('style')
      style.textContent = `
        .confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
        }
        .confirm-dialog {
          background: #1a1a2e;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 16px;
          width: 85%;
          max-width: 340px;
          padding: 24px;
          animation: scaleIn 0.2s ease;
        }
        .confirm-header {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
        }
        .confirm-message {
          font-size: 14px;
          color: rgba(165, 180, 252, 0.8);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
        }
        .confirm-cancel,
        .confirm-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .confirm-cancel {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: rgba(165, 180, 252, 0.8);
        }
        .confirm-cancel:active {
          background: rgba(99, 102, 241, 0.2);
        }
        .confirm-btn {
          border: none;
          color: white;
        }
        .confirm-btn:active {
          transform: scale(0.98);
          opacity: 0.9;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `
      document.head.appendChild(style)
      document.body.appendChild(overlay)

      // 取消按钮
      overlay.querySelector('.confirm-cancel')?.addEventListener('click', () => {
        document.body.removeChild(overlay)
        style.remove()
        resolve(false)
      })

      // 确认按钮
      overlay.querySelector('.confirm-btn')?.addEventListener('click', () => {
        document.body.removeChild(overlay)
        style.remove()
        resolve(true)
      })

      // 点击遮罩关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay)
          style.remove()
          resolve(false)
        }
      })
    })
  }

  // 危险操作确认（红色）
  const confirmDanger = (options: Omit<ConfirmOptions, 'confirmType'>) => {
    return confirm({ ...options, confirmType: 'danger', confirmText: options.confirmText || '确认删除' })
  }

  // 警告确认（橙色）
  const confirmWarning = (options: Omit<ConfirmOptions, 'confirmType'>) => {
    return confirm({ ...options, confirmType: 'warning' })
  }

  // 简单提示弹窗
  const alert = (message: string) => {
    return confirm({
      title: '提示',
      message,
      cancelText: '我知道了',
      confirmText: '',
      confirmType: 'primary'
    })
  }

  // 操作成功提示（带震动）
  const success = (message: string) => {
    showSuccessToast(message)
    // 移动端震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  // 操作失败提示（带震动）
  const error = (message: string) => {
    showFailToast(message)
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }
  }

  // 信息提示
  const info = (message: string) => {
    showToast(message)
  }

  return {
    confirm,
    confirmDanger,
    confirmWarning,
    alert,
    success,
    error,
    info
  }
}
