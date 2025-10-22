<template>
  <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
    <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Training Sessions</h2>
          <p class="text-cyan-100">View and manage training sessions conducted by your club's coach</p>
        </div>
      </div>
    </div>

    <div class="p-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        <p class="text-gray-600 mt-2">Loading training sessions...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Sessions</h3>
            <p class="text-red-700">{{ error }}</p>
            <button 
              @click="loadSessions"
              class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- No Coach -->
      <div v-else-if="noCoach" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div class="flex items-start gap-4">
          <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">No Coach Assigned</h3>
            <p class="text-yellow-700">
              Your club doesn't have an assigned coach yet. Training sessions will appear here once a coach is approved for your club.
            </p>
          </div>
        </div>
      </div>

      <!-- No Sessions -->
      <div v-else-if="sessions.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No Training Sessions</h3>
        <p class="text-gray-600">Your club's coach hasn't scheduled any training sessions yet.</p>
      </div>

      <!-- Sessions List -->
      <div v-else class="space-y-6">
        <div 
          v-for="session in sessions" 
          :key="session._id"
          class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h4 class="text-lg font-bold text-gray-900">{{ session.focusArea }}</h4>
              <p class="text-gray-600">{{ session.location }}</p>
              <p class="text-sm text-gray-500">{{ session.programTitle }}</p>
            </div>
            <span 
              :class="[
                'px-3 py-1 rounded-full text-sm font-semibold',
                isUpcoming(session.date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ isUpcoming(session.date) ? 'Upcoming' : 'Completed' }}
            </span>
          </div>

          <div class="grid md:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <span class="font-semibold text-gray-700">Date:</span>
              <span class="text-gray-600 ml-1">{{ formatDate(session.date) }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Time:</span>
              <span class="text-gray-600 ml-1">{{ formatTime(session.startTime) }} - {{ formatTime(session.endTime) }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700">Attendance:</span>
              <span class="text-gray-600 ml-1">{{ session.attendees }}/{{ session.totalPlayers }} players</span>
            </div>
          </div>

          <div v-if="session.notes" class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Notes:</span> {{ session.notes }}
            </p>
          </div>

          <div v-if="session.attendanceInfo && session.attendanceInfo.count > 0" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-green-800">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Attendance marked for {{ session.attendanceInfo.count }} out of {{ session.attendanceInfo.total }} players</span>
              </div>
              <button 
                @click="viewAttendanceDetails(session)"
                class="text-sm text-green-700 hover:text-green-900 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Attendance Details Modal -->
  <div v-if="showAttendanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Attendance Details</h3>
          <button 
            @click="closeAttendanceModal"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedSession" class="mb-6">
          <h4 class="font-bold text-gray-900">{{ selectedSession.focusArea }}</h4>
          <p class="text-sm text-gray-600">{{ formatDate(selectedSession.date) }} • {{ formatTime(selectedSession.startTime) }} - {{ formatTime(selectedSession.endTime) }}</p>
        </div>

        <!-- Loading Attendance -->
        <div v-if="loadingAttendance" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          <p class="text-gray-600 mt-2">Loading attendance details...</p>
        </div>

        <!-- Attendance List -->
        <div v-else-if="attendanceDetails.length > 0" class="space-y-3">
          <div 
            v-for="record in attendanceDetails" 
            :key="record.playerId"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-gray-600 font-bold text-sm">
                  {{ record.player.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ record.player.name }}</p>
                <p class="text-sm text-gray-600">{{ record.player.position || 'Position not specified' }}</p>
              </div>
            </div>
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                record.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ record.attended ? 'Attended' : 'Missed' }}
            </span>
          </div>
        </div>

        <!-- No Attendance Records -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
          <p class="mt-1 text-sm text-gray-500">No attendance has been marked for this session yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from 'axios';

const auth = useAuthStore();
const sessions = ref([]);
const loading = ref(false);
const error = ref(null);
const noCoach = ref(false);

// Attendance modal
const showAttendanceModal = ref(false);
const selectedSession = ref(null);
const attendanceDetails = ref([]);
const loadingAttendance = ref(false);

async function loadSessions() {
  loading.value = true;
  error.value = null;
  noCoach.value = false;
  
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/coaches/club/sessions`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    sessions.value = response.data.sessions || [];
  } catch (err) {
    console.error('Error loading training sessions:', err);
    
    // Check if it's a "no coach" error
    if (err.response?.status === 404 && err.response?.data?.message?.includes('coach')) {
      noCoach.value = true;
    } else {
      error.value = err.response?.data?.message || 'Failed to load training sessions. Please try again.';
    }
    
    sessions.value = [];
  } finally {
    loading.value = false;
  }
}

async function viewAttendanceDetails(session) {
  selectedSession.value = session;
  showAttendanceModal.value = true;
  loadingAttendance.value = true;
  attendanceDetails.value = [];
  
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/coaches/club/session-attendance/${session._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    attendanceDetails.value = response.data.attendance || [];
  } catch (err) {
    console.error('Error loading attendance details:', err);
    attendanceDetails.value = [];
  } finally {
    loadingAttendance.value = false;
  }
}

function closeAttendanceModal() {
  showAttendanceModal.value = false;
  selectedSession.value = null;
  attendanceDetails.value = [];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
}

function isUpcoming(dateString) {
  if (!dateString) return false;
  const sessionDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return sessionDate >= today;
}

onMounted(() => {
  loadSessions();
});
</script>