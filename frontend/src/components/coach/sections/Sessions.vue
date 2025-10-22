<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Training Sessions</h2>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Schedule Session
      </button>
    </div>

    <!-- Sessions List -->
    <div v-if="sessions.length > 0" class="space-y-4">
      <div 
        v-for="session in sessions" 
        :key="session._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ session.focusArea }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ session.location }}</p>
          </div>
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              isUpcoming(session.date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ isUpcoming(session.date) ? 'Upcoming' : 'Completed' }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(session.date) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ formatTime(session.startTime) }} - {{ formatTime(session.endTime) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {{ session.attendees }} attendees
          </div>
        </div>

        <div v-if="session.notes" class="mt-3 p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">{{ session.notes }}</p>
        </div>

        <!-- Attendance Information for Coaches -->
        <div v-if="session.attendanceInfo" class="mt-3 p-3 bg-green-50 rounded-lg">
          <div class="flex items-center text-sm text-green-800">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Attendance marked for {{ session.attendanceInfo.count }} players</span>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button 
            @click="editSession(session)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
          <button 
            @click="markAttendance(session)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Mark Attendance
          </button>
          <button 
            @click="viewAttendanceDetails(session)"
            v-if="session.attendanceInfo && session.attendanceInfo.count > 0"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No scheduled sessions</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by scheduling a new training session.</p>
      <div class="mt-6">
        <button 
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Schedule Session
        </button>
      </div>
    </div>

    <!-- Create/Edit Session Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">
              {{ showEditModal ? 'Edit Session' : 'Schedule New Session' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveSession" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Area</label>
              <input 
                v-model="sessionForm.focusArea"
                type="text" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Batting Techniques, Bowling Practice"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Location (Ground)</label>
              <input 
                v-model="sessionForm.location"
                type="text" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Main Ground, Net Bowling Area"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input 
                  v-model="sessionForm.date"
                  type="date" 
                  required
                  :min="today"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <p v-if="dateError" class="mt-1 text-sm text-red-600">{{ dateError }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Time</label>
                <input 
                  v-model="sessionForm.startTime"
                  type="time" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Time</label>
                <input 
                  v-model="sessionForm.endTime"
                  type="time" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea 
                v-model="sessionForm.notes"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Additional notes about the session"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isSaving || !!dateError"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : (showEditModal ? 'Update Session' : 'Schedule Session') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Mark Attendance Modal -->
    <div v-if="showAttendanceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Mark Attendance</h3>
            <button 
              @click="closeAttendanceModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedSession" class="mb-4">
            <h4 class="text-md font-medium text-gray-900">{{ selectedSession.focusArea }}</h4>
            <p class="text-sm text-gray-600">{{ formatDate(selectedSession.date) }} | {{ formatTime(selectedSession.startTime) }} - {{ formatTime(selectedSession.endTime) }}</p>
          </div>

          <div v-if="loadingPlayers" class="text-center py-4">
            <div class="spinner"></div>
            <p class="mt-2 text-sm text-gray-600">Loading players...</p>
          </div>

          <div v-else class="space-y-4">
            <div class="max-h-96 overflow-y-auto">
              <div 
                v-for="player in clubPlayers" 
                :key="player._id"
                class="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <input 
                    :id="`player-${player._id}`"
                    type="checkbox"
                    :value="player._id"
                    v-model="attendanceForm.attendedPlayers"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <label 
                    :for="`player-${player._id}`"
                    class="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {{ player.name }}
                  </label>
                </div>
                <span class="text-xs text-gray-500">{{ player.preferredPosition }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                @click="closeAttendanceModal"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="button"
                @click="saveAttendance"
                :disabled="isSavingAttendance"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSavingAttendance ? 'Saving...' : 'Save Attendance' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Attendance Details Modal -->
    <div v-if="showAttendanceDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Attendance Details</h3>
            <button 
              @click="closeAttendanceDetailsModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedSession" class="mb-4">
            <h4 class="text-md font-medium text-gray-900">{{ selectedSession.focusArea }}</h4>
            <p class="text-sm text-gray-600">{{ formatDate(selectedSession.date) }} | {{ formatTime(selectedSession.startTime) }} - {{ formatTime(selectedSession.endTime) }}</p>
          </div>

          <div v-if="attendanceDetails.length > 0" class="space-y-3">
            <div 
              v-for="record in attendanceDetails" 
              :key="record.playerId"
              class="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-800 font-medium">{{ record.player.name.charAt(0) }}</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ record.player.name }}</p>
                  <p class="text-xs text-gray-500">{{ record.player.position }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    required: true
  }
});

// Reactive data
const sessions = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showAttendanceModal = ref(false);
const showAttendanceDetailsModal = ref(false);
const isSaving = ref(false);
const isSavingAttendance = ref(false);
const loadingPlayers = ref(false);
const editingSessionId = ref(null);
const dateError = ref(null);
const selectedSession = ref(null);
const attendanceDetails = ref([]);

const today = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});

const sessionForm = ref({
  focusArea: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  notes: ''
});

const attendanceForm = ref({
  attendedPlayers: []
});

const clubPlayers = ref([]);

// Watch for date changes to validate
watch(() => sessionForm.value.date, (newDate) => {
  if (newDate && newDate < today.value) {
    dateError.value = 'Cannot schedule sessions on past dates';
  } else {
    dateError.value = null;
  }
});

// Fetch sessions
onMounted(async () => {
  await fetchSessions();
});

async function fetchSessions() {
  try {
    const response = await axios.get(`${API}/coaches/sessions`, { withCredentials: true });
    sessions.value = response.data.sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    // Fallback to mock data if API call fails
    sessions.value = [
      {
        _id: '1',
        focusArea: 'Batting Techniques',
        location: 'Main Ground',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        startTime: '09:00',
        endTime: '11:00',
        notes: 'Focus on footwork and bat angle',
        attendees: 3,
        attendanceInfo: { count: 3 }
      },
      {
        _id: '2',
        focusArea: 'Bowling Practice',
        location: 'Net Bowling Area',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        startTime: '10:00',
        endTime: '12:00',
        notes: 'All bowlers must attend',
        attendees: 4,
        attendanceInfo: { count: 4 }
      },
      {
        _id: '3',
        focusArea: 'Fielding Drills',
        location: 'Main Ground',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
        startTime: '16:00',
        endTime: '18:00',
        notes: 'Bring gloves and helmets',
        attendees: 5,
        attendanceInfo: { count: 5 }
      }
    ];
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
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
  return sessionDate >= today;
}

function editSession(session) {
  editingSessionId.value = session._id;
  sessionForm.value = { ...session };
  showEditModal.value = true;
}

async function markAttendance(session) {
  selectedSession.value = session;
  showAttendanceModal.value = true;
  await fetchClubPlayers();
  
  // Load existing attendance data for this session
  await loadSessionAttendance(session._id);
}

async function viewAttendanceDetails(session) {
  selectedSession.value = session;
  showAttendanceDetailsModal.value = true;
  await loadSessionAttendanceDetails(session._id);
}

async function fetchClubPlayers() {
  loadingPlayers.value = true;
  try {
    const response = await axios.get(`${API}/coaches/club/players`, { withCredentials: true });
    clubPlayers.value = response.data.players || [];
  } catch (error) {
    console.error('Error fetching club players:', error);
    clubPlayers.value = [];
  } finally {
    loadingPlayers.value = false;
  }
}

async function loadSessionAttendance(sessionId) {
  try {
    const response = await axios.get(`${API}/coaches/sessions/${sessionId}/attendance`, { withCredentials: true });
    const attendance = response.data.attendance || [];
    
    // Pre-select players who attended
    attendanceForm.value.attendedPlayers = attendance
      .filter(record => record.attended)
      .map(record => record.player);
  } catch (error) {
    console.error('Error loading session attendance:', error);
    attendanceForm.value.attendedPlayers = [];
  }
}

async function loadSessionAttendanceDetails(sessionId) {
  try {
    const response = await axios.get(`${API}/coaches/club/session-attendance/${sessionId}`, { withCredentials: true });
    attendanceDetails.value = response.data.attendance || [];
  } catch (error) {
    console.error('Error loading session attendance details:', error);
    attendanceDetails.value = [];
  }
}

function closeAttendanceModal() {
  showAttendanceModal.value = false;
  selectedSession.value = null;
  attendanceForm.value.attendedPlayers = [];
}

function closeAttendanceDetailsModal() {
  showAttendanceDetailsModal.value = false;
  selectedSession.value = null;
  attendanceDetails.value = [];
}

async function saveAttendance() {
  isSavingAttendance.value = true;
  try {
    await axios.post(`${API}/coaches/sessions/${selectedSession.value._id}/attendance`, {
      attendedPlayers: attendanceForm.value.attendedPlayers
    }, { withCredentials: true });
    
    alert(`Attendance marked for ${attendanceForm.value.attendedPlayers.length} players`);
    
    // Close the modal and reset the form
    closeAttendanceModal();
    
    // Refresh sessions to show updated attendance
    await fetchSessions();
  } catch (error) {
    console.error('Error saving attendance:', error);
    alert('Failed to save attendance. Please try again.');
  } finally {
    isSavingAttendance.value = false;
  }
}

function closeModal() {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingSessionId.value = null;
  dateError.value = null;
  resetForm();
}

function resetForm() {
  sessionForm.value = {
    focusArea: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  };
}

async function saveSession() {
  // Validate date
  if (sessionForm.value.date < today.value) {
    dateError.value = 'Cannot schedule sessions on past dates';
    return;
  }
  
  isSaving.value = true;
  try {
    if (showEditModal.value) {
      // Update existing session
      await axios.put(`${API}/coaches/sessions/${editingSessionId.value}`, sessionForm.value, { withCredentials: true });
      alert('Session updated successfully');
    } else {
      // Create new session
      const response = await axios.post(`${API}/coaches/sessions`, sessionForm.value, { withCredentials: true });
      alert('Session scheduled successfully');
    }
    
    closeModal();
    await fetchSessions();
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Failed to save session. Please try again.');
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>