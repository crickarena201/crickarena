<template>
  <SessionsSection :coach-data="coachData" />
</template>

<script setup>
import SessionsSection from '../../components/coach/sections/Sessions.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>