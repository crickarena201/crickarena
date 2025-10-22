<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Player Guide Banner -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">For Cricket Players</h3>
          <p class="text-gray-600 text-sm mb-3">Find and connect with cricket clubs across Kerala. Click on any club to view details and apply directly if you're a registered player.</p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              Browse clubs
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              View details
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
              Apply to join
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900">Explore Clubs</h1>
        <p class="text-gray-600">Browse approved clubs and view their details</p>
        <div v-if="selectedDistrict" class="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          <span>Filtering by: {{ selectedDistrict }}</span>
          <button @click="clearDistrictFilter" class="hover:text-green-900 font-bold">×</button>
        </div>
      </div>
      <div class="relative w-full max-w-md">
        <input
          v-model.trim="query"
          type="text"
          :placeholder="selectedDistrict ? 'Clear district filter to search' : 'Search by club or city...'"
          class="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="!!selectedDistrict"
        />
        <svg v-if="!selectedDistrict" class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
      </div>
    </div>

    <div v-if="loading" class="py-24 text-center text-gray-500">Loading clubs...</div>
    <div v-else>
      <div v-if="filtered.length === 0" class="py-24 text-center text-gray-500">No clubs found.</div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="c in filtered"
          :key="c.id || c._id"
          :to="{ name: 'club-details', params: { id: c.id || c._id }, state: { club: c } }"
          class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer transform hover:-translate-y-1"
        >
          <!-- Club Header -->
          <div class="flex items-center gap-4 mb-4">
            <div class="relative">
              <img 
                v-if="c.logoUrl" 
                :src="c.logoUrl" 
                alt="logo" 
                class="w-16 h-16 rounded-full object-cover border-2 border-green-200 shadow-sm" 
                @error="e => (e.target.style.display='none')" 
              />
              <div 
                v-else 
                class="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-sm"
              >
                {{ (c.name || c.clubName)?.charAt(0)?.toUpperCase() || 'C' }}
              </div>
              <!-- Status indicator -->
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                {{ c.name || c.clubName }}
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="truncate">{{ c.city || c.district }}</span>
              </div>
            </div>
          </div>

          <!-- Club Description -->
          <p class="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
            {{ c.description || 'A cricket club dedicated to promoting the sport and nurturing talent.' }}
          </p>

          <!-- Club Stats -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-green-50 rounded-lg p-3 text-center border border-green-100">
              <div class="text-lg font-bold text-green-700">{{ c.memberCount || 0 }}</div>
              <div class="text-xs text-green-600 font-medium">Active Players</div>
            </div>
            <div class="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
              <div class="text-lg font-bold text-blue-700">{{ c.foundedYear || 'N/A' }}</div>
              <div class="text-xs text-blue-600 font-medium">Founded</div>
            </div>
          </div>

          <!-- Club Features -->
          <div class="space-y-2">
            <div v-if="c.groundName" class="flex items-center gap-2 text-xs text-gray-600">
              <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="font-medium">Ground:</span>
              <span class="truncate">{{ c.groundName }}</span>
            </div>
            <div v-if="c.website" class="flex items-center gap-2 text-xs text-gray-600">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
              </svg>
              <span class="font-medium">Website Available</span>
            </div>
          </div>

          <!-- View Details Button -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500 font-medium">Click to view details</span>
              <svg class="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../utils/api.js';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const clubs = ref([]);
const query = ref('');
const selectedDistrict = ref('');
let cancelled = false;
onMounted(async () => {
  loading.value = true;
  cancelled = false;
  try {
    // Use centralized API instance
    const { data } = await api.get('/clubs/public').catch(() => ({ data: [] }));
    if (!cancelled) clubs.value = Array.isArray(data) ? data : [];
  } catch (e) {
    if (!cancelled) {
      console.error('Failed to load clubs', e);
      clubs.value = [];
    }
  } finally {
    if (!cancelled) loading.value = false;
  }
});

onUnmounted(() => { cancelled = true; });

// Watch for route changes to handle district filtering
watch(() => route.query.district, (newDistrict) => {
  selectedDistrict.value = newDistrict || '';
  if (newDistrict) {
    query.value = '';
  }
}, { immediate: true });

function clearDistrictFilter() {
  selectedDistrict.value = '';
  query.value = '';
  // Update the URL to remove the district parameter
  const { district, ...queryWithoutDistrict } = route.query;
  router.push({ name: 'clubs', query: queryWithoutDistrict });
}

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  const district = selectedDistrict.value;
  
  // If no filters, return all clubs
  if (!q && !district) return clubs.value;
  
  return clubs.value.filter(c => {
    const name = (c.name || c.clubName || '').toLowerCase();
    const city = (c.city || '').toLowerCase();
    const clubDistrict = (c.district || '').toLowerCase();
    
    // Check text search
    const matchesSearch = !q || name.includes(q) || city.includes(q) || clubDistrict.includes(q);
    
    // Check district filter
    const matchesDistrict = !district || clubDistrict === district.toLowerCase();
    
    return matchesSearch && matchesDistrict;
  });
});
</script>

<style scoped>
/**** Optional line clamp for description ****/
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>