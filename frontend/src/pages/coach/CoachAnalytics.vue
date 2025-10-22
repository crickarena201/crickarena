<template>
  <CoachAnalyticsSection :coach-data="coachData" />
</template>

<script setup>
import CoachAnalyticsSection from '../../components/coach/sections/CoachAnalytics.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>