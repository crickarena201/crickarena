<template>
  <PlayerFeedbackSection :player-data="playerData" />
</template>

<script setup>
import PlayerFeedbackSection from '../../components/player/sections/PlayerFeedback.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>