<template>
  <div class="club-manager-messages">
    <div class="page-header">
      <h2 class="page-title">Club Communication</h2>
      <p class="page-subtitle">Manage communications with your team members</p>
    </div>
    
    <Messaging />
  </div>
</template>

<script setup>
import Messaging from '../components/Messaging.vue';
</script>

<style scoped>
.club-manager-messages {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
}
</style>
