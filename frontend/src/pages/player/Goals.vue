<template>
  <PlayerGoalsSection :player-data="playerData" />
</template>

<script setup>
import PlayerGoalsSection from '../../components/player/sections/PlayerGoals.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>