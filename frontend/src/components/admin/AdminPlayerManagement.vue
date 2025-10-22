<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Player Management</h2>
        <p class="text-gray-600">View and manage all registered players</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div class="bg-blue-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-blue-700">{{ stats.total || 0 }}</div>
          <div class="text-blue-600">Total</div>
        </div>
        <div class="bg-green-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-green-700">{{ stats.active || 0 }}</div>
          <div class="text-green-600">Active</div>
        </div>
        <div class="bg-yellow-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-yellow-700">{{ stats.withClubs || 0 }}</div>
          <div class="text-yellow-600">In Clubs</div>
        </div>
        <div class="bg-purple-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-purple-700">{{ stats.pendingApplications || 0 }}</div>
          <div class="text-purple-600">Pending</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchPlayers"
          >
            <option value="">Active Players</option>
            <option value="all">All Players</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">District</label>
          <input
            v-model="filters.district"
            type="text"
            placeholder="Filter by district"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Club</label>
          <select
            v-model="filters.club"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchPlayers"
          >
            <option value="">All Clubs</option>
            <option value="none">No Club</option>
            <option v-for="club in clubs" :key="club.id" :value="club.id">
              {{ club.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Players Table -->
    <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cricket Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="player in players" :key="player.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="player.hasProfilePhoto"
                      class="h-10 w-10 rounded-full object-cover"
                      :src="`/api/admin/players/${player.id}/photo`"
                      :alt="player.fullName"
                      @error="handleImageError"
                    />
                    <div v-else class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ getInitials(player.fullName) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ player.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ player.age }} years, {{ player.gender }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ player.email }}</div>
                <div class="text-sm text-gray-500">{{ player.phone }}</div>
                <div class="text-xs text-gray-400">{{ player.address?.district }}, {{ player.address?.state }}</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatPosition(player.preferredPosition) }}</div>
                <div class="text-sm text-gray-500">{{ formatStyle(player.battingStyle) }}</div>
                <div class="text-xs text-gray-400">{{ player.playingExperience }} experience</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="player.currentClub" class="text-sm">
                  <div class="font-medium text-gray-900">{{ player.currentClub.name }}</div>
                  <div class="text-gray-500">{{ player.currentClub.district }}</div>
                </div>
                <div v-else class="text-sm text-gray-400">No club</div>
                <div v-if="player.pendingApplications > 0" class="text-xs text-orange-600 mt-1">
                  {{ player.pendingApplications }} pending
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    player.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ player.isActive ? 'Active' : 'Inactive' }}
                </span>
                <div v-if="!player.profileCompleted" class="text-xs text-orange-600 mt-1">
                  Profile incomplete
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(player.registeredAt) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewPlayer(player)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    View
                  </button>
                  <!-- Removed deactivate/activate button -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                of
                <span class="font-medium">{{ pagination.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Details Modal -->
    <div v-if="selectedPlayer" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Player Details</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Profile Photo and Basic Info -->
          <div class="space-y-4">
            <div class="text-center">
              <img
                v-if="selectedPlayer.hasProfilePhoto"
                class="mx-auto h-32 w-32 rounded-full object-cover"
                :src="`/api/admin/players/${selectedPlayer.id}/photo`"
                :alt="selectedPlayer.fullName"
              />
              <div v-else class="mx-auto h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-2xl font-medium text-gray-700">
                  {{ getInitials(selectedPlayer.fullName) }}
                </span>
              </div>
              <h4 class="mt-2 text-lg font-semibold">{{ selectedPlayer.fullName }}</h4>
              <p class="text-gray-600">{{ selectedPlayer.age }} years, {{ selectedPlayer.gender }}</p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Contact Information</h5>
              <p class="text-sm text-gray-600">{{ selectedPlayer.email }}</p>
              <p class="text-sm text-gray-600">{{ selectedPlayer.phone }}</p>
              <p class="text-sm text-gray-600">
                {{ selectedPlayer.address?.street }}, {{ selectedPlayer.address?.city }}<br>
                {{ selectedPlayer.address?.district }}, {{ selectedPlayer.address?.state }} - {{ selectedPlayer.address?.pincode }}
              </p>
            </div>
          </div>
          
          <!-- Cricket Information -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Cricket Profile</h5>
              <div class="space-y-2 text-sm">
                <div><span class="font-medium">Position:</span> {{ formatPosition(selectedPlayer.preferredPosition) }}</div>
                <div><span class="font-medium">Batting:</span> {{ formatStyle(selectedPlayer.battingStyle) }}</div>
                <div><span class="font-medium">Bowling:</span> {{ formatStyle(selectedPlayer.bowlingStyle) }}</div>
                <div><span class="font-medium">Experience:</span> {{ selectedPlayer.playingExperience }}</div>
              </div>
            </div>
            
            <div v-if="selectedPlayer.statistics" class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Statistics</h5>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div><span class="font-medium">Matches:</span> {{ selectedPlayer.statistics.matchesPlayed || 0 }}</div>
                <div><span class="font-medium">Runs:</span> {{ selectedPlayer.statistics.runsScored || 0 }}</div>
                <div><span class="font-medium">Wickets:</span> {{ selectedPlayer.statistics.wicketsTaken || 0 }}</div>
                <div><span class="font-medium">Catches:</span> {{ selectedPlayer.statistics.catches || 0 }}</div>
              </div>
            </div>
            
            <div v-if="selectedPlayer.currentClub" class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Current Club</h5>
              <p class="text-sm text-gray-600">{{ selectedPlayer.currentClub.name }}</p>
              <p class="text-sm text-gray-600">{{ selectedPlayer.currentClub.district }}, {{ selectedPlayer.currentClub.city }}</p>
              <p class="text-xs text-gray-500">Joined: {{ formatDate(selectedPlayer.joinedClubAt) }}</p>
            </div>
          </div>
          
          <!-- Applications and History -->
          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Account Status</h5>
              <div class="space-y-2 text-sm">
                <div>
                  <span class="font-medium">Status:</span>
                  <span :class="selectedPlayer.isActive ? 'text-green-600' : 'text-red-600'">
                    {{ selectedPlayer.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div>
                  <span class="font-medium">Profile:</span>
                  <span :class="selectedPlayer.profileCompleted ? 'text-green-600' : 'text-orange-600'">
                    {{ selectedPlayer.profileCompleted ? 'Complete' : 'Incomplete' }}
                  </span>
                </div>
                <div><span class="font-medium">Registered:</span> {{ formatDate(selectedPlayer.registeredAt) }}</div>
                <div><span class="font-medium">Documents:</span> {{ selectedPlayer.documentsCount || 0 }} uploaded</div>
              </div>
            </div>
            
            <div v-if="selectedPlayer.applications && selectedPlayer.applications.length > 0" class="bg-gray-50 p-3 rounded-lg">
              <h5 class="font-medium text-gray-900 mb-2">Club Applications</h5>
              <div class="space-y-2">
                <div v-for="application in selectedPlayer.applications.slice(0, 3)" :key="application.id" class="text-sm">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">{{ application.club.name }}</p>
                      <p class="text-gray-600">{{ application.club.district }}</p>
                    </div>
                    <span :class="[
                      'px-2 py-1 text-xs rounded-full',
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ application.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">Applied: {{ formatDate(application.appliedAt) }}</p>
                </div>
                <div v-if="selectedPlayer.applications.length > 3" class="text-xs text-gray-500">
                  +{{ selectedPlayer.applications.length - 3 }} more applications
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <!-- Removed deactivate/activate button -->
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../../utils/api.js'

// Reactive data
const loading = ref(false)
const players = ref([])
const clubs = ref([])
const stats = ref({})
const selectedPlayer = ref(null)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  search: '',
  status: '',
  district: '',
  club: ''
})

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchPlayers()
  }, 500)
}

// Fetch functions
const fetchPlayers = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.district) params.append('district', filters.district)
    if (filters.club) params.append('club', filters.club)
    
    const response = await api.get(`/admin/players?${params.toString()}`)
    players.value = response.data.players
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching players:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/admin/players/stats')
    stats.value = response.data.stats
  } catch (error) {
    console.error('Error fetching player stats:', error)
  }
}

const fetchClubs = async () => {
  try {
    const response = await api.get('/admin/clubs?status=approved')
    clubs.value = response.data.clubs.map(club => ({
      id: club.id,
      name: club.clubName
    }))
  } catch (error) {
    console.error('Error fetching clubs:', error)
  }
}

// Player actions
const viewPlayer = async (player) => {
  try {
    const response = await api.get(`/admin/players/${player.id}`)
    selectedPlayer.value = response.data.player
  } catch (error) {
    console.error('Error fetching player details:', error)
  }
}

// Removed togglePlayerStatus function

const closeModal = () => {
  selectedPlayer.value = null
}

// Pagination
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchPlayers()
  }
}

const getVisiblePages = () => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
}

// Utility functions
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPosition = (position) => {
  const positions = {
    'batsman': 'Batsman',
    'bowler': 'Bowler',
    'all-rounder': 'All-rounder',
    'wicket-keeper': 'Wicket-keeper',
    'fielder': 'Fielder'
  }
  return positions[position] || position
}

const formatStyle = (style) => {
  const styles = {
    'right-handed': 'Right-handed',
    'left-handed': 'Left-handed',
    'right-arm-fast': 'Right-arm Fast',
    'left-arm-fast': 'Left-arm Fast',
    'right-arm-medium': 'Right-arm Medium',
    'left-arm-medium': 'Left-arm Medium',
    'right-arm-spin': 'Right-arm Spin',
    'left-arm-spin': 'Left-arm Spin',
    'wicket-keeper': 'Wicket-keeper',
    'none': 'None'
  }
  return styles[style] || style
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Lifecycle
onMounted(() => {
  Promise.all([
    fetchPlayers(),
    fetchStats(),
    fetchClubs()
  ])
})
</script>