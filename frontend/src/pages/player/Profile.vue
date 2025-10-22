<template>
  <PlayerProfileSection :player-data="playerData" />
</template>

<script setup>
import PlayerProfileSection from '../../components/player/sections/Profile.vue';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});
</script>