<template>
  <section>
    <h2 class="text-2xl font-bold mb-5 text-gray-700 flex items-center gap-2">
      <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="10" />
      </svg>
      Tournament History
    </h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="t in tournaments" :key="t._id" class="group bg-white rounded-2xl shadow p-5 border border-gray-100 hover:shadow-lg hover:border-gray-300 transition">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold border border-gray-200">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            Past
          </span>
          <span class="ml-auto text-gray-400 text-xs">{{ new Date(t.endDate || t.date).toLocaleDateString() }}</span>
        </div>
        <h3 class="text-lg font-bold text-gray-800">{{ t.name }}</h3>
        <p class="text-gray-600">{{ t.location || 'Location TBD' }}</p>
        <p class="text-gray-500 text-sm mt-1">{{ t.description || 'No description available' }}</p>
        <div class="mt-3 flex items-center text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition">
          <span>View summary</span>
          <svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <p v-if="!tournaments.length" class="text-gray-500 mt-4">No tournament history yet.</p>
  </section>
</template>
<script setup>
defineProps({ tournaments: Array });
</script>