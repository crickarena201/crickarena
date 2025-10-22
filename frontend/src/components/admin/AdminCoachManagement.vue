<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Coach Management</h2>
        <p class="text-gray-600">View and manage all registered coaches</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div class="bg-blue-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-blue-700">{{ stats.total || 0 }}</div>
          <div class="text-blue-600">Total</div>
        </div>
        <div class="bg-green-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-green-700">{{ stats.active || 0 }}</div>
          <div class="text-green-600">Active</div>
        </div>
        <div class="bg-yellow-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-yellow-700">{{ stats.withClubs || 0 }}</div>
          <div class="text-yellow-600">In Clubs</div>
        </div>
        <div class="bg-purple-50 px-3 py-2 rounded-lg text-center">
          <div class="font-semibold text-purple-700">{{ stats.pendingApplications || 0 }}</div>
          <div class="text-purple-600">Pending</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchCoaches"
          >
            <option value="">Active Coaches</option>
            <option value="all">All Coaches</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">District</label>
          <input
            v-model="filters.district"
            type="text"
            placeholder="Filter by district"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Club</label>
          <select
            v-model="filters.club"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="fetchCoaches"
          >
            <option value="">All Clubs</option>
            <option value="none">No Club</option>
            <option v-for="club in clubs" :key="club.id" :value="club.id">
              {{ club.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Coaches Table -->
    <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coach
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cricket Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="coach in coaches" :key="coach.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="coach.hasProfilePhoto"
                      class="h-10 w-10 rounded-full object-cover"
                      :src="`/api/admin/coaches/${coach.id}/photo`"
                      :alt="coach.fullName"
                      @error="handleImageError"
                    />
                    <div v-else class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ getInitials(coach.fullName) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ coach.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ coach.age }} years, {{ coach.gender }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ coach.email }}</div>
                <div class="text-sm text-gray-500">{{ coach.phone }}</div>
                <div class="text-xs text-gray-400">{{ coach.address?.district }}, {{ coach.address?.state }}</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatExperience(coach.coachingExperience) }}</div>
                <div class="text-sm text-gray-500">{{ coach.specializations?.join(', ') || 'None' }}</div>
                <div class="text-xs text-gray-400">{{ coach.yearsOfExperience }} years experience</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="coach.currentClub" class="text-sm">
                  <div class="font-medium text-gray-900">{{ coach.currentClub.name }}</div>
                  <div class="text-gray-500">{{ coach.currentClub.district }}</div>
                </div>
                <div v-else class="text-sm text-gray-400">No club</div>
                <div v-if="coach.pendingApplications > 0" class="text-xs text-orange-600 mt-1">
                  {{ coach.pendingApplications }} pending
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    coach.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ coach.isActive ? 'Active' : 'Inactive' }}
                </span>
                <div v-if="!coach.profileCompleted" class="text-xs text-orange-600 mt-1">
                  Profile incomplete
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(coach.registeredAt) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewCoach(coach)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    View
                  </button>
                  <!-- Removed deactivate/activate button -->
                </div>
              </td>
            </tr>
            
            <tr v-if="coaches.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
                No coaches found matching your criteria
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page === pagination.totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage"
                :disabled="pagination.page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <template v-for="pageNum in pageNumbers" :key="pageNum">
                <button
                  @click="goToPage(pageNum)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    pageNum === pagination.page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ pageNum }}
                </button>
              </template>
              
              <button
                @click="nextPage"
                :disabled="pagination.page === pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- View Coach Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Coach Details</h3>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="selectedCoach" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Full Name:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.fullName }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Age:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.age }} years</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Gender:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.gender }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Date of Birth:</span>
                  <span class="text-sm text-gray-900">{{ formatDate(selectedCoach.dateOfBirth) }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Email:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.email }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Phone:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.phone }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Address</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Street:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.street }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">City:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.city }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">District:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.district }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">State:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.state }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Pincode:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.pincode }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Coaching Information</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Experience:</span>
                  <span class="text-sm text-gray-900">{{ formatExperience(selectedCoach.coachingExperience) }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Specializations:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.specializations?.join(', ') || 'None' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Philosophy:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.coachingPhilosophy || 'Not provided' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Methodology:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.methodology || 'Not provided' }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Club Association</h4>
              <div class="space-y-2">
                <div v-if="selectedCoach.currentClub" class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Current Club:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.currentClub.name }}</span>
                </div>
                <div v-else class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Club Status:</span>
                  <span class="text-sm text-gray-900">Not associated with any club</span>
                </div>
                <div v-if="selectedCoach.joinedClubAt" class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Joined Club:</span>
                  <span class="text-sm text-gray-900">{{ formatDate(selectedCoach.joinedClubAt) }}</span>
                </div>
              </div>
              
              <h4 class="text-md font-medium text-gray-900 mt-4 mb-3">Status</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Active:</span>
                  <span class="text-sm text-gray-900">
                    <span :class="selectedCoach.isActive ? 'text-green-600' : 'text-red-600'">
                      {{ selectedCoach.isActive ? 'Yes' : 'No' }}
                    </span>
                  </span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Profile Complete:</span>
                  <span class="text-sm text-gray-900">
                    <span :class="selectedCoach.profileCompleted ? 'text-green-600' : 'text-red-600'">
                      {{ selectedCoach.profileCompleted ? 'Yes' : 'No' }}
                    </span>
                  </span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Registered:</span>
                  <span class="text-sm text-gray-900">{{ formatDate(selectedCoach.registeredAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-3">Applications</h4>
            <div v-if="selectedCoach.applications && selectedCoach.applications.length > 0" class="border border-gray-200 rounded-md">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="app in selectedCoach.applications" :key="app.id">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ app.club.name }}</td>
                    <td class="px-4 py-2 text-sm">
                      <span
                        :class="{
                          'bg-yellow-100 text-yellow-800': app.status === 'pending',
                          'bg-green-100 text-green-800': app.status === 'approved',
                          'bg-red-100 text-red-800': app.status === 'rejected'
                        }"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      >
                        {{ app.status }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ formatDate(app.appliedAt) }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">
                      {{ app.processedAt ? formatDate(app.processedAt) : 'Not processed' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-sm text-gray-500">No applications found</div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            @click="showViewModal = false"
            class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';
import { useToastStore } from '../../store/toast';

const auth = useAuthStore();
const toastStore = useToastStore();

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(false);
const coaches = ref([]);
const clubs = ref([]);
const stats = ref({
  total: 0,
  active: 0,
  withClubs: 0,
  pendingApplications: 0
});

const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1
});

const filters = ref({
  search: '',
  status: '',
  district: '',
  club: ''
});

const showViewModal = ref(false);
const selectedCoach = ref(null);

// Computed properties
const pageNumbers = computed(() => {
  const pages = [];
  const totalPages = pagination.value.totalPages;
  const currentPage = pagination.value.page;
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }
  }
  
  return pages;
});

// Methods
const fetchCoaches = async () => {
  loading.value = true;
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value
    };
    
    const response = await axios.get(`${API}/admin/coaches`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      params,
      withCredentials: true
    });
    
    coaches.value = response.data.coaches;
    pagination.value = response.data.pagination;
  } catch (error) {
    console.error('Error fetching coaches:', error);
    toastStore.addToast('Failed to fetch coaches', 'error');
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const response = await axios.get(`${API}/admin/coaches/stats`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    });
    
    stats.value = response.data.stats;
  } catch (error) {
    console.error('Error fetching coach stats:', error);
  }
};

const fetchClubs = async () => {
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const response = await axios.get(`${API}/admin/clubs`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    });
    
    clubs.value = response.data.clubs;
  } catch (error) {
    console.error('Error fetching clubs:', error);
  }
};

const debouncedSearch = (() => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      pagination.value.page = 1;
      fetchCoaches();
    }, 500);
  };
})();

const viewCoach = async (coach) => {
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const response = await axios.get(`${API}/admin/coaches/${coach.id}`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    });
    
    selectedCoach.value = response.data.coach;
    showViewModal.value = true;
  } catch (error) {
    console.error('Error fetching coach details:', error);
    toastStore.addToast('Failed to fetch coach details', 'error');
  }
};

// Removed toggleCoachStatus function

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatExperience = (experience) => {
  if (!experience) return 'Not specified';
  return experience.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};

// Pagination methods
const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    fetchCoaches();
  }
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++;
    fetchCoaches();
  }
};

const goToPage = (pageNum) => {
  if (pageNum !== pagination.value.page) {
    pagination.value.page = pageNum;
    fetchCoaches();
  }
};

// Lifecycle
onMounted(() => {
  fetchCoaches();
  fetchStats();
  fetchClubs();
});
</script>

<style scoped>
/* Custom styles */
</style>