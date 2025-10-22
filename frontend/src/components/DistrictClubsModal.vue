<template>
  <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 ease-out">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-black text-white">Clubs in {{ district }}</h2>
            <p class="text-green-100 mt-1">Browse cricket clubs in {{ district }} district</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-gray-100 bg-gray-50">
        <div class="relative max-w-md mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search clubs in {{ district }}..."
            class="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading clubs from {{ district }}...</p>
        </div>

        <!-- Clubs List -->
        <div v-else-if="filteredClubs.length > 0" class="max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <div class="grid md:grid-cols-2 gap-5">
            <div
              v-for="club in filteredClubs"
              :key="club._id"
              class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              @click="viewClubDetails(club)"
            >
              <div class="p-5">
                <div class="flex items-start gap-4">
                  <!-- Club Logo -->
                  <div class="flex-shrink-0">
                    <div v-if="club.logoUrl" class="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                      <img 
                        :src="club.logoUrl" 
                        :alt="club.name || club.clubName" 
                        class="w-full h-full object-cover"
                        @error="e => (e.target.style.display='none')"
                      />
                    </div>
                    <div v-else class="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {{ (club.name || club.clubName)?.charAt(0)?.toUpperCase() || 'C' }}
                    </div>
                  </div>

                  <!-- Club Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                      {{ club.name || club.clubName }}
                    </h3>
                    <div class="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span class="truncate">{{ club.city || 'City N/A' }}</span>
                    </div>

                    <!-- Club Stats -->
                    <div class="flex items-center gap-3 mt-3">
                      <div v-if="club.memberCount" class="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <span>{{ club.memberCount }} members</span>
                      </div>
                      <div v-if="club.groundName" class="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <span class="truncate max-w-[80px]">Ground</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Club Description -->
                <p v-if="club.description" class="text-sm text-gray-600 mt-4 line-clamp-2 leading-relaxed">
                  {{ club.description }}
                </p>

                <!-- View Details Button -->
                <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <div class="flex items-center text-xs text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                    <span>View details</span>
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Clubs Found -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
          <p class="text-gray-600 mb-6">No cricket clubs are currently registered in {{ district }} district.</p>
          <button
            @click="$emit('close')"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Club Details Modal -->
    <div v-if="selectedClub" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-60 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <!-- Club Details Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-black text-white">{{ selectedClub.name || selectedClub.clubName }}</h3>
            <button
              @click="selectedClub = null"
              class="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Club Details Content -->
        <div class="p-6">
          <!-- Club Header -->
          <div class="flex items-center gap-5 mb-6">
            <div v-if="selectedClub.logoUrl" class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
              <img 
                :src="selectedClub.logoUrl" 
                :alt="selectedClub.name || selectedClub.clubName" 
                class="w-full h-full object-cover"
                @error="e => (e.target.style.display='none')"
              />
            </div>
            <div v-else class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {{ (selectedClub.name || selectedClub.clubName)?.charAt(0)?.toUpperCase() || 'C' }}
            </div>
            <div>
              <h4 class="text-2xl font-bold text-gray-900">{{ selectedClub.name || selectedClub.clubName }}</h4>
              <div class="flex items-center gap-2 text-gray-600 mt-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{{ selectedClub.district }}, {{ selectedClub.city }}</span>
              </div>
              <div v-if="selectedClub.foundedYear" class="text-sm text-gray-500 mt-1">
                Founded: {{ selectedClub.foundedYear }}
              </div>
            </div>
          </div>

          <!-- Club Information -->
          <div class="space-y-6">
            <!-- Description -->
            <div v-if="selectedClub.description">
              <h5 class="font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">About</h5>
              <p class="text-gray-700 leading-relaxed">{{ selectedClub.description }}</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid md:grid-cols-2 gap-4">
              <div v-if="selectedClub.groundName" class="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div>
                    <h6 class="font-semibold text-gray-900">Ground</h6>
                    <p class="text-sm text-gray-600">{{ selectedClub.groundName }}</p>
                  </div>
                </div>
              </div>

              <div v-if="selectedClub.memberCount" class="bg-green-50 rounded-xl p-4 border border-green-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 class="font-semibold text-gray-900">Members</h6>
                    <p class="text-sm text-gray-600">{{ selectedClub.memberCount }} players</p>
                  </div>
                </div>
              </div>

              <div v-if="selectedClub.managerName" class="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 class="font-semibold text-gray-900">Manager</h6>
                    <p class="text-sm text-gray-600">{{ selectedClub.managerName }}</p>
                  </div>
                </div>
              </div>

              <div v-if="selectedClub.phone" class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <h6 class="font-semibold text-gray-900">Contact</h6>
                    <p class="text-sm text-gray-600">{{ selectedClub.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              @click="selectedClub = null"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <RouterLink
              :to="{ name: 'club-details', params: { id: selectedClub._id } }"
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Full Details
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router';

const props = defineProps({
  district: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(true);
const clubs = ref([]);
const selectedClub = ref(null);
const searchQuery = ref('');

// Filter clubs by district and search query
const filteredClubs = computed(() => {
  const districtFiltered = clubs.value.filter(club => 
    (club.district || '').toLowerCase() === props.district.toLowerCase()
  );
  
  if (!searchQuery.value) return districtFiltered;
  
  const query = searchQuery.value.toLowerCase();
  return districtFiltered.filter(club => {
    const name = (club.name || club.clubName || '').toLowerCase();
    const city = (club.city || '').toLowerCase();
    return name.includes(query) || city.includes(query);
  });
});

const loadClubs = async () => {
  try {
    const response = await axios.get(`${API}/clubs/public`);
    clubs.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error loading clubs:', error);
    clubs.value = [];
  } finally {
    loading.value = false;
  }
};

const viewClubDetails = (club) => {
  selectedClub.value = club;
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

/* Custom scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}
</style>