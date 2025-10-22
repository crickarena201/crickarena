<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Training Sessions</h2>
      <div class="flex gap-2">
        <select 
          v-model="selectedProgram"
          class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Programs</option>
          <option 
            v-for="program in trainingPrograms" 
            :key="program._id" 
            :value="program._id"
          >
            {{ program.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Upcoming Sessions -->
    <div class="mb-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Upcoming Sessions</h3>
      <div v-if="upcomingSessions.length > 0" class="space-y-4">
        <div 
          v-for="session in upcomingSessions" 
          :key="session._id"
          class="border border-blue-200 rounded-xl p-5 bg-blue-50 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-lg font-bold text-gray-900">{{ session.focusArea }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ session.location }}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Upcoming
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
              {{ session.coachName }}
            </div>
          </div>

          <div v-if="session.notes" class="mt-3 p-3 bg-blue-100 rounded-lg">
            <p class="text-sm text-blue-800">{{ session.notes }}</p>
          </div>

          <div class="mt-4 flex gap-2">
            <button 
              @click="viewDetails(session)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
        <p class="mt-1 text-sm text-gray-500">You don't have any upcoming training sessions scheduled.</p>
      </div>
    </div>

    <!-- Past Sessions -->
    <div>
      <h3 class="text-lg font-medium text-gray-900 mb-4">Past Sessions</h3>
      <div v-if="pastSessions.length > 0" class="space-y-4">
        <div 
          v-for="session in pastSessions" 
          :key="session._id"
          class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="text-lg font-bold text-gray-900">{{ session.focusArea }}</h4>
              <p class="text-sm text-gray-600 mt-1">{{ session.location }}</p>
            </div>
            <span 
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                session.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ session.attended ? 'Attended' : 'Missed' }}
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
              {{ session.coachName }}
            </div>
          </div>

          <!-- Attendance Information for Players -->
          <div v-if="session.attendanceInfo" class="mt-3 p-3 bg-blue-50 rounded-lg">
            <div class="flex items-center text-sm text-blue-800">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Your attendance was marked by coach</span>
            </div>
          </div>

          <div v-if="session.feedback" class="mt-3 p-3 bg-green-50 rounded-lg">
            <p class="text-sm text-green-800">{{ session.feedback }}</p>
          </div>

          <div class="mt-4 flex gap-2">
            <button 
              @click="viewDetails(session)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No past sessions</h3>
        <p class="mt-1 text-sm text-gray-500">You haven't attended any training sessions yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    required: true
  }
});

// Reactive data
const selectedProgram = ref('');
const trainingPrograms = ref([]);
const sessions = ref([]);

// Computed properties
const upcomingSessions = computed(() => {
  return sessions.value
    .filter(session => new Date(session.date) >= new Date() && session.status !== 'completed')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const pastSessions = computed(() => {
  return sessions.value
    .filter(session => new Date(session.date) < new Date() || session.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// Fetch real training session data
onMounted(async () => {
  await fetchTrainingPrograms();
  await fetchSessions();
});

async function fetchTrainingPrograms() {
  try {
    // Fetch real training programs from the backend
    const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
    const playerData = response.data.player;
    trainingPrograms.value = playerData?.trainingPrograms || [];
  } catch (error) {
    console.error('Error fetching training programs:', error);
  }
}

async function fetchSessions() {
  try {
    // Fetch real session data from the new endpoint
    const response = await axios.get(`${API}/players/sessions`, { withCredentials: true });
    sessions.value = response.data.sessions.map(session => ({
      ...session,
      status: 'scheduled',
      attended: session.attendanceInfo ? session.attendanceInfo.attended : false
    }));
  } catch (error) {
    console.error('Error fetching sessions:', error);
    // Fallback to mock data if API fails
    sessions.value = [
      {
        _id: '101',
        focusArea: 'Batting Techniques',
        location: 'Main Ground',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        startTime: '09:00',
        endTime: '11:00',
        coachName: 'Rahul Sharma',
        notes: 'Focus on footwork and bat angle',
        status: 'scheduled',
        attended: false
      },
      {
        _id: '102',
        focusArea: 'Bowling Practice',
        location: 'Net Bowling Area',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        startTime: '10:00',
        endTime: '12:00',
        coachName: 'Vikram Patel',
        notes: 'All bowlers must attend',
        status: 'scheduled',
        attended: false
      },
      {
        _id: '103',
        focusArea: 'Fielding Drills',
        location: 'Main Ground',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
        startTime: '16:00',
        endTime: '18:00',
        coachName: 'Amit Kumar',
        feedback: 'Good performance in catching drills',
        status: 'completed',
        attended: true,
        attendanceInfo: { attended: true }
      },
      {
        _id: '104',
        focusArea: 'Fitness Training',
        location: 'Gym',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
        startTime: '07:00',
        endTime: '08:30',
        coachName: 'Suresh Reddy',
        feedback: 'Missed session without notice',
        status: 'completed',
        attended: false,
        attendanceInfo: { attended: false }
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

function viewDetails(session) {
  // In a real implementation, this would show session details
  alert(`Viewing details for: ${session.focusArea}`);
}
</script>