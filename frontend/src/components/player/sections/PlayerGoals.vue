<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">My Goals</h2>
      <div class="flex gap-2">
        <select 
          v-model="selectedStatus"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="achieved">Achieved</option>
          <option value="missed">Missed</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading your goals...</p>
    </div>

    <!-- Goals List -->
    <div v-else-if="filteredGoals.length > 0" class="space-y-4">
      <div 
        v-for="goal in filteredGoals" 
        :key="goal._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ goal.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ goal.description }}</p>
          </div>
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              goal.status === 'achieved' ? 'bg-green-100 text-green-800' :
              goal.status === 'missed' ? 'bg-red-100 text-red-800' :
              goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ formatGoalStatus(goal.status) }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Target: {{ goal.targetValue }} {{ goal.targetType }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Deadline: {{ formatDate(goal.deadline) }}
          </div>
        </div>

        <div class="mt-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm font-medium text-gray-700">{{ goal.currentValue || 0 }}/{{ goal.targetValue }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full bg-blue-600" 
              :style="{ width: calculateProgress(goal) + '%' }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No goals set</h3>
      <p class="mt-1 text-sm text-gray-500">Your coach hasn't set any goals for you yet.</p>
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
const playerGoals = ref([]);
const selectedStatus = ref('');
const loading = ref(false);

// Computed properties
const filteredGoals = computed(() => {
  if (!selectedStatus.value) {
    return playerGoals.value;
  }
  return playerGoals.value.filter(goal => goal.status === selectedStatus.value);
});

// Fetch player goals
onMounted(async () => {
  await fetchPlayerGoals();
});

async function fetchPlayerGoals() {
  try {
    loading.value = true;
    const response = await axios.get(`${API}/players/goals`, { withCredentials: true });
    playerGoals.value = response.data.goals || [];
  } catch (error) {
    console.error('Error fetching player goals:', error);
    playerGoals.value = [];
  } finally {
    loading.value = false;
  }
}

function formatGoalStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'achieved': 'Achieved',
    'missed': 'Missed'
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateProgress(goal) {
  if (!goal.targetValue) return 0;
  const progress = (goal.currentValue || 0) / goal.targetValue * 100;
  return Math.min(100, Math.max(0, progress));
}
</script>