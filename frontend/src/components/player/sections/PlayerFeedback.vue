<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Coach Feedback</h2>
      <div class="flex gap-2">
        <select 
          v-model="selectedType"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Types</option>
          <option value="general">General</option>
          <option value="performance">Performance</option>
          <option value="behavior">Behavior</option>
          <option value="technique">Technique</option>
          <option value="attendance">Attendance</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading feedback from your coach...</p>
    </div>

    <!-- Feedback List -->
    <div v-else-if="filteredFeedback.length > 0" class="space-y-4">
      <div 
        v-for="feedback in filteredFeedback" 
        :key="feedback._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ feedback.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ feedback.content }}</p>
          </div>
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              feedback.priority === 'high' ? 'bg-red-100 text-red-800' :
              feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            ]"
          >
            {{ feedback.priority }} priority
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Type: {{ formatFeedbackType(feedback.type) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(feedback.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No feedback received</h3>
      <p class="mt-1 text-sm text-gray-500">Your coach hasn't provided any feedback yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    required: true
  }
});

// Reactive data
const playerFeedback = ref([]);
const selectedType = ref('');
const loading = ref(false);

// Computed properties
const filteredFeedback = computed(() => {
  if (!selectedType.value) {
    return playerFeedback.value;
  }
  return playerFeedback.value.filter(feedback => feedback.type === selectedType.value);
});

// Fetch player feedback
onMounted(async () => {
  await fetchPlayerFeedback();
});

async function fetchPlayerFeedback() {
  try {
    loading.value = true;
    const response = await axios.get(`${API}/players/feedback`, { withCredentials: true });
    playerFeedback.value = response.data.feedback || [];
  } catch (error) {
    console.error('Error fetching player feedback:', error);
    playerFeedback.value = [];
  } finally {
    loading.value = false;
  }
}

function formatFeedbackType(type) {
  const typeMap = {
    'general': 'General',
    'performance': 'Performance',
    'behavior': 'Behavior',
    'technique': 'Technique',
    'attendance': 'Attendance'
  };
  return typeMap[type] || type;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
</script>