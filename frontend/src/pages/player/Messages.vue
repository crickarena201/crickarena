<template>
  <div class="player-messages">
    <div class="page-header">
      <h2 class="page-title">Team Messages</h2>
      <p class="page-subtitle">Stay connected with your coach and teammates</p>
    </div>
    
    <Messaging />
  </div>
</template>

<script setup>
import Messaging from '../../components/Messaging.vue';
</script>

<style scoped>
.player-messages {
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
