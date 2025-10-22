<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Players Coached</h3>
            <p class="text-2xl font-bold text-gray-900">{{ playersCoached }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-green-50 rounded-xl p-5 border border-green-100">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Training Sessions</h3>
            <p class="text-2xl font-bold text-gray-900">{{ trainingSessions }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-purple-50 rounded-xl p-5 border border-purple-100">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">Programs</h3>
            <p class="text-2xl font-bold text-gray-900">{{ trainingPrograms }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Player Progress Chart -->
      <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Player Progress Distribution</h3>
        <div class="space-y-3">
          <div v-for="(stat, index) in playerProgressStats" :key="index">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ stat.category }}</span>
              <span class="text-sm font-medium text-gray-700">{{ stat.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full" 
                :class="stat.color"
                :style="{ width: stat.percentage + '%' }">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Session Attendance Chart -->
      <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Session Attendance</h3>
        <div class="space-y-3">
          <div v-for="(stat, index) in attendanceStats" :key="index">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ stat.session }}</span>
              <span class="text-sm font-medium text-gray-700">{{ stat.attendance }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full bg-blue-600" 
                :style="{ width: stat.attendance + '%' }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    required: true
  }
});

// Reactive data
const playersCoached = ref(0);
const trainingSessions = ref(0);
const trainingPrograms = ref(0);
const playerProgressStats = ref([]);
const attendanceStats = ref([]);

// Fetch analytics data
onMounted(async () => {
  try {
    // In a real implementation, this would fetch actual analytics data from the backend
    // For now, we'll use the data from the coach profile
    playersCoached.value = props.coachData?.statistics?.totalPlayersCoached || props.coachData?.playersCoached || 0;
    trainingPrograms.value = props.coachData?.trainingPrograms?.length || 0;
    
    // Mock data - in a real implementation, this would come from the backend
    trainingSessions.value = 12;
    
    playerProgressStats.value = [
      { category: 'Beginner', percentage: 25, color: 'bg-blue-600' },
      { category: 'Intermediate', percentage: 45, color: 'bg-green-600' },
      { category: 'Advanced', percentage: 30, color: 'bg-purple-600' }
    ];
    
    attendanceStats.value = [
      { session: 'Batting Practice', attendance: 85 },
      { session: 'Bowling Techniques', attendance: 78 },
      { session: 'Fielding Drills', attendance: 92 },
      { session: 'Fitness Training', attendance: 88 }
    ];
  } catch (error) {
    console.error('Error fetching analytics data:', error);
  }
});
</script>