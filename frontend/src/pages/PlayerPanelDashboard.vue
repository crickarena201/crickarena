<template>
  <div class="space-y-8">
    <!-- Players Without Club -->
    <div v-if="!playerData?.currentClub">
      <!-- Welcome Section for Players without Club -->
      <div class="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-3">Welcome, {{ playerData?.fullName || 'Player' }}!</h1>
          <p class="text-xl text-white/90 mb-6">You're not part of any club yet. Join a club to unlock your full potential!</p>
          <div class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-900 rounded-full text-sm font-semibold">
            <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            No Club Membership
          </div>
        </div>
      </div>

      <!-- Why Join a Club Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Why Join a Cricket Club?
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center p-6 bg-blue-50 rounded-xl">
            <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Professional Training</h3>
            <p class="text-sm text-gray-600">Access expert coaching and structured training programs</p>
          </div>
          
          <div class="text-center p-6 bg-green-50 rounded-xl">
            <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Team Community</h3>
            <p class="text-sm text-gray-600">Connect with fellow cricketers and build lasting friendships</p>
          </div>
          
          <div class="text-center p-6 bg-purple-50 rounded-xl">
            <div class="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Track Progress</h3>
            <p class="text-sm text-gray-600">Monitor your performance and see measurable improvement</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-2">Ready to Start Your Journey?</h3>
              <p class="text-gray-700 mb-4">Browse available clubs and submit your application. Once approved, you'll gain access to training programs, performance tracking, and much more!</p>
              <div class="flex flex-wrap gap-3">
                <button 
                  @click="$router.push({ name: 'player-panel-applications' })"
                  class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Browse & Apply to Clubs
                </button>
                <button 
                  @click="$router.push({ name: 'clubs' })"
                  class="inline-flex items-center px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all font-medium"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Explore All Clubs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Getting Started Guide -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Browse Available Clubs</h3>
              <p class="text-sm text-gray-600">Explore clubs in your area and find the perfect match for your cricket goals</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Submit Application</h3>
              <p class="text-sm text-gray-600">Apply to your chosen club and wait for the club manager to review your profile</p>
            </div>
          </div>
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-1">Get Approved & Start Training</h3>
              <p class="text-sm text-gray-600">Once approved, access training programs, track performance, and grow as a cricketer</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Players With Club -->
    <div v-else>
      <!-- Welcome Section for Players with Club -->
      <div class="bg-green-600 rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white mb-1">Welcome back, {{ playerData?.fullName || 'Player' }}!</h1>
            <p class="text-green-100 text-sm">Here's your cricket journey overview</p>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded bg-white/20">
            <span class="w-2 h-2 rounded-full bg-green-300"></span>
            <span class="text-white text-sm">Active Member</span>
          </div>
        </div>
      </div>

      <!-- Club Details Card -->
      <div class="bg-white rounded-lg shadow">
        <div class="bg-green-600 p-5">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ playerData.currentClub.name || playerData.currentClub.clubName }}</h2>
              <p class="text-green-100 text-sm">Your Home Club</p>
            </div>
          </div>
        </div>
        
        <div class="p-5">
          <div class="grid md:grid-cols-3 gap-3 mb-5">
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div>
                <p class="text-xs text-gray-500">Location</p>
                <p class="text-sm font-medium text-gray-900">{{ playerData.currentClub.district }}, {{ playerData.currentClub.city }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-xs text-gray-500">Member Since</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(playerData.joinedDate) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <p class="text-sm font-medium text-green-600">Active Member</p>
              </div>
            </div>
          </div>

          <div v-if="playerData.currentClub.description" class="bg-gray-50 rounded-lg p-3 mb-5">
            <p class="text-sm text-gray-600">{{ playerData.currentClub.description }}</p>
          </div>

          <div class="flex gap-2">
            <button 
              @click="viewClubDetails"
              class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              View Club Details
            </button>
            <button 
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              View Teammates
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="p-2 rounded-lg bg-blue-100">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-blue-600">{{ trainingStats.totalSessions }}</p>
          </div>
          <h3 class="text-xs font-medium text-gray-500 uppercase">Training Sessions</h3>
          <p class="text-xs text-gray-400 mt-1">+{{ trainingStats.recentSessions }} this week</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="p-2 rounded-lg bg-green-100">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-green-600">{{ trainingStats.attendanceRate }}%</p>
          </div>
          <h3 class="text-xs font-medium text-gray-500 uppercase">Attendance</h3>
          <p class="text-xs text-gray-400 mt-1">{{ getAttendanceRating(trainingStats.attendanceRate) }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="p-2 rounded-lg bg-purple-100">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-purple-600">{{ trainingStats.performanceScore }}%</p>
          </div>
          <h3 class="text-xs font-medium text-gray-500 uppercase">Performance</h3>
          <p class="text-xs text-gray-400 mt-1">{{ getPerformanceRating(trainingStats.performanceScore) }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="p-2 rounded-lg bg-yellow-100">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-2xl font-bold text-yellow-600">{{ trainingStats.activePrograms }}</p>
          </div>
          <h3 class="text-xs font-medium text-gray-500 uppercase">Programs</h3>
          <p class="text-xs text-gray-400 mt-1">Active enrollment</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button class="text-sm text-green-600 hover:text-green-700">View All</button>
        </div>
        <div class="space-y-3">
          <div class="flex items-start p-3 rounded-lg bg-gray-50">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">Attended batting practice session</p>
              <p class="text-xs text-gray-500 mt-0.5">2 hours ago</p>
            </div>
            <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Completed</span>
          </div>
          
          <div class="flex items-start p-3 rounded-lg bg-gray-50">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">Completed fitness assessment</p>
              <p class="text-xs text-gray-500 mt-0.5">Yesterday</p>
            </div>
            <span class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Assessment</span>
          </div>
          
          <div class="flex items-start p-3 rounded-lg bg-gray-50">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">Updated training goals</p>
              <p class="text-xs text-gray-500 mt-0.5">2 days ago</p>
            </div>
            <span class="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Update</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props properly
const props = defineProps({
  playerData: {
    type: Object,
    default: null
  }
});

// Training stats data
const trainingStats = ref({
  totalSessions: 0,
  attendedSessions: 0,
  attendanceRate: 0,
  performanceScore: 0,
  totalPrograms: 0,
  activePrograms: 0,
  recentSessions: 0 // Sessions in the last week
});

onMounted(async () => {
  if (props.playerData?.currentClub) {
    await loadTrainingStats();
  }
});

async function loadTrainingStats() {
  try {
    const response = await axios.get(`${API}/players/training-stats`, { withCredentials: true });
    if (response.data && response.data.stats) {
      trainingStats.value = {
        ...response.data.stats,
        recentSessions: calculateRecentSessions(response.data.stats.totalSessions)
      };
    }
  } catch (error) {
    console.error('Error loading training stats:', error);
    // Use default values if there's an error
  }
}

function calculateRecentSessions(totalSessions) {
  // For now, we'll use a simple calculation
  // In a real implementation, this would calculate actual sessions from the last week
  return Math.min(5, Math.floor(totalSessions / 4));
}

function getAttendanceRating(attendanceRate) {
  if (attendanceRate >= 90) return 'Excellent rate';
  if (attendanceRate >= 80) return 'Good rate';
  if (attendanceRate >= 70) return 'Average rate';
  return 'Needs improvement';
}

function getPerformanceRating(performanceScore) {
  if (performanceScore >= 90) return 'Outstanding';
  if (performanceScore >= 80) return 'Above average';
  if (performanceScore >= 70) return 'Average';
  if (performanceScore >= 60) return 'Below average';
  return 'Needs improvement';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function viewClubDetails() {
  if (props.playerData?.currentClub?._id) {
    router.push({ name: 'club-details', params: { id: props.playerData.currentClub._id } });
  }
}
</script>