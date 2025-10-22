<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Player Progress Tracking</h2>
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
          @click="showAddPlayerModal = true"
          :disabled="!selectedProgram"
          class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Player
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading player progress...</p>
    </div>

    <!-- No Program Selected -->
    <div v-else-if="!selectedProgram" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500">Select a training program to view player progress</p>
    </div>

    <!-- No Players -->
    <div v-else-if="!players || players.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-gray-500">No players enrolled in this program yet</p>
      <p class="text-sm text-gray-400 mt-1">Add players to start tracking their progress</p>
    </div>

    <!-- Players List -->
    <div v-else class="space-y-4">
      <div
        v-for="player in players"
        :key="player._id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4-4 4 1.79 4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ player.name }}</h3>
              <p class="text-sm text-gray-600">{{ player.preferredPosition }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="viewProgress(player)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Progress
            </button>
            <button
              @click="removePlayer(player._id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Last Updated</p>
            <p class="font-medium">{{ formatDate(player.lastUpdated) }}</p>
          </div>
          <div>
            <p class="text-gray-500">Attendance</p>
            <p class="font-medium">{{ player.attendanceRate }}%</p>
          </div>
          <div>
            <p class="text-gray-500">Overall Progress</p>
            <p class="font-medium">{{ player.overallProgress }}%</p>
          </div>
        </div>

        <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-green-600 h-2 rounded-full"
            :style="{ width: player.overallProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Add Player Modal -->
    <div v-if="showAddPlayerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Add Player to Program</h3>
            <button
              @click="showAddPlayerModal = false"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search players by name..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div v-if="searching" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>

          <div v-else-if="searchResults.length > 0" class="max-h-96 overflow-y-auto space-y-3">
            <div
              v-for="player in searchResults"
              :key="player._id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="addPlayerToProgram(player)"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4-4 4 1.79 4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-sm">{{ player.fullName }}</p>
                  <p class="text-xs text-gray-500">{{ player.preferredPosition }} • {{ player.clubName }}</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>

          <div v-else-if="searchQuery" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500">No players found</p>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="showAddPlayerModal = false"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Progress Modal -->
    <div v-if="showProgressModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">Player Progress: {{ selectedPlayer?.name }}</h3>
            <button
              @click="showProgressModal = false"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 rounded-xl p-4">
              <p class="text-sm text-blue-800">Overall Progress</p>
              <p class="text-3xl font-bold text-blue-900">{{ selectedPlayer?.overallProgress }}%</p>
            </div>
            <div class="bg-green-50 rounded-xl p-4">
              <p class="text-sm text-green-800">Attendance Rate</p>
              <p class="text-3xl font-bold text-green-900">{{ selectedPlayer?.attendanceRate }}%</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-4">
              <p class="text-sm text-purple-800">Sessions Completed</p>
              <p class="text-3xl font-bold text-purple-900">{{ selectedPlayer?.sessionsCompleted }}/{{ selectedPlayer?.totalSessions }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Skill Development</h4>
            <div class="space-y-4">
              <div
                v-for="skill in selectedPlayer?.skills"
                :key="skill.name"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ skill.name }}</span>
                  <span class="font-bold text-green-600">{{ skill.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-600 h-2 rounded-full"
                    :style="{ width: skill.progress + '%' }"
                  ></div>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                  {{ skill.notes }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h4>
            <div class="space-y-3">
              <div
                v-for="session in selectedPlayer?.recentSessions"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-3"
              >
                <div class="flex justify-between">
                  <span class="font-medium">{{ session.date }}</span>
                  <span
                    :class="{
                      'bg-green-100 text-green-800': session.attended,
                      'bg-red-100 text-red-800': !session.attended
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ session.attended ? 'Attended' : 'Missed' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ session.focusArea }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ session.notes }}</p>
              </div>
            </div>
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
const searching = ref(false);
const trainingPrograms = ref([]);
const players = ref([]);
const searchResults = ref([]);

const selectedProgram = ref('');
const showAddPlayerModal = ref(false);
const showProgressModal = ref(false);
const searchQuery = ref('');
const selectedPlayer = ref(null);

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

const mockPlayers = [
  {
    _id: '101',
    name: 'Rahul Sharma',
    preferredPosition: 'Batsman',
    lastUpdated: '2023-03-15',
    attendanceRate: 92,
    overallProgress: 78,
    skills: [
      { name: 'Batting Technique', progress: 85, notes: 'Improved footwork significantly' },
      { name: 'Shot Selection', progress: 72, notes: 'Working on aggressive shots' },
      { name: 'Mental Strength', progress: 65, notes: 'Needs more focus under pressure' }
    ],
    recentSessions: [
      { id: '1', date: '2023-03-15', focusArea: 'Cover Drive', notes: 'Excellent technique', attended: true },
      { id: '2', date: '2023-03-12', focusArea: 'Footwork', notes: 'Needs improvement', attended: true },
      { id: '3', date: '2023-03-10', focusArea: 'Shot Selection', notes: 'Good progress', attended: false }
    ],
    sessionsCompleted: 12,
    totalSessions: 15
  },
  {
    _id: '102',
    name: 'Vikram Patel',
    preferredPosition: 'Bowler',
    lastUpdated: '2023-03-14',
    attendanceRate: 85,
    overallProgress: 82,
    skills: [
      { name: 'Line & Length', progress: 90, notes: 'Consistent accuracy' },
      { name: 'Variations', progress: 75, notes: 'Working on slower balls' },
      { name: 'Fitness', progress: 80, notes: 'Good stamina levels' }
    ],
    recentSessions: [
      { id: '1', date: '2023-03-14', focusArea: 'Yorkers', notes: 'Excellent execution', attended: true },
      { id: '2', date: '2023-03-11', focusArea: 'Line & Length', notes: 'Consistent performance', attended: true },
      { id: '3', date: '2023-03-09', focusArea: 'Variations', notes: 'Needs more practice', attended: true }
    ],
    sessionsCompleted: 14,
    totalSessions: 15
  }
];

// Load training programs
const loadTrainingPrograms = async () => {
  try {
    // In a real implementation, this would fetch from the API
    trainingPrograms.value = mockTrainingPrograms;
  } catch (error) {
    console.error('Error loading training programs:', error);
  }
};

// Load players for selected program
const loadPlayers = async () => {
  if (!selectedProgram.value) {
    players.value = [];
    return;
  }

  loading.value = true;
  try {
    // In a real implementation, this would fetch from the API
    players.value = mockPlayers;
  } catch (error) {
    console.error('Error loading players:', error);
  } finally {
    loading.value = false;
  }
};

// Search players
const searchPlayers = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    return;
  }

  searching.value = true;
  try {
    // In a real implementation, this would search the API
    // For demo, we'll use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    searchResults.value = [
      { _id: '201', fullName: 'Amit Kumar', preferredPosition: 'All-rounder', clubName: 'Kerala Knights' },
      { _id: '202', fullName: 'Suresh Reddy', preferredPosition: 'Wicket-keeper', clubName: 'Cochin Crushers' },
      { _id: '203', fullName: 'Deepak Verma', preferredPosition: 'Bowler', clubName: 'Trivandrum Tigers' }
    ].filter(player => 
      player.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching players:', error);
  } finally {
    searching.value = false;
  }
};

// Add player to program
const addPlayerToProgram = async (player) => {
  try {
    // In a real implementation, this would call the API
    alert(`Player ${player.fullName} added to the program`);
    showAddPlayerModal.value = false;
    searchQuery.value = '';
    searchResults.value = [];
    await loadPlayers();
  } catch (error) {
    console.error('Error adding player:', error);
    alert('Failed to add player to program');
  }
};

// Remove player from program
const removePlayer = async (playerId) => {
  if (!confirm('Are you sure you want to remove this player from the program?')) return;

  try {
    // In a real implementation, this would call the API
    alert('Player removed from program');
    await loadPlayers();
  } catch (error) {
    console.error('Error removing player:', error);
    alert('Failed to remove player from program');
  }
};

// View player progress
const viewProgress = (player) => {
  selectedPlayer.value = player;
  showProgressModal.value = true;
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
  loadPlayers();
});

// Watch for search query changes
watch(searchQuery, () => {
  if (searchQuery.value) {
    searchPlayers();
  } else {
    searchResults.value = [];
  }
});

onMounted(() => {
  loadTrainingPrograms();
});
</script>

<style scoped>
/* Custom styles */
</style>