<template>
  <PlayerTrainingSection :player-data="playerData" />
</template>

<script setup>
import PlayerTrainingSection from '../../components/player/sections/Training.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>