<template>
  <section>
    <h2 class="text-2xl font-bold mb-5 text-blue-700 flex items-center gap-2">
      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      Upcoming Tournaments
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="t in tournaments" :key="t._id" class="group bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-200">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Upcoming
          </span>
          <span class="ml-auto text-gray-400 text-xs">{{ new Date(t.startDate || t.date).toLocaleDateString() }}</span>
        </div>
        <h3 class="text-lg font-bold text-blue-700">{{ t.name }}</h3>
        <p class="text-gray-600">{{ t.location || 'Location TBD' }}</p>
        <p class="text-gray-500 text-sm mt-1">{{ t.description || 'No description available' }}</p>
        <div class="mt-3 flex items-center text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition">
          <span>View details</span>
          <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <p v-if="!tournaments.length" class="text-gray-500 mt-4">No upcoming tournaments.</p>
  </section>
</template>
<script setup>
defineProps({ tournaments: Array });
</script>