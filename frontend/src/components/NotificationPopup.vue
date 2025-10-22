<template>
  <div v-if="notifications.length > 0" class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="[
        'notification',
        `notification-${notification.type}`,
        { 'notification-entering': notification.entering }
      ]"
    >
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <svg v-else-if="notification.type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <div class="notification-content">
        <div class="notification-title">{{ notification.title }}</div>
        <div v-if="notification.message" class="notification-message">{{ notification.message }}</div>
      </div>
      
      <button @click="removeNotification(notification.id)" class="notification-close">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'NotificationPopup',
  setup() {
    const notifications = ref([]);
    let notificationId = 0;

    const addNotification = (type, title, message = '', duration = 5000) => {
      const id = ++notificationId;
      const notification = {
        id,
        type,
        title,
        message,
        entering: true
      };

      notifications.value.push(notification);

      // Remove entering class after animation
      setTimeout(() => {
        const notif = notifications.value.find(n => n.id === id);
        if (notif) notif.entering = false;
      }, 100);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    };

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index > -1) {
        notifications.value.splice(index, 1);
      }
    };

    const showSuccess = (title, message = '', duration = 4000) => {
      return addNotification('success', title, message, duration);
    };

    const showError = (title, message = '', duration = 6000) => {
      return addNotification('error', title, message, duration);
    };

    const showWarning = (title, message = '', duration = 5000) => {
      return addNotification('warning', title, message, duration);
    };

    const showInfo = (title, message = '', duration = 4000) => {
      return addNotification('info', title, message, duration);
    };

    // Global notification methods
    onMounted(() => {
      window.$notify = {
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo
      };
    });

    return {
      notifications,
      removeNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo
    };
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateX(100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.notification:not(.notification-entering) {
  transform: translateX(0);
  opacity: 1;
}

.notification-success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%);
  color: white;
}

.notification-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%);
  color: white;
}

.notification-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%);
  color: white;
}

.notification-info {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%);
  color: white;
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
}

.notification-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: currentColor;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.3);
  opacity: 1;
  transform: scale(1.1);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .notification {
    padding: 14px;
  }
  
  .notification-title {
    font-size: 13px;
  }
  
  .notification-message {
    font-size: 12px;
  }
}
</style>
