<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6">
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
    <div v-if="coachData" class="bg-white rounded-2xl shadow-lg p-6">
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
              You are coaching at <strong>{{ coachData.currentClub.clubName || coachData.currentClub.name }}</strong> in {{ coachData.currentClub.district }}, {{ coachData.currentClub.city }}.
            </p>
            <div class="mt-2 flex items-center text-sm text-green-600">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Administrative assignment
            </div>
            <!-- Resign Button -->
            <div class="mt-3">
              <button 
                @click="resignFromClub"
                :disabled="isResigning"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {{ isResigning ? 'Resigning...' : 'Resign from Club' }}
              </button>
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
          <div class="ml-3 flex-1">
            <h3 class="text-lg font-medium text-yellow-800">No Club Association</h3>
            <p class="text-yellow-700 mt-1">
              You are not currently associated with any club. 
              <span v-if="pendingApplication">You have a pending application to <strong>{{ pendingApplication.clubName }}</strong>.</span>
              <span v-else>Find clubs to apply for coaching opportunities.</span>
            </p>
            <div class="mt-3 flex gap-3">
              <RouterLink 
                to="/clubs" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Clubs
              </RouterLink>
              <div v-if="pendingApplication" class="inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md shadow-sm text-yellow-800 bg-yellow-100">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Application Pending
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

    <!-- Recent Activity -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div class="space-y-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Created new training program: Advanced Batting Techniques</p>
            <p class="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Scheduled session for tomorrow: Bowling Mastery</p>
            <p class="text-xs text-gray-500">Yesterday</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">Updated player progress report for Rahul Sharma</p>
            <p class="text-xs text-gray-500">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props properly
const props = defineProps({
  coachData: {
    type: Object,
    default: null
  },
  applications: {
    type: Array,
    default: () => []
  }
});

const isResigning = ref(false);

// Computed property to get the pending application
const pendingApplication = computed(() => {
  if (!props.applications || props.applications.length === 0) return null;
  const pending = props.applications.find(app => app.status === 'pending');
  return pending ? { 
    clubName: pending.club?.name || pending.club?.clubName || 'Unknown Club',
    appliedAt: pending.appliedAt
  } : null;
});

// Function to resign from club
async function resignFromClub() {
  const resignReason = prompt('Please provide a reason for resigning from this club:');
  
  if (resignReason === null) {
    // User cancelled the prompt
    return;
  }
  
  if (resignReason.trim().length === 0) {
    alert('Please provide a reason for resigning.');
    return;
  }

  isResigning.value = true;
  try {
    await axios.post(`${API}/coaches/resign-from-club`, { resignReason: resignReason.trim() }, { withCredentials: true });
    alert('Successfully resigned from the club.');
    // Reload the page to reflect the changes
    window.location.reload();
  } catch (error) {
    console.error('Error resigning from club:', error);
    alert('Failed to resign from the club. Please try again.');
  } finally {
    isResigning.value = false;
  }
}
</script>