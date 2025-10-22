<template>
  <div class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-100">
    <div class="flex items-center gap-3 mb-2">
      <div class="relative">
        <div class="absolute inset-0 rounded-full blur-lg bg-green-200 opacity-0 group-hover:opacity-60 transition"></div>
        <svg class="relative w-8 h-8 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-green-700">{{ club.name }}</h3>
    </div>
    <p class="text-gray-600">{{ club.location }}</p>
    <p class="text-gray-500 text-sm">{{ club.description }}</p>
    <div class="mt-3 flex flex-wrap gap-2">
      <span v-for="tag in club.tags" :key="tag" class="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded text-xs font-medium">{{ tag }}</span>
    </div>
  </div>
</template>
<script setup>
defineProps({ club: Object });
</script>