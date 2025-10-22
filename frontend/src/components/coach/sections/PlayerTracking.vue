<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Players</h2>
      <div class="flex gap-2">
        <select 
          v-model="selectedProgram"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Programs</option>
          <option 
            v-for="program in trainingPrograms" 
            :key="program._id" 
            :value="program._id"
          >
            {{ program.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading players...</p>
    </div>

    <!-- Players List -->
    <div v-else-if="filteredPlayers.length > 0" class="space-y-4">
      <div 
        v-for="player in filteredPlayers" 
        :key="player._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ player.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ player.preferredPosition }}</p>
          </div>
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ player.programTitle || 'No Program' }}
          </span>
        </div>

        <div class="mt-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">Overall Progress</span>
            <span class="text-sm font-medium text-gray-700">{{ player.overallProgress || 0 }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full bg-blue-600" 
              :style="{ width: (player.overallProgress || 0) + '%' }">
            </div>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Attendance: {{ player.attendanceRate || 0 }}%
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Sessions: {{ player.sessionsCompleted || 0 }}/{{ player.totalSessions || 0 }}
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button 
            @click="viewPlayerDetails(player)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
          <button 
            @click="updateProgress(player)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Progress
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No players found</h3>
      <p class="mt-1 text-sm text-gray-500">There are no players in your club yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const router = useRouter();

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    required: true
  }
});

// Reactive data
const players = ref([]);
const trainingPrograms = ref([]);
const selectedProgram = ref('');
const loading = ref(false);

// Computed properties
const filteredPlayers = computed(() => {
  if (!selectedProgram.value) {
    return players.value;
  }
  return players.value.filter(player => player.programId === selectedProgram.value);
});

// Fetch player progress data
onMounted(async () => {
  await Promise.all([
    fetchPlayerProgress(),
    fetchTrainingPrograms()
  ]);
});

async function fetchPlayerProgress() {
  try {
    loading.value = true;
    // Fetch real player data from the coach's club
    const response = await axios.get(`${API}/coaches/club/players`, { withCredentials: true });
    players.value = response.data.players || [];
  } catch (error) {
    console.error('Error fetching player progress:', error);
    // Fallback to mock data if API fails
    players.value = [
      {
        _id: '101',
        name: 'Rahul Sharma',
        preferredPosition: 'Batsman',
        programId: props.coachData?.trainingPrograms?.[0]?._id || '1',
        programTitle: props.coachData?.trainingPrograms?.[0]?.title || 'Advanced Batting Techniques',
        overallProgress: 78,
        attendanceRate: 92,
        sessionsCompleted: 12,
        totalSessions: 15,
        lastUpdated: '2023-03-15'
      },
      {
        _id: '102',
        name: 'Vikram Patel',
        preferredPosition: 'Bowler',
        programId: props.coachData?.trainingPrograms?.[0]?._id || '1',
        programTitle: props.coachData?.trainingPrograms?.[0]?.title || 'Advanced Batting Techniques',
        overallProgress: 82,
        attendanceRate: 85,
        sessionsCompleted: 14,
        totalSessions: 15,
        lastUpdated: '2023-03-14'
      },
      {
        _id: '103',
        name: 'Amit Kumar',
        preferredPosition: 'Wicket Keeper',
        programId: props.coachData?.trainingPrograms?.[1]?._id || '2',
        programTitle: props.coachData?.trainingPrograms?.[1]?.title || 'Bowling Mastery',
        overallProgress: 65,
        attendanceRate: 78,
        sessionsCompleted: 8,
        totalSessions: 12,
        lastUpdated: '2023-03-12'
      }
    ];
  } finally {
    loading.value = false;
  }
}

async function fetchTrainingPrograms() {
  try {
    // Use the training programs from the coach data
    trainingPrograms.value = props.coachData?.trainingPrograms || [];
  } catch (error) {
    console.error('Error fetching training programs:', error);
  }
}

function viewPlayerDetails(player) {
  // Navigate to the player details page
  router.push({ name: 'coach-panel-player-details', params: { playerId: player._id } });
}

function updateProgress(player) {
  // In a real implementation, this would open a modal to update progress
  alert(`Updating progress for: ${player.name}`);
}
</script>