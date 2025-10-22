<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
    <!-- External Platform Header -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">Player Portal</h1>
            </div>
            <div class="hidden md:block ml-6">
              <div class="flex space-x-4">
                <a href="#" class="bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Performance</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Training</a>
                <a href="#" class="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium">Progress</a>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="ml-3 relative">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">{{ player?.fullName || 'Player' }}</span>
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span class="text-green-600 font-medium text-sm">{{ player?.fullName?.charAt(0) || 'P' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Welcome, {{ player?.fullName || 'Player' }}!</h1>
            <p class="text-green-100">Track your cricket journey and development</p>
          </div>
          <div class="text-right">
            <span 
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                player?.currentClub ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]"
            >
              <span class="w-2 h-2 mr-2 rounded-full" :class="player?.currentClub ? 'bg-green-500' : 'bg-yellow-500'"></span>
              {{ player?.currentClub ? 'Club Member' : 'No Club Membership' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Club Membership Status -->
      <div v-if="player" class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900">Club Membership</h2>
        </div>
        
        <div v-if="player.currentClub" class="bg-green-50 border border-green-200 rounded-xl p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-green-800">Current Membership</h3>
              <p class="text-green-700 mt-1">
                You are a member of <strong>{{ player.currentClub.name || player.currentClub.clubName }}</strong> in {{ player.currentClub.district }}, {{ player.currentClub.city }}.
              </p>
              <div class="mt-2 flex items-center text-sm text-green-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Since {{ formatDate(player.joinedDate) }}
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
              <h3 class="text-lg font-medium text-yellow-800">No Club Membership</h3>
              <p class="text-yellow-700 mt-1">
                You are not currently a member of any club. Apply to clubs to join their training programs.
              </p>
              <div class="mt-3">
                <button 
                  @click="showClubSearch = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Apply to Clubs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Training Sessions</h3>
              <p class="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Attendance</h3>
              <p class="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Performance</h3>
              <p class="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-100">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Programs</h3>
              <p class="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Performance & Progress -->
        <div class="space-y-8">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Batting Skills</span>
                  <span class="text-sm font-medium text-gray-700">78%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 78%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Bowling Skills</span>
                  <span class="text-sm font-medium text-gray-700">65%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" style="width: 65%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Fielding Skills</span>
                  <span class="text-sm font-medium text-gray-700">82%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" style="width: 82%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Fitness Level</span>
                  <span class="text-sm font-medium text-gray-700">90%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-yellow-600 h-2 rounded-full" style="width: 90%"></div>
                </div>
              </div>
            </div>
          </div>
          
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
                  <p class="text-sm font-medium text-gray-900">Attended batting practice session</p>
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
                  <p class="text-sm font-medium text-gray-900">Completed fitness assessment</p>
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
                  <p class="text-sm font-medium text-gray-900">Updated training goals</p>
                  <p class="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column - Applications & Upcoming Sessions -->
        <div class="space-y-8">
          <!-- Applications Section -->
          <div v-if="player.profileCompleted" class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Club Applications</h2>
              <button 
                v-if="!player.currentClub && !hasCurrentPendingApplication"
                @click="showClubSearch = true"
                class="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Apply to Clubs
              </button>
            </div>
            
            <div v-if="!applications || applications.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-1">No applications yet</h3>
              <p class="text-gray-500">Apply to clubs to start your cricket journey</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="application in applications.slice(0, 3)" 
                :key="application._id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ application.club?.name || application.club?.clubName }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      {{ formatDate(application.appliedAt) }}
                    </p>
                  </div>
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800': application.status === 'pending',
                      'bg-green-100 text-green-800': application.status === 'approved',
                      'bg-red-100 text-red-800': application.status === 'rejected'
                    }"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ application.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Upcoming Sessions -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Upcoming Sessions</h2>
            <div class="space-y-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900">Batting Technique</h3>
                  <p class="text-xs text-gray-500">Tomorrow, 9:00 AM</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900">Fielding Practice</h3>
                  <p class="text-xs text-gray-500">Wed, 4:00 PM</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-gray-900">Fitness Training</h3>
                  <p class="text-xs text-gray-500">Fri, 6:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Club Search Modal -->
      <div v-if="showClubSearch" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Apply to Clubs</h3>
            <button @click="showClubSearch = false" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Search and Filter -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="clubSearchQuery"
                type="text"
                placeholder="Search clubs by name or district..."
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @input="debouncedSearch"
              />
              <div class="absolute right-3 top-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loadingClubs" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p class="text-gray-600 mt-2">Loading clubs...</p>
          </div>

          <!-- Clubs List -->
          <div v-else-if="availableClubs.length > 0" class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="club in availableClubs" 
              :key="club._id"
              class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-bold text-lg">
                      {{ club.name?.charAt(0).toUpperCase() || club.clubName?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-gray-900">{{ club.name || club.clubName }}</h4>
                    <p class="text-gray-600">{{ club.district }}, {{ club.city }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                  {{ club.memberCount }} members
                </div>
                <button 
                  @click="applyToClub(club)"
                  :disabled="applyingToClub === club._id"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  <span v-if="applyingToClub === club._id">Applying...</span>
                  <span v-else>Apply</span>
                </button>
              </div>
            </div>
          </div>

          <!-- No Clubs Found -->
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Clubs Found</h3>
            <p class="text-gray-600">No clubs match your search criteria.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const player = ref(null);
const applications = ref([]);
const availableClubs = ref([]);
const loadingClubs = ref(false);
const applyingToClub = ref(null);
const clubSearchQuery = ref('');
const showClubSearch = ref(false);

onMounted(async () => {
  if (!auth.initialized) {
    try {
      await auth.init?.();
    } catch (e) {
      console.error('Auth init failed:', e);
    }
  }

  await Promise.all([loadPlayerData(), loadApplications()]);
});

async function loadPlayerData() {
  try {
    const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
    player.value = response.data.player;
  } catch (error) {
    console.error('Error loading player data:', error);
  }
}

async function loadApplications() {
  try {
    const response = await axios.get(`${API}/players/applications`, { withCredentials: true });
    applications.value = response.data.applications || [];
  } catch (error) {
    console.error('Error loading applications:', error);
  }
}

const hasCurrentPendingApplication = computed(() => {
  if (!applications.value) return false;
  return applications.value.some(app => app.status === 'pending');
});

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

async function loadAvailableClubs() {
  loadingClubs.value = true;
  try {
    const params = {};
    if (clubSearchQuery.value) {
      params.search = clubSearchQuery.value;
    }
    
    const response = await axios.get(`${API}/players/clubs/available`, { 
      params,
      withCredentials: true 
    });
    availableClubs.value = response.data.clubs || [];
  } catch (error) {
    console.error('Error loading clubs:', error);
  } finally {
    loadingClubs.value = false;
  }
}

const debouncedSearch = (() => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      loadAvailableClubs();
    }, 500);
  };
})();

async function applyToClub(club) {
  applyingToClub.value = club._id;
  try {
    await axios.post(`${API}/players/apply-to-club/${club._id}`, {}, { withCredentials: true });
    alert('Application submitted successfully!');
    showClubSearch.value = false;
    await loadApplications();
  } catch (error) {
    console.error('Error applying to club:', error);
    alert(error.response?.data?.message || 'Failed to apply to club');
  } finally {
    applyingToClub.value = null;
  }
}
</script>