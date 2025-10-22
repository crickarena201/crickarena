<template>
  <PlayerMatchesSection :player-data="playerData" />
</template>

<script setup>
import PlayerMatchesSection from '../../components/player/sections/Matches.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>