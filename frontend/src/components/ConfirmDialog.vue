<template>
  <div v-if="isVisible" class="confirm-overlay" @click.self="cancel">
    <div class="confirm-dialog">
      <div class="confirm-header">
        <div class="confirm-icon">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <div class="confirm-content">
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>
        </div>
      </div>
      
      <div class="confirm-actions">
        <button @click="cancel" class="btn-cancel">
          {{ cancelText }}
        </button>
        <button @click="confirm" class="btn-confirm" :class="{ 'btn-danger': isDangerous }">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ConfirmDialog',
  setup() {
    const isVisible = ref(false);
    const title = ref('');
    const message = ref('');
    const confirmText = ref('Confirm');
    const cancelText = ref('Cancel');
    const isDangerous = ref(false);
    let resolvePromise = null;

    const show = (options = {}) => {
      title.value = options.title || 'Confirm Action';
      message.value = options.message || 'Are you sure you want to proceed?';
      confirmText.value = options.confirmText || 'Confirm';
      cancelText.value = options.cancelText || 'Cancel';
      isDangerous.value = options.isDangerous || false;
      isVisible.value = true;

      return new Promise((resolve) => {
        resolvePromise = resolve;
      });
    };

    const confirm = () => {
      isVisible.value = false;
      if (resolvePromise) {
        resolvePromise(true);
        resolvePromise = null;
      }
    };

    const cancel = () => {
      isVisible.value = false;
      if (resolvePromise) {
        resolvePromise(false);
        resolvePromise = null;
      }
    };

    // Global confirm method
    window.$confirm = show;

    return {
      isVisible,
      title,
      message,
      confirmText,
      cancelText,
      isDangerous,
      show,
      confirm,
      cancel
    };
  }
};
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-dialog {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.confirm-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
}

.confirm-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.confirm-content {
  flex: 1;
  min-width: 0;
}

.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.confirm-message {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 80px;
}

.btn-cancel {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.btn-cancel:hover {
  background: rgba(148, 163, 184, 0.2);
  color: #475569;
  transform: translateY(-1px);
}

.btn-confirm {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.btn-confirm.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-confirm.btn-danger:hover {
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .confirm-dialog {
    margin: 20px;
    max-width: none;
  }
  
  .confirm-header {
    padding: 20px;
  }
  
  .confirm-actions {
    padding: 0 20px 20px 20px;
    flex-direction: column-reverse;
  }
  
  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
