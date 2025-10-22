<template>
  <CoachProfileSection :coach-data="coachData" />
</template>

<script setup>
import CoachProfileSection from '../../components/coach/sections/Profile.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>