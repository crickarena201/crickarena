<template>
  <div v-if="can"><slot /></div>
  <div v-else class="p-4 text-sm text-red-600">You do not have access to this section.</div>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';

const props = defineProps({ roles: { type: Array, default: () => [] } });
const auth = useAuthStore();
const can = computed(() => {
  // in a real app, fetch profile to get role; for now read from JWT claims or store it after login
  // placeholder: allow all if no roles passed
  return props.roles.length === 0;
});
</script>