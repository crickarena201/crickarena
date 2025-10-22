<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Session Management</h2>
      <div class="flex gap-3">
        <select
          v-model="selectedProgram"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select Training Program</option>
          <option
            v-for="program in trainingPrograms"
            :key="program._id"
            :value="program._id"
          >
            {{ program.title }}
          </option>
        </select>
        <button
          @click="showCreateSessionModal = true"
          :disabled="!selectedProgram"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Session
        </button>
      </div>
    </div>

    <!-- Calendar View Toggle -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-2">
        <button
          @click="viewMode = 'list'"
          :class="{
            'bg-green-600 text-white': viewMode === 'list',
            'bg-gray-100 text-gray-700': viewMode !== 'list'
          }"
          class="px-4 py-2 rounded-lg transition"
        >
          List View
        </button>
        <button
          @click="viewMode = 'calendar'"
          :class="{
            'bg-green-600 text-white': viewMode === 'calendar',
            'bg-gray-100 text-gray-700': viewMode !== 'calendar'
          }"
          class="px-4 py-2 rounded-lg transition"
        >
          Calendar View
        </button>
      </div>
      <div class="flex gap-2">
        <button
          @click="previousPeriod"
          class="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="px-4 py-2 font-medium">
          {{ currentPeriodLabel }}
        </span>
        <button
          @click="nextPeriod"
          class="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading sessions...</p>
    </div>

    <!-- No Program Selected -->
    <div v-else-if="!selectedProgram" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500">Select a training program to manage sessions</p>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'">
      <div v-if="filteredSessions.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">No sessions scheduled for this program</p>
        <p class="text-sm text-gray-400 mt-1">Create your first session to get started</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="session in filteredSessions"
          :key="session._id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="font-semibold text-gray-900">{{ formatDate(session.date) }}</h3>
              <p class="text-sm text-gray-600">{{ session.startTime }} - {{ session.endTime }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editSession(session)"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                @click="deleteSession(session._id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Focus Area</p>
              <p class="font-medium">{{ session.focusArea }}</p>
            </div>
            <div>
              <p class="text-gray-500">Location</p>
              <p class="font-medium">{{ session.location }}</p>
            </div>
          </div>

          <div v-if="session.notes" class="mt-3 text-sm text-gray-600">
            <p class="text-gray-500">Notes</p>
            <p>{{ session.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-else class="calendar-view">
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
          :key="day"
          class="text-center py-2 font-medium text-gray-700"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="min-h-24 border border-gray-200 p-1"
          :class="{
            'bg-gray-50': !day.isCurrentMonth,
            'bg-white': day.isCurrentMonth
          }"
        >
          <div class="text-right p-1">
            <span
              :class="{
                'font-bold': day.isToday,
                'text-green-600': day.isToday
              }"
            >
              {{ day.day }}
            </span>
          </div>
          <div class="space-y-1 mt-1">
            <div
              v-for="session in day.sessions"
              :key="session._id"
              class="text-xs p-1 bg-green-100 text-green-800 rounded cursor-pointer truncate hover:bg-green-200"
              @click="viewSession(session)"
            >
              {{ session.startTime }} {{ session.focusArea }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Session Modal -->
    <div v-if="showCreateSessionModal || showEditSessionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">
              {{ showEditSessionModal ? 'Edit Session' : 'Create Session' }}
            </h3>
            <button
              @click="closeSessionModal"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveSession" class="p-6 space-y-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session Date *</label>
              <input
                v-model="sessionForm.date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Focus Area *</label>
              <input
                v-model="sessionForm.focusArea"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Batting Technique"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
              <input
                v-model="sessionForm.startTime"
                type="time"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
              <input
                v-model="sessionForm.endTime"
                type="time"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              v-model="sessionForm.location"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Club Ground, Training Center"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              v-model="sessionForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Additional notes for this session..."
            ></textarea>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeSessionModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>{{ showEditSessionModal ? 'Update Session' : 'Create Session' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Session Modal -->
    <div v-if="showViewSessionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Session Details</h3>
            <button
              @click="showViewSessionModal = false"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6" v-if="viewingSession">
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-medium">{{ formatDate(viewingSession.date) }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Start Time</p>
                <p class="font-medium">{{ viewingSession.startTime }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">End Time</p>
                <p class="font-medium">{{ viewingSession.endTime }}</p>
              </div>
            </div>
            <div>
              <p class="text-sm text-gray-500">Focus Area</p>
              <p class="font-medium">{{ viewingSession.focusArea }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Location</p>
              <p class="font-medium">{{ viewingSession.location }}</p>
            </div>
            <div v-if="viewingSession.notes">
              <p class="text-sm text-gray-500">Notes</p>
              <p class="font-medium">{{ viewingSession.notes }}</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="editSession(viewingSession)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              @click="deleteSession(viewingSession._id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';

const auth = useAuthStore();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(false);
const saving = ref(false);
const trainingPrograms = ref([]);
const sessions = ref([]);

const selectedProgram = ref('');
const viewMode = ref('list');
const showCreateSessionModal = ref(false);
const showEditSessionModal = ref(false);
const showViewSessionModal = ref(false);
const editingSessionId = ref(null);
const viewingSession = ref(null);

// Calendar state
const currentDate = ref(new Date());
const currentPeriodLabel = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

// Mock data for demonstration
const mockTrainingPrograms = [
  {
    _id: '1',
    title: 'Advanced Batting Techniques',
    startDate: '2023-01-15',
    endDate: '2023-04-15'
  },
  {
    _id: '2',
    title: 'Bowling Mastery Program',
    startDate: '2023-02-01',
    endDate: '2023-05-01'
  }
];

const mockSessions = [
  {
    _id: '101',
    date: '2023-03-15',
    startTime: '09:00',
    endTime: '11:00',
    focusArea: 'Cover Drive Technique',
    location: 'Main Ground',
    notes: 'Focus on footwork and bat angle'
  },
  {
    _id: '102',
    date: '2023-03-17',
    startTime: '10:00',
    endTime: '12:00',
    focusArea: 'Yorker Practice',
    location: 'Net Bowsing Area',
    notes: 'All bowlers must attend'
  },
  {
    _id: '103',
    date: '2023-03-20',
    startTime: '16:00',
    endTime: '18:00',
    focusArea: 'Fielding Positions',
    location: 'Main Ground',
    notes: 'Bring gloves and helmets'
  }
];

const sessionForm = ref({
  date: '',
  startTime: '',
  endTime: '',
  focusArea: '',
  location: '',
  notes: ''
});

// Computed properties
const filteredSessions = computed(() => {
  if (!selectedProgram.value) return [];
  return sessions.value.filter(session => session.programId === selectedProgram.value);
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // First day of calendar (Sunday of the week containing the 1st)
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - firstDay.getDay());
  // Last day of calendar (Saturday of the week containing the last day)
  const endDay = new Date(lastDay);
  endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const days = [];
  const current = new Date(startDay);
  const today = new Date();
  
  while (current <= endDay) {
    const daySessions = sessions.value.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.toDateString() === current.toDateString() && 
             session.programId === selectedProgram.value;
    });
    
    days.push({
      date: current.toISOString().split('T')[0],
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === today.toDateString(),
      sessions: daySessions
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
});

// Load training programs
const loadTrainingPrograms = async () => {
  try {
    // In a real implementation, this would fetch from the API
    trainingPrograms.value = mockTrainingPrograms;
  } catch (error) {
    console.error('Error loading training programs:', error);
  }
};

// Load sessions for selected program
const loadSessions = async () => {
  if (!selectedProgram.value) {
    sessions.value = [];
    return;
  }

  loading.value = true;
  try {
    // In a real implementation, this would fetch from the API
    sessions.value = mockSessions.map(session => ({
      ...session,
      programId: selectedProgram.value
    }));
  } catch (error) {
    console.error('Error loading sessions:', error);
  } finally {
    loading.value = false;
  }
};

// Save session (create or update)
const saveSession = async () => {
  saving.value = true;
  try {
    // In a real implementation, this would call the API
    if (showEditSessionModal.value) {
      alert('Session updated successfully');
    } else {
      alert('Session created successfully');
    }
    
    closeSessionModal();
    await loadSessions();
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Failed to save session');
  } finally {
    saving.value = false;
  }
};

// Edit session
const editSession = (session) => {
  sessionForm.value = { ...session };
  editingSessionId.value = session._id;
  showEditSessionModal.value = true;
};

// Delete session
const deleteSession = async (sessionId) => {
  if (!confirm('Are you sure you want to delete this session?')) return;

  try {
    // In a real implementation, this would call the API
    alert('Session deleted successfully');
    showViewSessionModal.value = false;
    await loadSessions();
  } catch (error) {
    console.error('Error deleting session:', error);
    alert('Failed to delete session');
  }
};

// View session
const viewSession = (session) => {
  viewingSession.value = session;
  showViewSessionModal.value = true;
};

// Navigation
const previousPeriod = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  currentDate.value = new Date(currentDate.value);
};

const nextPeriod = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  currentDate.value = new Date(currentDate.value);
};

// Modal management
const closeSessionModal = () => {
  showCreateSessionModal.value = false;
  showEditSessionModal.value = false;
  editingSessionId.value = null;
  sessionForm.value = {
    date: '',
    startTime: '',
    endTime: '',
    focusArea: '',
    location: '',
    notes: ''
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Watch for program selection changes
watch(selectedProgram, () => {
  loadSessions();
});

onMounted(() => {
  loadTrainingPrograms();
});
</script>

<style scoped>
.calendar-view {
  min-height: 500px;
}

.grid-cols-7 {
  grid-template-columns: repeat(7, 1fr);
}
</style>