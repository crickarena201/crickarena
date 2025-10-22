<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p class="text-gray-600 mt-1">Track performance and monitor system health</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="timeRange" @change="updateAnalytics" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <button @click="refreshAnalytics" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">New Clubs</p>
            <p class="text-3xl font-bold text-green-600">{{ analytics.newClubs }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span :class="analytics.newClubsChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ analytics.newClubsChange >= 0 ? '+' : '' }}{{ analytics.newClubsChange }}%
              </span>
              from last period
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Tournaments</p>
            <p class="text-3xl font-bold text-blue-600">{{ analytics.activeTournaments }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span :class="analytics.tournamentsChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ analytics.tournamentsChange >= 0 ? '+' : '' }}{{ analytics.tournamentsChange }}%
              </span>
              from last period
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Matches Played</p>
            <p class="text-3xl font-bold text-purple-600">{{ analytics.matchesPlayed }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span :class="analytics.matchesChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ analytics.matchesChange >= 0 ? '+' : '' }}{{ analytics.matchesChange }}%
              </span>
              from last period
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenue</p>
            <p class="text-3xl font-bold text-emerald-600">₹{{ analytics.revenue.toLocaleString() }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span :class="analytics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ analytics.revenueChange >= 0 ? '+' : '' }}{{ analytics.revenueChange }}%
              </span>
              from last period
            </p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Club Registration Trends -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Club Registrations</h3>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-sm text-gray-600">Approved</span>
            <div class="w-3 h-3 bg-yellow-500 rounded-full ml-3"></div>
            <span class="text-sm text-gray-600">Pending</span>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-gray-500">Chart will be displayed here</p>
            <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
          </div>
        </div>
      </div>

      <!-- Tournament Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Tournament Activity</h3>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-gray-600">Active</span>
            <div class="w-3 h-3 bg-green-500 rounded-full ml-3"></div>
            <span class="text-sm text-gray-600">Completed</span>
          </div>
        </div>
        <div class="h-64 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p class="text-gray-500">Chart will be displayed here</p>
            <p class="text-sm text-gray-400">Integration with Chart.js or similar library</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Districts & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Districts by Club Count -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Top Districts</h3>
        <div class="space-y-4">
          <div v-for="(district, index) in topDistricts" :key="district.name" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-red-600 font-semibold text-sm">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ district.name }}</p>
                <p class="text-sm text-gray-500">{{ district.clubs }} clubs</p>
              </div>
            </div>
            <div class="w-16 bg-gray-200 rounded-full h-2">
              <div class="bg-red-600 h-2 rounded-full" :style="{ width: district.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                 :class="activity.type === 'club' ? 'bg-green-100' :
                        activity.type === 'tournament' ? 'bg-blue-100' :
                        activity.type === 'match' ? 'bg-purple-100' : 'bg-gray-100'">
              <svg v-if="activity.type === 'club'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <svg v-else-if="activity.type === 'tournament'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else-if="activity.type === 'match'" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011-1V4z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500">{{ formatRelativeTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">System Health</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
               :class="systemHealth.api === 'operational' ? 'bg-green-100' : 'bg-red-100'">
            <svg class="w-8 h-8" :class="systemHealth.api === 'operational' ? 'text-green-600' : 'text-red-600'"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h4 class="font-semibold text-gray-900">API Status</h4>
          <p class="text-sm" :class="systemHealth.api === 'operational' ? 'text-green-600' : 'text-red-600'">
            {{ systemHealth.api === 'operational' ? 'All systems operational' : 'Issues detected' }}
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
               :class="systemHealth.database === 'healthy' ? 'bg-green-100' : 'bg-red-100'">
            <svg class="w-8 h-8" :class="systemHealth.database === 'healthy' ? 'text-green-600' : 'text-red-600'"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
            </svg>
          </div>
          <h4 class="font-semibold text-gray-900">Database</h4>
          <p class="text-sm" :class="systemHealth.database === 'healthy' ? 'text-green-600' : 'text-red-600'">
            {{ systemHealth.database === 'healthy' ? 'Connected & healthy' : 'Connection issues' }}
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
               :class="systemHealth.alerts > 0 ? 'bg-yellow-100' : 'bg-green-100'">
            <svg class="w-8 h-8" :class="systemHealth.alerts > 0 ? 'text-yellow-600' : 'text-green-600'"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h4 class="font-semibold text-gray-900">Alerts</h4>
          <p class="text-sm" :class="systemHealth.alerts > 0 ? 'text-yellow-600' : 'text-green-600'">
            {{ systemHealth.alerts > 0 ? `${systemHealth.alerts} pending reviews` : 'All clear' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api.js'

const timeRange = ref('30d')
const loading = ref(false)
const analytics = ref({
  newClubs: 0,
  newClubsChange: 0,
  activeTournaments: 0,
  tournamentsChange: 0,
  matchesPlayed: 0,
  matchesChange: 0,
  revenue: 0,
  revenueChange: 0
})

const topDistricts = ref([])
const recentActivities = ref([])
const systemHealth = ref({
  api: 'operational',
  database: 'healthy',
  alerts: 0
})

const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const diff = now - new Date(timestamp)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
}

const updateAnalytics = async () => {
  loading.value = true
  try {
    // Fetch analytics data
    const analyticsResponse = await api.get('/admin/analytics', {
      params: { period: timeRange.value }
    })

    if (analyticsResponse.data) {
      analytics.value = {
        newClubs: analyticsResponse.data.newClubs || 0,
        newClubsChange: analyticsResponse.data.newClubsChange || 0,
        activeTournaments: analyticsResponse.data.activeTournaments || 0,
        tournamentsChange: analyticsResponse.data.tournamentsChange || 0,
        matchesPlayed: analyticsResponse.data.matchesPlayed || 0,
        matchesChange: analyticsResponse.data.matchesChange || 0,
        revenue: analyticsResponse.data.revenue || 0,
        revenueChange: analyticsResponse.data.revenueChange || 0
      }

      topDistricts.value = analyticsResponse.data.topDistricts || []
      recentActivities.value = analyticsResponse.data.recentActivities || []
    }

    // Fetch system health
    const healthResponse = await api.get('/admin/health')
    if (healthResponse.data && healthResponse.data.health) {
      systemHealth.value = {
        api: healthResponse.data.health.api || 'operational',
        database: healthResponse.data.health.database || 'healthy',
        alerts: analytics.value.newClubs || 0 // Use pending clubs as alerts
      }
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
  } finally {
    loading.value = false
  }
}

const refreshAnalytics = () => {
  updateAnalytics()
}

onMounted(() => {
  updateAnalytics()
})
</script>