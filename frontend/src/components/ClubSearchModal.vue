<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Apply to Clubs</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-2">Browse approved clubs and submit your application</p>
      </div>

      <div class="p-6">
        <!-- Search Bar -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search clubs by name, district, or city..."
              class="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading clubs...</p>
        </div>

        <!-- Clubs List -->
        <div v-else-if="filteredClubs.length > 0" class="max-h-96 overflow-y-auto space-y-4">
          <div
            v-for="club in filteredClubs"
            :key="club._id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            @click="selectClub(club)"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <img
                  v-if="club.logoUrl"
                  :src="club.logoUrl"
                  alt="Club Logo"
                  class="w-12 h-12 rounded-full object-cover border"
                  @error="e => (e.target.style.display='none')"
                />
                <div v-else class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ club.name || club.clubName }}</h3>
                  <p class="text-sm text-gray-600">{{ club.district }}, {{ club.city }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span v-if="club.memberCount" class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                      {{ club.memberCount }} members
                    </span>
                    <span v-if="club.groundName" class="px-2 py-1 bg-gray-50 text-gray-700 rounded-full text-xs">
                      {{ club.groundName }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                @click.stop="applyToClub(club)"
                :disabled="applying === club._id"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="applying === club._id">Applying...</span>
                <span v-else>Apply</span>
              </button>
            </div>
            <p v-if="club.description" class="text-sm text-gray-600 mt-3 line-clamp-2">
              {{ club.description }}
            </p>
          </div>
        </div>

        <!-- No Clubs Found -->
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <p class="text-gray-500">No clubs found</p>
          <p class="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
        </div>
      </div>

      <!-- Club Details Modal -->
      <div v-if="selectedClub" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">{{ selectedClub.name || selectedClub.clubName }}</h3>
              <button
                @click="selectedClub = null"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center gap-4 mb-6">
              <img
                v-if="selectedClub.logoUrl"
                :src="selectedClub.logoUrl"
                alt="Club Logo"
                class="w-16 h-16 rounded-full object-cover border"
                @error="e => (e.target.style.display='none')"
              />
              <div v-else class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">{{ selectedClub.name || selectedClub.clubName }}</h4>
                <p class="text-gray-600">{{ selectedClub.district }}, {{ selectedClub.city }}</p>
                <p v-if="selectedClub.foundedYear" class="text-sm text-gray-500">Founded: {{ selectedClub.foundedYear }}</p>
              </div>
            </div>

            <div class="space-y-4 mb-6">
              <div v-if="selectedClub.description">
                <h5 class="font-medium text-gray-900 mb-2">About</h5>
                <p class="text-gray-600">{{ selectedClub.description }}</p>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div v-if="selectedClub.groundName">
                  <h5 class="font-medium text-gray-900 mb-1">Ground</h5>
                  <p class="text-gray-600">{{ selectedClub.groundName }}</p>
                </div>
                <div v-if="selectedClub.memberCount">
                  <h5 class="font-medium text-gray-900 mb-1">Members</h5>
                  <p class="text-gray-600">{{ selectedClub.memberCount }} players</p>
                </div>
                <div v-if="selectedClub.managerName">
                  <h5 class="font-medium text-gray-900 mb-1">Manager</h5>
                  <p class="text-gray-600">{{ selectedClub.managerName }}</p>
                </div>
                <div v-if="selectedClub.phone">
                  <h5 class="font-medium text-gray-900 mb-1">Contact</h5>
                  <p class="text-gray-600">{{ selectedClub.phone }}</p>
                </div>
              </div>

              <div v-if="selectedClub.achievements">
                <h5 class="font-medium text-gray-900 mb-2">Achievements</h5>
                <p class="text-gray-600">{{ selectedClub.achievements }}</p>
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <button
                @click="selectedClub = null"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                @click="applyToClub(selectedClub)"
                :disabled="applying === selectedClub._id"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="applying === selectedClub._id">Applying...</span>
                <span v-else>Apply to Club</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'applied']);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(true);
const clubs = ref([]);
const searchQuery = ref('');
const selectedClub = ref(null);
const applying = ref(null);

const filteredClubs = computed(() => {
  if (!searchQuery.value) return clubs.value;
  
  const query = searchQuery.value.toLowerCase();
  return clubs.value.filter(club => {
    const name = (club.name || club.clubName || '').toLowerCase();
    const district = (club.district || '').toLowerCase();
    const city = (club.city || '').toLowerCase();
    return name.includes(query) || district.includes(query) || city.includes(query);
  });
});

const loadClubs = async () => {
  try {
    // Check if we're in a coach context by checking if the route includes 'coach'
    const isCoachContext = window.location.pathname.includes('/coach/');
    
    // Use the appropriate endpoint based on context
    const endpoint = isCoachContext 
      ? `${API}/coaches/clubs/available`
      : `${API}/players/clubs/available`;
      
    const response = await axios.get(endpoint);
    clubs.value = response.data.clubs;
  } catch (error) {
    console.error('Error loading clubs:', error);
    alert('Failed to load clubs');
  } finally {
    loading.value = false;
  }
};

const selectClub = (club) => {
  selectedClub.value = club;
};

const applyToClub = async (club) => {
  // Check if we're in a coach context
  const isCoachContext = window.location.pathname.includes('/coach/');
  
  if (!confirm(`Are you sure you want to apply to ${club.name || club.clubName}?`)) {
    return;
  }

  applying.value = club._id;
  try {
    // Use the appropriate endpoint based on context
    const endpoint = isCoachContext 
      ? `${API}/coaches/apply-to-club/${club._id}`
      : `${API}/players/apply-to-club/${club._id}`;
      
    await axios.post(endpoint);
    alert('Application submitted successfully! The club manager will review your application.');
    selectedClub.value = null;
    emit('applied');
  } catch (error) {
    console.error('Error applying to club:', error);
    const message = error.response?.data?.message || 'Failed to submit application';
    alert(message);
  } finally {
    applying.value = null;
  }
};

onMounted(() => {
  loadClubs();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.z-60 {
  z-index: 60;
}
</style>