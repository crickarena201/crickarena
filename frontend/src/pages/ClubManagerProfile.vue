<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Club Profile</h1>
        <p class="text-slate-600">Manage your club information and settings</p>
      </div>
      <div v-if="clubData && clubData.status === 'approved'" class="flex gap-3">
        <button v-if="!isEditing" @click="startEdit" 
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
          Edit Profile
        </button>
        <div v-else class="flex gap-3">
          <button @click="saveChanges" :disabled="saving" 
                  class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <button @click="cancelEdit" 
                  class="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Club Header Card -->
    <div v-if="clubData" class="bg-white rounded-3xl shadow-xl shadow-slate-500/10 border border-slate-100/50 overflow-hidden">
      <div :class="[
        'px-8 py-6 relative overflow-hidden',
        clubData.status === 'approved' ? 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700' :
        clubData.status === 'pending' ? 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600' :
        'bg-gradient-to-br from-red-500 via-rose-600 to-pink-700'
      ]">
        <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div class="relative z-10 flex items-center justify-between text-white">
          <div class="flex items-center gap-6">
            <div v-if="clubData.logoUrl" class="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
              <img :src="getLogoUrl()" :alt="clubData.clubName" class="w-full h-full object-cover" 
                   @error="logoError = true" v-show="!logoError">
              <div v-show="logoError" class="w-full h-full bg-white/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 class="text-3xl font-bold mb-2">{{ clubData.clubName }}</h2>
              <p class="text-white/90 text-lg">{{ clubData.city }}, {{ clubData.district }}</p>
              <div class="flex items-center gap-4 mt-2 text-white/80 text-sm">
                <span v-if="clubData.foundedYear">Est. {{ clubData.foundedYear }}</span>
                <span v-if="clubData.memberCount">{{ clubData.memberCount }} Members</span>
                <span v-if="clubData.groundName">{{ clubData.groundName }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/30 mb-2">
              <svg v-if="clubData.status === 'approved'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else-if="clubData.status === 'pending'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {{ clubData.status.toUpperCase() }}
            </span>
            <div class="text-white/80 text-sm">
              <div>Registered: {{ formatDate(clubData.submittedAt) }}</div>
              <div v-if="clubData.processedAt">{{ clubData.status === 'approved' ? 'Approved' : 'Processed' }}: {{ formatDate(clubData.processedAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-8">
        <!-- Status Message -->
        <div v-if="clubData.status === 'pending'" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-yellow-800 text-lg mb-2">Application Under Review</h3>
              <p class="text-yellow-700">Your club registration is being reviewed by our administrators. You'll receive an email notification once the review is complete.</p>
            </div>
          </div>
        </div>

        <div v-else-if="clubData.status === 'rejected'" class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-red-800 text-lg mb-2">Application Rejected</h3>
              <p class="text-red-700 mb-3">Your club registration was not approved. Please review the feedback below.</p>
              <div v-if="clubData.rejectionReason" class="bg-white/50 rounded-xl p-4">
                <p class="text-sm font-semibold text-red-800 mb-1">Reason:</p>
                <p class="text-red-700">{{ clubData.rejectionReason }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Club Information Sections -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Contact & Management -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              Contact & Management
            </h3>
            
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Manager Name</label>
                <input v-if="isEditing" v-model="editForm.managerName" type="text" class="form-input" />
                <div v-else class="form-display">{{ clubData.managerName || 'Not provided' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Phone</label>
                <input v-if="isEditing" v-model="editForm.phone" type="tel" class="form-input" />
                <div v-else class="form-display">{{ clubData.phone || 'Not provided' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-if="isEditing" v-model="editForm.email" type="email" class="form-input" />
                <div v-else class="form-display">{{ clubData.email || 'Not provided' }}</div>
              </div>
            </div>
          </div>

          <!-- Club Details -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              Club Details
            </h3>
            
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Founded Year</label>
                <input v-if="isEditing" v-model="editForm.foundedYear" type="number" class="form-input" />
                <div v-else class="form-display">{{ clubData.foundedYear || 'Not provided' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Member Count</label>
                <input v-if="isEditing" v-model="editForm.memberCount" type="number" class="form-input" />
                <div v-else class="form-display">{{ clubData.memberCount || 'Not provided' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Ground Name</label>
                <input v-if="isEditing" v-model="editForm.groundName" type="text" class="form-input" />
                <div v-else class="form-display">{{ clubData.groundName || 'Not provided' }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">Website</label>
                <input v-if="isEditing" v-model="editForm.website" type="url" class="form-input" />
                <div v-else class="form-display">
                  <a v-if="clubData.website" :href="clubData.website" target="_blank" class="text-blue-600 hover:text-blue-700 underline">
                    {{ clubData.website }}
                  </a>
                  <span v-else>Not provided</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration Info -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              Registration Status
            </h3>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-slate-600 font-medium">Status:</span>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  clubData.status === 'approved' ? 'bg-green-100 text-green-700' :
                  clubData.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                ]">
                  {{ clubData.status?.charAt(0).toUpperCase() + clubData.status?.slice(1) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-slate-600 font-medium">Submitted:</span>
                <span class="text-slate-900 text-sm">{{ formatDate(clubData.submittedAt) }}</span>
              </div>

              <div v-if="clubData.processedAt" class="flex justify-between">
                <span class="text-slate-600 font-medium">{{ clubData.status === 'approved' ? 'Approved' : 'Processed' }}:</span>
                <span class="text-slate-900 text-sm">{{ formatDate(clubData.processedAt) }}</span>
              </div>

              <div class="pt-2 border-t border-purple-200">
                <span class="text-slate-600 font-medium text-sm">Club ID:</span>
                <div class="text-slate-900 font-mono text-xs mt-1 bg-white/50 px-2 py-1 rounded">
                  {{ clubData._id || clubData.id }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description & Achievements -->
        <div class="mt-8 grid lg:grid-cols-2 gap-8">
          <div class="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              Club Description
            </h3>
            
            <div class="form-group">
              <textarea v-if="isEditing" v-model="editForm.description" rows="4" 
                        class="form-input" 
                        placeholder="Tell us about your club, its history, and goals..."></textarea>
              <div v-else class="form-display min-h-[100px]">
                {{ clubData.description || 'No description provided' }}
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              Achievements
            </h3>
            
            <div class="form-group">
              <textarea v-if="isEditing" v-model="editForm.achievements" rows="4" 
                        class="form-input" 
                        placeholder="List your club's achievements and accomplishments..."></textarea>
              <div v-else class="form-display min-h-[100px]">
                {{ clubData.achievements || 'No achievements listed yet' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      <p class="text-slate-600 mt-4 font-medium">Loading club profile...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { notify } from '../utils/notifications';

const clubData = ref(null);
const isEditing = ref(false);
const saving = ref(false);
const editForm = ref({});
const logoError = ref(false);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

onMounted(async () => {
  await loadClubData();
});

async function loadClubData() {
  try {
    const response = await axios.get(`${API}/clubs/my-club`);
    clubData.value = response.data.club;
    logoError.value = false;
  } catch (error) {
    console.error('Failed to load club data:', error);
    notify.error('Failed to load club profile');
  }
}

function getLogoUrl() {
  if (!clubData.value) return '';
  return clubData.value.logoUrl || `${API}/clubs/${clubData.value._id || clubData.value.id}/logo`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function startEdit() {
  isEditing.value = true;
  // Only include editable fields that match the backend schema
  editForm.value = {
    clubName: clubData.value.clubName || '',
    district: clubData.value.district || '',
    city: clubData.value.city || '',
    foundedYear: clubData.value.foundedYear || '',
    managerName: clubData.value.managerName || '',
    phone: clubData.value.phone || '',
    email: clubData.value.email || '',
    description: clubData.value.description || '',
    groundName: clubData.value.groundName || '',
    memberCount: clubData.value.memberCount || '',
    website: clubData.value.website || '',
    achievements: clubData.value.achievements || ''
  };
}

function cancelEdit() {
  isEditing.value = false;
  editForm.value = {};
}

async function saveChanges() {
  saving.value = true;
  try {
    console.log('Sending update data:', editForm.value);
    const response = await axios.put(`${API}/clubs/my-club`, editForm.value);
    clubData.value = response.data.club;
    isEditing.value = false;
    editForm.value = {};
    notify.success('Club profile updated successfully! Your changes will be reviewed.');
  } catch (error) {
    console.error('Failed to update club:', error);
    console.error('Error response:', error.response?.data);
    notify.error(error.response?.data?.message || 'Failed to update club profile');
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-semibold text-slate-700;
}

.form-input {
  @apply w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white;
}

.form-display {
  @apply px-4 py-3 bg-slate-50 rounded-2xl text-slate-900 font-medium border-2 border-transparent;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-8 > * {
  animation: fadeInUp 0.6s ease-out;
}

.space-y-8 > *:nth-child(2) {
  animation-delay: 0.1s;
}
</style>