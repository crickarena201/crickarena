<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Player Feedback</h2>
      <button 
        @click="showSendFeedbackModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        Send Feedback
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading player feedback...</p>
    </div>

    <!-- Feedback List -->
    <div v-else-if="playerFeedback.length > 0" class="space-y-4">
      <div 
        v-for="feedback in playerFeedback" 
        :key="feedback._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ feedback.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ feedback.content }}</p>
          </div>
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              feedback.priority === 'high' ? 'bg-red-100 text-red-800' :
              feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            ]"
          >
            {{ feedback.priority }} priority
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Type: {{ formatFeedbackType(feedback.type) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(feedback.createdAt) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            {{ getPlayerName(feedback.player) }}
          </div>
        </div>

        <div v-if="feedback.isRead" class="mt-3 p-3 bg-green-50 rounded-lg">
          <div class="flex items-center text-sm text-green-800">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Feedback read by player</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No feedback sent</h3>
      <p class="mt-1 text-sm text-gray-500">Send feedback to your players to help them improve.</p>
      <div class="mt-6">
        <button 
          @click="showSendFeedbackModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          Send First Feedback
        </button>
      </div>
    </div>

    <!-- Send Feedback Modal -->
    <div v-if="showSendFeedbackModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Send Player Feedback</h3>
            <button 
              @click="closeFeedbackModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="sendFeedback" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Player</label>
              <select 
                v-model="feedbackForm.playerId"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a player</option>
                <option 
                  v-for="player in clubPlayers" 
                  :key="player._id" 
                  :value="player._id"
                >
                  {{ player.name }} ({{ player.preferredPosition }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Feedback Title</label>
              <input 
                v-model="feedbackForm.title"
                type="text" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Great Performance in Last Session"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Feedback Type</label>
              <select 
                v-model="feedbackForm.type"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="general">General</option>
                <option value="performance">Performance</option>
                <option value="behavior">Behavior</option>
                <option value="technique">Technique</option>
                <option value="attendance">Attendance</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Priority</label>
              <select 
                v-model="feedbackForm.priority"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Feedback Content</label>
              <textarea 
                v-model="feedbackForm.content"
                rows="4"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Provide detailed feedback to help the player improve..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                @click="closeFeedbackModal"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isSendingFeedback"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSendingFeedback ? 'Sending Feedback...' : 'Send Feedback' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
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
const playerFeedback = ref([]);
const clubPlayers = ref([]);
const showSendFeedbackModal = ref(false);
const isSendingFeedback = ref(false);
const loading = ref(false);

const feedbackForm = ref({
  playerId: '',
  title: '',
  content: '',
  type: 'general',
  priority: 'medium'
});

// Fetch player feedback and club players
onMounted(async () => {
  await Promise.all([
    fetchPlayerFeedback(),
    fetchClubPlayers()
  ]);
});

// Watch for route changes to re-fetch data
const route = useRoute();
watch(() => route.name, async (newRouteName) => {
  if (newRouteName === 'coach-panel-feedback') {
    await fetchPlayerFeedback();
  }
});

async function fetchPlayerFeedback() {
  try {
    loading.value = true;
    const response = await axios.get(`${API}/coaches/feedback`, { withCredentials: true });
    playerFeedback.value = response.data.feedback || [];
  } catch (error) {
    console.error('Error fetching player feedback:', error);
    playerFeedback.value = [];
  } finally {
    loading.value = false;
  }
}

async function fetchClubPlayers() {
  try {
    const response = await axios.get(`${API}/coaches/club/players`, { withCredentials: true });
    clubPlayers.value = response.data.players || [];
  } catch (error) {
    console.error('Error fetching club players:', error);
    clubPlayers.value = [];
  }
}

function getPlayerName(playerId) {
  const player = clubPlayers.value.find(p => p._id === playerId);
  return player ? player.name : 'Unknown Player';
}

function formatFeedbackType(type) {
  const typeMap = {
    'general': 'General',
    'performance': 'Performance',
    'behavior': 'Behavior',
    'technique': 'Technique',
    'attendance': 'Attendance'
  };
  return typeMap[type] || type;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function closeFeedbackModal() {
  showSendFeedbackModal.value = false;
  resetFeedbackForm();
}

function resetFeedbackForm() {
  feedbackForm.value = {
    playerId: '',
    title: '',
    content: '',
    type: 'general',
    priority: 'medium'
  };
}

async function sendFeedback() {
  if (!feedbackForm.value.playerId || !feedbackForm.value.title || !feedbackForm.value.content) {
    if (typeof window.$notify !== 'undefined') {
      window.$notify.error('Error', 'Please fill in all required fields');
    } else {
      alert('Please fill in all required fields');
    }
    return;
  }

  isSendingFeedback.value = true;
  try {
    const response = await axios.post(`${API}/coaches/feedback`, feedbackForm.value, { withCredentials: true });
    if (typeof window.$notify !== 'undefined') {
      window.$notify.success('Success', 'Feedback sent successfully');
    } else {
      alert('Feedback sent successfully');
    }
    
    // Add the new feedback to the list immediately
    if (response.data && response.data.feedback) {
      playerFeedback.value.unshift(response.data.feedback);
    }
    
    closeFeedbackModal();
  } catch (error) {
    console.error('Error sending feedback:', error);
    if (typeof window.$notify !== 'undefined') {
      window.$notify.error('Error', 'Failed to send feedback. Please try again.');
    } else {
      alert('Failed to send feedback. Please try again.');
    }
  } finally {
    isSendingFeedback.value = false;
  }
}
</script>