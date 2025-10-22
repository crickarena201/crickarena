<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Player Details</h2>
      <button 
        @click="goBack"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Players
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading player details...</p>
    </div>

    <!-- Player Details -->
    <div v-else-if="player" class="space-y-6">
      <!-- Player Header -->
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0">
          <div class="w-32 h-32 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="player.profilePhotoUrl" 
              :src="player.profilePhotoUrl" 
              :alt="player.fullName"
              class="w-full h-full object-cover"
            >
            <svg v-else class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4-4 4 1.79 4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ player.fullName }}</h1>
          <p class="text-gray-600">{{ player.preferredPosition }}</p>
          
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-sm text-blue-800">Playing Experience</p>
              <p class="font-medium text-blue-900">{{ formatExperience(player.playingExperience) }}</p>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <p class="text-sm text-green-800">Jersey Number</p>
              <p class="font-medium text-green-900">{{ player.jerseyNumber || 'N/A' }}</p>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4">
              <p class="text-sm text-purple-800">Batting Style</p>
              <p class="font-medium text-purple-900">{{ formatStyle(player.battingStyle) }}</p>
            </div>
            
            <div class="bg-yellow-50 rounded-lg p-4">
              <p class="text-sm text-yellow-800">Bowling Style</p>
              <p class="font-medium text-yellow-900">{{ formatStyle(player.bowlingStyle) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Player Stats -->
      <div class="bg-gray-50 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-blue-600">{{ player.statistics?.matchesPlayed || 0 }}</p>
            <p class="text-sm text-gray-600">Matches</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-green-600">{{ player.statistics?.runsScored || 0 }}</p>
            <p class="text-sm text-gray-600">Runs</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-purple-600">{{ player.statistics?.wicketsTaken || 0 }}</p>
            <p class="text-sm text-gray-600">Wickets</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-yellow-600">{{ player.statistics?.catches || 0 }}</p>
            <p class="text-sm text-gray-600">Catches</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 text-center shadow-sm">
            <p class="text-2xl font-bold text-red-600">{{ player.statistics?.stumpings || 0 }}</p>
            <p class="text-sm text-gray-600">Stumpings</p>
          </div>
        </div>
      </div>

      <!-- Career History -->
      <div v-if="player.careerHistory && player.careerHistory.length > 0">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Career History</h3>
        
        <div class="space-y-4">
          <div 
            v-for="(history, index) in player.careerHistory" 
            :key="index"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex justify-between">
              <h4 class="font-medium text-gray-900">{{ history.teamName }}</h4>
              <span class="text-sm text-gray-500">{{ history.yearsPlayed }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ history.position }}</p>
            <p v-if="history.achievements" class="text-sm text-gray-700 mt-2">{{ history.achievements }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-gray-50 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ player.email }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600">Phone</p>
            <p class="font-medium">{{ player.phone }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-600">Address</p>
            <p class="font-medium">{{ player.address?.street }}</p>
            <p class="font-medium">{{ player.address?.city }}, {{ player.address?.district }}</p>
            <p class="font-medium">{{ player.address?.state }} - {{ player.address?.pincode }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Player not found</h3>
      <p class="mt-1 text-sm text-gray-500">The requested player could not be found.</p>
      <div class="mt-6">
        <button 
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Players
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const player = ref(null);
const loading = ref(false);

onMounted(async () => {
  await fetchPlayerDetails();
});

async function fetchPlayerDetails() {
  try {
    loading.value = true;
    const response = await axios.get(`${API}/coaches/club/player/${route.params.playerId}`, { withCredentials: true });
    player.value = response.data.player;
    
    // Set profile photo URL if available
    if (player.value.hasProfilePhoto) {
      player.value.profilePhotoUrl = `${API}/players/club/player/${player.value._id}/photo`;
    }
  } catch (error) {
    console.error('Error fetching player details:', error);
    player.value = null;
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'coach-panel-players' });
}

function formatExperience(exp) {
  if (!exp) return 'N/A';
  return exp.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatStyle(style) {
  if (!style) return 'N/A';
  return style.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
</script>