<template>
  <PlayerApplicationsSection :player-data="playerData" />
</template>

<script setup>
import PlayerApplicationsSection from '../../components/player/sections/Applications.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>