<template>
  <PlayerTrackingSection :coach-data="coachData" />
</template>

<script setup>
import PlayerTrackingSection from '../../components/coach/sections/PlayerTracking.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>