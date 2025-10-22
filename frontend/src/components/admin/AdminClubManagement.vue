<template>
  <div class="space-y-8">
    <!-- Modern Header with Gradient -->
    <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="relative px-8 py-12">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Club Management Center</h1>
            <p class="text-blue-100 text-lg">Review, approve, and manage cricket club registration applications</p>
          </div>
          <div class="flex items-center gap-4">
            <button @click="refreshClubs" 
                    class="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Clubs</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            <p class="text-xs text-gray-400 mt-1">All registrations</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Review</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{{ stats.pending }}</p>
            <p class="text-xs text-gray-400 mt-1">Awaiting approval</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.approved }}</p>
            <p class="text-xs text-gray-400 mt-1">Active clubs</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rejected</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ stats.rejected }}</p>
            <p class="text-xs text-gray-400 mt-1">Declined apps</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-3">
          <label class="text-sm font-semibold text-gray-700">Status:</label>
          <select v-model="selectedStatus" @change="fetchClubs" 
                  class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <option value="">All Status</option>
            <option value="pending">🟡 Pending</option>
            <option value="approved">🟢 Approved</option>
            <option value="rejected">🔴 Rejected</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <label class="text-sm font-semibold text-gray-700">District:</label>
          <select v-model="selectedDistrict" @change="fetchClubs" 
                  class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <option value="">All Districts</option>
            <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
          </select>
        </div>

        <div class="flex-1 min-w-80">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input v-model="searchQuery" @input="debounceSearch" type="text" 
                   placeholder="Search clubs by name, manager, district..."
                   class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Club Cards Grid -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">
          Club Registration Applications
          <span class="text-lg font-normal text-gray-500 ml-3">({{ clubs.length }} total)</span>
        </h3>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-4 text-lg">Loading club applications...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="clubs.length === 0" class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No club applications found</h3>
        <p class="text-gray-500 max-w-md mx-auto">No clubs match your current filters. Try adjusting your search criteria or check back later for new applications.</p>
      </div>

      <!-- Club Cards Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="club in clubs" :key="club.id" 
             class="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          
          <!-- Card Header with Status -->
          <div class="relative p-6 pb-4">
            <div class="absolute top-4 right-4">
              <span class="px-3 py-1.5 text-xs font-semibold rounded-full border"
                    :class="{
                      'bg-yellow-50 text-yellow-700 border-yellow-200': club.status === 'pending',
                      'bg-green-50 text-green-700 border-green-200': club.status === 'approved',
                      'bg-red-50 text-red-700 border-red-200': club.status === 'rejected'
                    }">
                <span v-if="club.status === 'pending'">🟡</span>
                <span v-if="club.status === 'approved'">🟢</span>
                <span v-if="club.status === 'rejected'">🔴</span>
                {{ club.status.charAt(0).toUpperCase() + club.status.slice(1) }}
              </span>
            </div>
            
            <!-- Club Header Info -->
            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                <img v-if="club.logoData" :src="club.logoData" alt="Club Logo" 
                     class="w-full h-full object-cover" 
                     @error="($event.target.style.display='none')">
                <img v-else-if="club.logoUrl" :src="club.logoUrl" alt="Club Logo" 
                     class="w-full h-full object-cover" 
                     @error="($event.target.style.display='none')">
                <span v-else class="text-blue-600 font-bold text-lg">
                  {{ (club.clubName || 'C')?.charAt(0)?.toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-bold text-gray-900 truncate">{{ club.clubName }}</h4>
                <p class="text-gray-600 text-sm truncate">{{ club.district }}<span v-if="club.city">, {{ club.city }}</span></p>
              </div>
            </div>
          </div>

          <!-- Quick Info Grid -->
          <div class="px-6 pb-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Manager</p>
                <p class="text-sm font-medium text-gray-900 truncate">{{ club.managerName || '—' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Founded</p>
                <p class="text-sm font-medium text-gray-900">{{ club.foundedYear || '—' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Members</p>
                <p class="text-sm font-medium text-gray-900">{{ club.memberCount || '—' }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(club.submittedAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div v-if="club.description || club.groundName" class="px-6 pb-4">
            <div v-if="club.groundName" class="mb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Home Ground</p>
              <p class="text-sm text-gray-700">{{ club.groundName }}</p>
            </div>
            <div v-if="club.description" class="mb-2">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</p>
              <p class="text-sm text-gray-700 line-clamp-2">{{ club.description }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div class="flex items-center gap-3">
              <button v-if="club.status === 'pending'" @click="approveClub(club)"
                      class="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Approve
              </button>
              <button v-if="club.status === 'pending'" @click="rejectClub(club)"
                      class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Reject
              </button>
              <button @click="viewClubDetails(club)"
                      class="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Reject Club Application</h3>
            <p class="text-gray-600">{{ clubToReject?.clubName }}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">Reason for rejection *</label>
          <textarea v-model="rejectReason" rows="4" 
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Please provide a clear reason for rejection. This will be sent to the club manager."></textarea>
          <p class="text-xs text-gray-500 mt-2">Be specific about what needs to be improved or corrected.</p>
        </div>
        
        <div class="flex justify-end gap-4">
          <button @click="showRejectModal = false" 
                  class="px-6 py-3 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium">
            Cancel
          </button>
          <button @click="confirmReject" 
                  :disabled="!rejectReason.trim()"
                  class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            Reject Application
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Details Modal -->
    <div v-if="selectedClub" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        <!-- Modal Header -->
        <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
          <button @click="selectedClub = null" 
                  class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="flex items-start gap-5">
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <img v-if="selectedClub.logoData" :src="selectedClub.logoData" alt="Club Logo" 
                   class="w-full h-full object-cover" 
                   @error="($event.target.style.display='none')">
              <img v-else-if="selectedClub.logoUrl" :src="selectedClub.logoUrl" alt="Club Logo" 
                   class="w-full h-full object-cover" 
                   @error="($event.target.style.display='none')">
              <span v-else class="text-white font-bold text-3xl">
                {{ (selectedClub.clubName || 'C')?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-2">
                <h3 class="text-3xl font-bold">{{ selectedClub.clubName }}</h3>
                <span class="px-4 py-2 text-sm font-semibold rounded-full border-2"
                      :class="{
                        'bg-yellow-100 text-yellow-800 border-yellow-300': selectedClub.status === 'pending',
                        'bg-green-100 text-green-800 border-green-300': selectedClub.status === 'approved',
                        'bg-red-100 text-red-800 border-red-300': selectedClub.status === 'rejected'
                      }">
                  <span v-if="selectedClub.status === 'pending'">🟡</span>
                  <span v-if="selectedClub.status === 'approved'">🟢</span>
                  <span v-if="selectedClub.status === 'rejected'">🔴</span>
                  {{ selectedClub.status?.charAt(0)?.toUpperCase() + selectedClub.status?.slice(1) }}
                </span>
              </div>
              <p class="text-blue-100 text-lg flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {{ selectedClub.district }}<span v-if="selectedClub.city">, {{ selectedClub.city }}</span>
              </p>
              <p class="text-blue-200 text-sm mt-2">Application submitted on {{ formatDate(selectedClub.submittedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <!-- Quick Action Buttons -->
          <div v-if="selectedClub.status === 'pending'" class="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-700">Ready to make a decision?</p>
              <p class="text-xs text-gray-500">Review all information below before approving or rejecting this application.</p>
            </div>
            <div class="flex items-center gap-3">
              <button @click="approveClub(selectedClub)"
                      class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Approve Application
              </button>
              <button @click="rejectClub(selectedClub)"
                      class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all font-medium flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Reject Application
              </button>
            </div>
          </div>

          <!-- Application Status (if processed) -->
          <div v-if="selectedClub.status !== 'pending'" class="mb-8 p-6 rounded-2xl"
               :class="{
                 'bg-green-50 border border-green-200': selectedClub.status === 'approved',
                 'bg-red-50 border border-red-200': selectedClub.status === 'rejected'
               }">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center"
                   :class="{
                     'bg-green-100': selectedClub.status === 'approved',
                     'bg-red-100': selectedClub.status === 'rejected'
                   }">
                <svg v-if="selectedClub.status === 'approved'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-semibold"
                   :class="{
                     'text-green-800': selectedClub.status === 'approved',
                     'text-red-800': selectedClub.status === 'rejected'
                   }">
                  Application {{ selectedClub.status === 'approved' ? 'Approved' : 'Rejected' }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ selectedClub.processedAt ? 'on ' + formatDate(selectedClub.processedAt) : '' }}
                </p>
              </div>
            </div>
            <div v-if="selectedClub.status === 'rejected' && selectedClub.rejectionReason" class="mt-4 p-4 bg-white rounded-xl">
              <p class="text-sm font-semibold text-gray-700 mb-2">Rejection Reason:</p>
              <p class="text-sm text-gray-600">{{ selectedClub.rejectionReason }}</p>
            </div>
          </div>

          <!-- Photos Section -->
          <div class="mb-8">
            <h4 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Club Photos & Media
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Club Logo -->
              <div class="bg-gray-50 rounded-2xl p-5">
                <h5 class="font-semibold text-gray-900 mb-3">Club Logo</h5>
                <div class="aspect-square max-w-40 mx-auto bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  <img v-if="selectedClub.logoData" :src="selectedClub.logoData" alt="Club Logo" 
                       class="w-full h-full object-cover rounded-xl" 
                       @error="($event.target.style.display='none')">
                  <img v-else-if="selectedClub.logoUrl" :src="selectedClub.logoUrl" alt="Club Logo" 
                       class="w-full h-full object-cover rounded-xl" 
                       @error="($event.target.style.display='none')">
                  <div v-else class="text-center text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p class="text-sm">No logo uploaded</p>
                  </div>
                </div>
              </div>

              <!-- Verification Documents -->
              <div class="bg-gray-50 rounded-2xl p-6">
                <h5 class="font-semibold text-gray-900 mb-3">Verification Documents</h5>
                <div class="space-y-3">
                  <div v-if="selectedClub.proofUrl" class="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Verification Proof</p>
                      <p class="text-xs text-gray-500">Click to view document</p>
                    </div>
                    <a :href="selectedClub.proofUrl" target="_blank" 
                       class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View
                    </a>
                  </div>
                  <div v-else class="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <div class="text-center text-gray-400">
                      <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p class="text-xs">No documents uploaded</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Information Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Basic Information -->
            <div class="bg-gray-50 rounded-2xl p-6">
              <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Basic Information
              </h4>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Founded Year</p>
                    <p class="font-semibold text-gray-900">{{ selectedClub.foundedYear || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Member Count</p>
                    <p class="font-semibold text-gray-900">{{ selectedClub.memberCount || '—' }}</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Home Ground</p>
                  <p class="font-semibold text-gray-900">{{ selectedClub.groundName || 'Not specified' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Website</p>
                  <div class="font-semibold text-gray-900">
                    <a v-if="selectedClub.website" :href="selectedClub.website" target="_blank" 
                       class="text-blue-600 hover:underline break-all">{{ selectedClub.website }}</a>
                    <span v-else>—</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="bg-gray-50 rounded-2xl p-6">
              <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Contact Information
              </h4>
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Manager Name</p>
                  <p class="font-semibold text-gray-900">{{ selectedClub.managerName || '—' }}</p>
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p class="font-semibold text-gray-900">{{ selectedClub.phone || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p class="font-semibold text-gray-900 break-all">{{ selectedClub.email || '—' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Sections -->
          <div class="space-y-6">
            <!-- Description -->
            <div v-if="selectedClub.description" class="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Club Description
              </h4>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ selectedClub.description }}</p>
              </div>
            </div>

            <!-- Achievements -->
            <div v-if="selectedClub.achievements" class="bg-white border border-gray-200 rounded-2xl p-6">
              <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                Club Achievements
              </h4>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ selectedClub.achievements }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for enhanced visual effects */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth hover animations */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Enhanced shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Backdrop blur for modern glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/api.js'

const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

const clubs = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const selectedDistrict = ref('')
const searchQuery = ref('')
const districts = ref([])
const showRejectModal = ref(false)
const rejectReason = ref('')
const clubToReject = ref(null)
const selectedClub = ref(null)

let searchTimeout = null

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchClubs()
  }, 500)
}

const fetchClubs = async () => {
  loading.value = true
  try {
    let url = '/admin/clubs?'
    if (selectedStatus.value) url += `status=${selectedStatus.value}&`
    if (selectedDistrict.value) url += `district=${selectedDistrict.value}&`
    if (searchQuery.value) url += `search=${encodeURIComponent(searchQuery.value)}&`

    const response = await api.get(url)
    console.log('Full API response:', response);
    clubs.value = response.data.clubs

    // Log details about the clubs
    if (response.data.clubs && response.data.clubs.length > 0) {
      console.log('Number of clubs received:', response.data.clubs.length);
      
      // Log details about the first club
      const firstClub = response.data.clubs[0];
      console.log('First club details:', {
        id: firstClub.id,
        clubName: firstClub.clubName,
        hasLogoData: !!firstClub.logoData,
        hasLogoUrl: !!firstClub.logoUrl,
        logoDataLength: firstClub.logoData ? firstClub.logoData.length : 0,
        logoDataPreview: firstClub.logoData ? firstClub.logoData.substring(0, 100) : null
      });
      
      // Count clubs with logo data
      const clubsWithLogoData = response.data.clubs.filter(club => club.logoData).length;
      console.log('Clubs with logoData:', clubsWithLogoData);
      console.log('Clubs with logoUrl:', response.data.clubs.filter(club => club.logoUrl).length);
    }

    // Update districts
    const uniqueDistricts = [...new Set(clubs.value.map(club => club.district).filter(Boolean))]
    districts.value = uniqueDistricts.sort()

  } catch (error) {
    console.error('Error fetching clubs:', error)
  } finally {
    loading.value = false
  }
}

const refreshClubs = () => {
  fetchClubs()
  fetchStats()
}

const fetchStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    stats.value = response.data.stats
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const approveClub = async (club) => {
  try {
    await api.put(`/admin/clubs/${club.id}/approve`)
    club.status = 'approved'
    fetchStats()
    // Show success message
  } catch (error) {
    console.error('Error approving club:', error)
  }
}

const rejectClub = (club) => {
  clubToReject.value = club
  showRejectModal.value = true
}

const confirmReject = async () => {
  if (!clubToReject.value || !rejectReason.value.trim()) return

  try {
    await api.put(`/admin/clubs/${clubToReject.value.id}/reject`, {
      reason: rejectReason.value
    })
    clubToReject.value.status = 'rejected'
    showRejectModal.value = false
    rejectReason.value = ''
    clubToReject.value = null
    fetchStats()
  } catch (error) {
    console.error('Error rejecting club:', error)
  }
}

const viewClubDetails = (club) => {
  selectedClub.value = club
}

onMounted(() => {
  fetchClubs()
  fetchStats()
})
</script>