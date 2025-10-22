<template>
  <div class="coach-messages">
    <div class="page-header">
      <h2 class="page-title">Team Communication</h2>
      <p class="page-subtitle">Connect with your players and club management</p>
    </div>
    
    <Messaging />
  </div>
</template>

<script setup>
import Messaging from '../../components/Messaging.vue';
</script>

<style scoped>
.coach-messages {
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
