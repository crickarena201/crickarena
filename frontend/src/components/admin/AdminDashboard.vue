<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome back! Here's what's happening in CrickArena.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm text-gray-500">Last updated</p>
          <p class="text-sm font-medium">{{ formatDate(new Date()) }}</p>
        </div>
        <button @click="refreshData" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Pending Clubs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pending Clubs</p>
            <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-sm">
            <span class="text-gray-500">Requires attention</span>
          </div>
        </div>
      </div>

      <!-- Approved Clubs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Approved Clubs</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.approved }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-sm">
            <span class="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      <!-- Total Tournaments -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Tournaments</p>
            <p class="text-3xl font-bold text-blue-600">{{ activeTournaments }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-sm">
            <span class="text-blue-600 font-medium">Ongoing</span>
          </div>
        </div>
      </div>

      <!-- Total Matches -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Live Matches</p>
            <p class="text-3xl font-bold text-red-600">{{ liveMatches }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center text-sm">
            <span class="text-red-600 font-medium">In progress</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Club Registrations -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Recent Club Registrations</h3>
            <button @click="props.setActiveTab('clubs')" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentClubs.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <p class="text-gray-500">No recent registrations</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="club in recentClubs" :key="club.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span class="text-red-600 font-semibold text-sm">{{ club.clubName?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ club.clubName }}</p>
                  <p class="text-sm text-gray-500">{{ club.district }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800': club.status === 'pending',
                        'bg-green-100 text-green-800': club.status === 'approved',
                        'bg-red-100 text-red-800': club.status === 'rejected'
                      }">
                  {{ club.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Tournaments -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Active Tournaments</h3>
            <button @click="props.setActiveTab('tournaments')" class="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="activeTournamentsList.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-gray-500">No active tournaments</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="tournament in activeTournamentsList" :key="tournament._id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ tournament.name }}</p>
                  <p class="text-sm text-gray-500">{{ tournament.format }} • {{ formatDate(tournament.startDate) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {{ tournament.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="props.setActiveTab('clubs')" class="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Review Club Applications</p>
            <p class="text-sm text-gray-600">Approve or reject pending clubs</p>
          </div>
        </button>

        <button @click="props.setActiveTab('tournaments')" class="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Create Tournament</p>
            <p class="text-sm text-gray-600">Set up new cricket tournaments</p>
          </div>
        </button>

        <button @click="props.setActiveTab('matches')" class="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
          <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
            </svg>
          </div>
          <div>
            <p class="font-medium text-gray-900">Manage Matches</p>
            <p class="text-sm text-gray-600">Update scores and match details</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api.js'

const props = defineProps({
  setActiveTab: {
    type: Function,
    required: true
  }
})

const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  total: 0
})

const recentClubs = ref([])
const activeTournamentsList = ref([])
const activeTournaments = ref(0)
const liveMatches = ref(0)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const refreshData = async () => {
  try {
    // Fetch admin stats
    const statsResponse = await api.get('/admin/stats')
    stats.value = statsResponse.data.stats

    // Fetch recent clubs
    const clubsResponse = await api.get('/admin/clubs?status=pending&_limit=5')
    recentClubs.value = clubsResponse.data.clubs.slice(0, 5)

    // Fetch active tournaments
    const tournamentsResponse = await api.get('/admin/tournaments?status=ongoing')
    activeTournamentsList.value = tournamentsResponse.data.slice(0, 5)
    activeTournaments.value = tournamentsResponse.data.length

    // Fetch live matches (this would need to be implemented in backend)
    // For now, we'll use a placeholder
    liveMatches.value = 0

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  refreshData()
})
</script>