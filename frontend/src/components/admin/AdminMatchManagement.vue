<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Match Management</h1>
        <p class="text-gray-600 mt-1">Monitor and manage live matches and results</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="refreshMatches" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Live Matches</p>
            <p class="text-2xl font-bold text-red-600">{{ liveMatches.length }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Scheduled Today</p>
            <p class="text-2xl font-bold text-blue-600">{{ scheduledToday.length }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed Today</p>
            <p class="text-2xl font-bold text-green-600">{{ completedToday.length }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Matches</p>
            <p class="text-2xl font-bold text-gray-900">{{ allMatches.length }}</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Status:</label>
          <select v-model="selectedStatus" @change="filterMatches" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Tournament:</label>
          <select v-model="selectedTournament" @change="filterMatches" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Tournaments</option>
            <option v-for="tournament in tournaments" :key="tournament._id" :value="tournament._id">
              {{ tournament.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Date:</label>
          <input v-model="selectedDate" @change="filterMatches" type="date"
                 class="px-3 py-2 border border-gray-300 rounded-md text-sm">
        </div>

        <div class="flex-1 min-w-64">
          <input v-model="searchQuery" @input="debounceSearch" type="text" placeholder="Search matches..."
                 class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        </div>
      </div>
    </div>

    <!-- Matches List -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Matches
          <span class="text-sm font-normal text-gray-500 ml-2">({{ filteredMatches.length }} matches)</span>
        </h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading matches...</p>
        </div>

        <div v-else-if="filteredMatches.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
          </svg>
          <p class="text-gray-500">No matches found</p>
        </div>

        <div v-else v-for="match in filteredMatches" :key="match._id" class="p-6 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-3">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ match.teams?.home?.name || 'Home Team' }} vs {{ match.teams?.away?.name || 'Away Team' }}</h4>
                        <p class="text-sm text-gray-600">{{ match.tournament?.name || 'Unknown Tournament' }}</p>
                      </div>
                    </div>

                    <span class="px-3 py-1 text-xs rounded-full"
                          :class="{
                            'bg-blue-100 text-blue-800': match.status === 'scheduled',
                            'bg-red-100 text-red-800': match.status === 'live',
                            'bg-green-100 text-green-800': match.status === 'completed',
                            'bg-gray-100 text-gray-800': match.status === 'cancelled'
                          }">
                      {{ match.status.charAt(0).toUpperCase() + match.status.slice(1) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p class="text-gray-500">Date & Time</p>
                      <p class="font-medium">{{ formatDate(match.date) }} {{ match.time }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Venue</p>
                      <p class="font-medium">{{ match.venue || 'TBD' }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Round</p>
                      <p class="font-medium">{{ match.round || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-4">
                <button @click="viewMatchDetails(match)"
                        class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  View Details
                </button>

                <button v-if="match.status === 'scheduled'" @click="startMatch(match)"
                        class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                  Start Match
                </button>

                <button v-if="match.status === 'live'" @click="editMatch(match)"
                        class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Scores
                </button>

                <button v-if="match.status === 'live'" @click="endMatch(match)"
                        class="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                  End Match
                </button>

                <button v-if="match.status !== 'completed' && match.status !== 'cancelled'" @click="cancelMatch(match)"
                        class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Details Modal -->
    <div v-if="selectedMatch" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Match Details</h3>
            <button @click="selectedMatch = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="selectedMatch" class="p-6">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-lg font-semibold">{{ selectedMatch.teams?.home?.name || 'Home Team' }} vs {{ selectedMatch.teams?.away?.name || 'Away Team' }}</h4>
                <p class="text-gray-600">{{ selectedMatch.tournament?.name }}</p>
              </div>
              <span class="px-3 py-1 text-sm rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': selectedMatch.status === 'scheduled',
                      'bg-red-100 text-red-800': selectedMatch.status === 'live',
                      'bg-green-100 text-green-800': selectedMatch.status === 'completed'
                    }">
                {{ selectedMatch.status.charAt(0).toUpperCase() + selectedMatch.status.slice(1) }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-500">Date & Time</p>
                <p class="font-medium">{{ formatDate(selectedMatch.date) }} {{ selectedMatch.time }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Venue</p>
                <p class="font-medium">{{ selectedMatch.venue || 'TBD' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Round</p>
                <p class="font-medium">{{ selectedMatch.round || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Score section would go here -->
          <div class="text-center py-8">
            <p class="text-gray-500">Score details will be displayed here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Match Modal -->
    <div v-if="editingMatch" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Edit Match Score</h3>
            <button @click="editingMatch = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-3">{{ editingMatch.teams?.home?.name || 'Home Team' }} vs {{ editingMatch.teams?.away?.name || 'Away Team' }}</h4>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ editingMatch.teams?.home?.name || 'Home Team' }}</label>
                <input v-model="homeScore" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ editingMatch.teams?.away?.name || 'Away Team' }}</label>
                <input v-model="awayScore" type="number" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button @click="editingMatch = null" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button @click="saveMatchScore" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Score
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../utils/api.js'

const allMatches = ref([])
const filteredMatches = ref([])
const tournaments = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const selectedTournament = ref('')
const selectedDate = ref('')
const searchQuery = ref('')
const selectedMatch = ref(null)
const editingMatch = ref(null)
const homeScore = ref(0)
const awayScore = ref(0)

let searchTimeout = null

const liveMatches = computed(() => {
  return allMatches.value.filter(m => m.status === 'live')
})

const scheduledToday = computed(() => {
  const today = new Date().toDateString()
  return allMatches.value.filter(m =>
    m.status === 'scheduled' &&
    new Date(m.date).toDateString() === today
  )
})

const completedToday = computed(() => {
  const today = new Date().toDateString()
  return allMatches.value.filter(m =>
    m.status === 'completed' &&
    new Date(m.date).toDateString() === today
  )
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filterMatches()
  }, 500)
}

const filterMatches = () => {
  let filtered = [...allMatches.value]

  if (selectedStatus.value) {
    filtered = filtered.filter(m => m.status === selectedStatus.value)
  }

  if (selectedTournament.value) {
    filtered = filtered.filter(m => m.tournament?._id === selectedTournament.value)
  }

  if (selectedDate.value) {
    const filterDate = new Date(selectedDate.value).toDateString()
    filtered = filtered.filter(m => new Date(m.date).toDateString() === filterDate)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m =>
      m.teams?.home?.name?.toLowerCase().includes(query) ||
      m.teams?.away?.name?.toLowerCase().includes(query) ||
      m.tournament?.name?.toLowerCase().includes(query) ||
      m.venue?.toLowerCase().includes(query)
    )
  }

  filteredMatches.value = filtered
}

const fetchMatches = async () => {
  loading.value = true
  try {
    let url = '/admin/matches?'
    if (selectedStatus.value) url += `status=${selectedStatus.value}&`
    if (selectedTournament.value) url += `tournament=${selectedTournament.value}&`
    if (selectedDate.value) url += `date=${selectedDate.value}&`

    const response = await api.get(url)
    // Transform backend response to match frontend expectations
    allMatches.value = response.data.matches.map(match => ({
      ...match,
      teams: {
        home: match.homeTeam,
        away: match.awayTeam
      }
    }))
    filterMatches()
  } catch (error) {
    console.error('Error fetching matches:', error)
  } finally {
    loading.value = false
  }
}

const fetchTournaments = async () => {
  try {
    const response = await api.get('/admin/tournaments')
    tournaments.value = response.data
  } catch (error) {
    console.error('Error fetching tournaments:', error)
  }
}

const refreshMatches = () => {
  fetchMatches()
}

const viewMatchDetails = (match) => {
  selectedMatch.value = match
}

const startMatch = async (match) => {
  try {
    await api.put(`/admin/matches/${match.id}/start`)
    match.status = 'live'
    // Refresh the matches list
    fetchMatches()
  } catch (error) {
    console.error('Error starting match:', error)
  }
}

const editMatch = (match) => {
  editingMatch.value = match
  homeScore.value = match.result?.homeScore || 0
  awayScore.value = match.result?.awayScore || 0
}

const endMatch = async (match) => {
  try {
    await api.put(`/admin/matches/${match.id}/end`)
    match.status = 'completed'
    // Refresh the matches list
    fetchMatches()
  } catch (error) {
    console.error('Error ending match:', error)
  }
}

const cancelMatch = async (match) => {
  if (!confirm('Are you sure you want to cancel this match?')) return

  try {
    await api.put(`/admin/matches/${match.id}/cancel`)
    match.status = 'cancelled'
    // Refresh the matches list
    fetchMatches()
  } catch (error) {
    console.error('Error cancelling match:', error)
  }
}

const saveMatchScore = async () => {
  try {
    await api.put(`/admin/matches/${editingMatch.value.id}/score`, {
      homeScore: homeScore.value,
      awayScore: awayScore.value
    })

    // Update the match in the list
    const match = allMatches.value.find(m => m.id === editingMatch.value.id)
    if (match) {
      match.result = match.result || {}
      match.result.homeScore = homeScore.value
      match.result.awayScore = awayScore.value
    }

    editingMatch.value = null
    homeScore.value = 0
    awayScore.value = 0
  } catch (error) {
    console.error('Error saving match score:', error)
  }
}

onMounted(() => {
  fetchMatches()
  fetchTournaments()
})
</script>