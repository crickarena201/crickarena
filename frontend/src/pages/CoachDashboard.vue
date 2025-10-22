<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- External Platform Header -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">Coach Portal</h1>
            </div>
            <div class="hidden md:block ml-6">
              <div class="flex space-x-4">
                <a href="#" class="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Training</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Players</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Analytics</a>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="ml-3 relative">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">{{ coachData?.fullName || 'Coach' }}</span>
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 font-medium text-sm">{{ coachData?.fullName?.charAt(0) || 'C' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Welcome, {{ coachData?.fullName || 'Coach' }}!</h1>
            <p class="text-blue-100">Manage your coaching activities and player development</p>
          </div>
          <div class="text-right">
            <span 
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                coachData?.currentClub ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]"
            >
              <span class="w-2 h-2 mr-2 rounded-full" :class="coachData?.currentClub ? 'bg-green-500' : 'bg-yellow-500'"></span>
              {{ coachData?.currentClub ? 'Associated with Club' : 'No Club Association' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Club Association Status -->
      <div v-if="coachData" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Club Association</h2>
        </div>
        
        <div v-if="coachData.currentClub" class="bg-green-50 border border-green-200 rounded-xl p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-green-800">Currently Associated</h3>
              <p class="text-green-700 mt-1">
                You are coaching at <strong>{{ coachData.currentClub.clubName || coachData.currentClub.name }}</strong> in {{ coachData.currentClub.district }}.
              </p>
              <div class="mt-2 flex items-center text-sm text-green-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Administrative assignment
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-yellow-800">No Club Association</h3>
              <p class="text-yellow-700 mt-1">
                You are not currently associated with any club. Club associations are managed by administrators.
              </p>
              <div class="mt-3">
                <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contact Administrator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Players Coached</h3>
              <p class="text-2xl font-bold text-gray-900">{{ coachData?.playersCoached || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Training Sessions</h3>
              <p class="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Programs</h3>
              <p class="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Analytics -->
        <div class="lg:col-span-2 space-y-8">
          <CoachAnalytics />
          <PlayerProgressTracking />
        </div>
        
        <!-- Right Column - Training & Sessions -->
        <div class="space-y-8">
          <TrainingPrograms />
          <SessionManagement />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import CoachAnalytics from '../components/coach/CoachAnalytics.vue';
import TrainingPrograms from '../components/coach/TrainingPrograms.vue';
import SessionManagement from '../components/coach/SessionManagement.vue';
import PlayerProgressTracking from '../components/coach/PlayerProgressTracking.vue';

const auth = useAuthStore();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const coachData = ref(null);

onMounted(async () => {
  if (!auth.initialized) {
    try {
      await auth.init?.();
    } catch (e) {
      console.error('Auth init failed:', e);
    }
  }

  await loadCoachData();
});

async function loadCoachData() {
  try {
    const response = await axios.get(`${API}/coaches/profile`, { withCredentials: true });
    coachData.value = response.data.coach;
  } catch (error) {
    console.error('Error loading coach data:', error);
  }
}

function formatExperience(experience) {
  if (!experience) return 'N/A';
  return experience.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
</script>