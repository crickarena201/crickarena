<template>
  <TrainingProgramsSection :coach-data="coachData" />
</template>

<script setup>
import TrainingProgramsSection from '../../components/coach/sections/TrainingPrograms.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>