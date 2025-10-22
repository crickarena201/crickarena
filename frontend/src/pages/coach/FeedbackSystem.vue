<template>
  <FeedbackSystemSection :coach-data="coachData" />
</template>

<script setup>
import FeedbackSystemSection from '../../components/coach/sections/FeedbackSystem.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>