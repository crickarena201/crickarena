<template>
  <GoalSettingSection :coach-data="coachData" />
</template>

<script setup>
import GoalSettingSection from '../../components/coach/sections/GoalSetting.vue';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  }
});
</script>