<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reject Club Application</h3>
        <p class="text-gray-600 mb-4">
          Please provide a reason for rejecting this club's application:
        </p>
        <textarea 
          v-model="rejectionReason"
          rows="4"
          placeholder="Enter rejection reason (optional)..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>
        <div class="flex gap-3">
          <button 
            @click="confirmReject"
            :disabled="processingClub"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <span v-if="processingClub">Processing...</span>
            <span v-else>Reject Application</span>
          </button>
          <button 
            @click="closeRejectModal"
            :disabled="processingClub"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Modern Header with Gradient -->
      <div class="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative px-8 py-12">
          <div class="flex items-center justify-between">
            <div>
              <div class="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold mb-6">
                <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                Club Management Portal
              </div>
              <h1 class="text-5xl font-bold text-white mb-4">Club Registration Center</h1>
              <p class="text-blue-100 text-xl">Review, approve, and manage cricket club applications with comprehensive details</p>
            </div>
            <div class="text-right">
              <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div class="text-blue-100 text-sm uppercase tracking-wider">Total Applications</div>
                <div class="text-4xl font-bold text-white">{{ clubRequests.length }}</div>
                <div class="text-blue-200 text-xs mt-1">All time submissions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Cards -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending Review</div>
              <div class="text-3xl font-bold text-gray-900">{{ pendingCount }}</div>
              <div class="text-xs text-gray-400 mt-1">Awaiting decision</div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Approved</div>
              <div class="text-3xl font-bold text-gray-900">{{ approvedCount }}</div>
              <div class="text-xs text-gray-400 mt-1">Active clubs</div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Rejected</div>
              <div class="text-3xl font-bold text-gray-900">{{ rejectedCount }}</div>
              <div class="text-xs text-gray-400 mt-1">Declined apps</div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Clubs</div>
              <div class="text-3xl font-bold text-gray-900">{{ totalClubs }}</div>
              <div class="text-xs text-gray-400 mt-1">All registrations</div>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/>
                <path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/>
                <circle cx="7" cy="7" r="4"/>
                <circle cx="17" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Filter Tabs -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="status in ['all', 'pending', 'approved', 'rejected']" 
              :key="status"
              @click="activeFilter = status"
              :class="[
                'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2',
                activeFilter === status 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              <span v-if="status === 'all'">📋</span>
              <span v-else-if="status === 'pending'">🟡</span>
              <span v-else-if="status === 'approved'">🟢</span>
              <span v-else-if="status === 'rejected'">🔴</span>
              {{ status.charAt(0).toUpperCase() + status.slice(1) }}
              <span v-if="status !== 'all'" class="px-2 py-1 rounded-full text-xs"
                    :class="activeFilter === status ? 'bg-white/20' : 'bg-gray-100'">
                {{ getCountByStatus(status) }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modern Club Applications Grid -->
      <div class="space-y-8">
        <div 
          v-for="club in filteredClubs" 
          :key="club.id"
          class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group"
        >
          <!-- Card Header with Gradient Background -->
          <div class="relative bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
            <div class="absolute top-4 right-4">
              <span 
                :class="[
                  'px-4 py-2 rounded-full text-sm font-bold border-2',
                  club.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  club.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-red-50 text-red-700 border-red-200'
                ]"
              >
                <span v-if="club.status === 'pending'">🟡</span>
                <span v-if="club.status === 'approved'">🟢</span>
                <span v-if="club.status === 'rejected'">🔴</span>
                {{ club.status.toUpperCase() }}
              </span>
            </div>
            
            <div class="flex items-start gap-6 mb-4">
              <!-- Club Logo -->
              <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img v-if="club.logoBase64" :src="club.logoBase64" alt="Club Logo" 
                     class="w-full h-full object-cover" 
                     @error="handleImageError">
                <span v-else class="text-blue-600 font-bold text-2xl">
                  {{ club.clubName.charAt(0).toUpperCase() }}
                </span>
              </div>
              
              <div class="flex-1">
                <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ club.clubName }}</h3>
                <div class="flex items-center gap-2 text-gray-600 mb-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <circle cx="12" cy="8" r="3"/>
                  </svg>
                  <span class="font-medium">{{ club.city }}, {{ club.district }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  Application submitted on {{ formatDate(club.submittedAt) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-8">
            <!-- Contact Information Row -->
            <div class="grid md:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</div>
                  <div class="font-medium text-gray-900">{{ club.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</div>
                  <div class="font-medium text-gray-900">{{ club.phone }}</div>
                </div>
              </div>
            </div>

            <!-- Detailed Information Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div class="bg-white border border-gray-200 rounded-xl p-4">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manager</div>
                <div class="font-semibold text-gray-900">{{ club.managerName }}</div>
              </div>
              <div v-if="club.foundedYear" class="bg-white border border-gray-200 rounded-xl p-4">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Founded</div>
                <div class="font-semibold text-gray-900">{{ club.foundedYear }}</div>
              </div>
              <div v-if="club.memberCount" class="bg-white border border-gray-200 rounded-xl p-4">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Members</div>
                <div class="font-semibold text-gray-900">{{ club.memberCount }}</div>
              </div>
              <div v-if="club.groundName" class="bg-white border border-gray-200 rounded-xl p-4">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Home Ground</div>
                <div class="font-semibold text-gray-900">{{ club.groundName }}</div>
              </div>
            </div>

            <!-- Website Link -->
            <div v-if="club.website" class="mb-6">
              <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div class="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Club Website</div>
                  <a :href="club.website" target="_blank" class="text-blue-700 hover:text-blue-900 font-medium underline break-all">{{ club.website }}</a>
                </div>
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </div>
            </div>

            <!-- Photos & Documents Section -->
            <div class="mb-6">
              <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Submitted Documents & Media
              </h4>
              <div class="grid md:grid-cols-2 gap-4">
                <!-- Logo Display -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="text-sm font-semibold text-gray-700 mb-3">Club Logo</div>
                  <div class="aspect-square max-w-32 mx-auto bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                    <img v-if="club.logoBase64" :src="club.logoBase64" alt="Club Logo" 
                         class="w-full h-full object-cover rounded-xl" 
                         @error="handleImageError">
                    <div v-else class="text-center text-gray-400">
                      <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p class="text-xs">No logo uploaded</p>
                    </div>
                  </div>
                </div>
                
                <!-- Verification Documents -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="text-sm font-semibold text-gray-700 mb-3">Verification Proof</div>
                  <div v-if="club.proofUrl" class="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">Document</p>
                      <p class="text-xs text-gray-500">Click to view</p>
                    </div>
                    <a :href="club.proofUrl" target="_blank" 
                       class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View
                    </a>
                  </div>
                  <div v-else class="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
                    <div class="text-center text-gray-400">
                      <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <p class="text-xs">No documents</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description and Achievements -->
            <div class="space-y-6 mb-6">
              <div v-if="club.description" class="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Club Description
                </h4>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ club.description }}</p>
                </div>
              </div>

              <div v-if="club.achievements" class="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                  Club Achievements
                </h4>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ club.achievements }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div v-if="club.status === 'pending'" class="flex gap-4 pt-6 border-t border-gray-200">
              <button 
                @click="approveClub(club.id)"
                :disabled="processingClub === club.id"
                class="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span v-if="processingClub === club.id" class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
                <span v-else class="flex items-center justify-center gap-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  Approve Application
                </span>
              </button>
              <button 
                @click="rejectClub(club.id)"
                :disabled="processingClub === club.id"
                class="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span v-if="processingClub === club.id" class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
                <span v-else class="flex items-center justify-center gap-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Reject Application
                </span>
              </button>
            </div>

            <!-- Status Message for Processed Clubs -->
            <div v-else class="pt-6 border-t border-gray-200">
              <div 
                :class="[
                  'text-center py-4 px-8 rounded-2xl font-bold text-lg',
                  club.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300'
                ]"
              >
                {{ club.status === 'approved' ? '✅ Application Approved' : '❌ Application Rejected' }}
                <span v-if="club.processedAt" class="block text-sm mt-2 opacity-75">
                  Decision made on {{ formatDate(club.processedAt) }}
                </span>
                <span v-if="club.status === 'rejected' && club.rejectionReason" class="block text-sm mt-2 opacity-75">
                  Reason: {{ club.rejectionReason }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Empty State -->
        <div v-if="filteredClubs.length === 0" class="text-center py-20">
          <div class="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">No Club Applications Found</h3>
          <p class="text-gray-600 text-lg max-w-md mx-auto">
            {{ activeFilter === 'all' ? 'No club registration applications have been submitted yet. Check back later for new submissions.' : `No ${activeFilter} club applications at this time. Try switching to a different filter.` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Enhanced visual effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Backdrop blur for modern glass effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth animations */
.transition-all {
  transition: all 0.3s ease;
}

/* Custom scrollbar for better UX */
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

/* Gradient text for status indicators */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Enhanced button hover effects */
button:hover {
  transform: translateY(-1px);
}

/* Card hover effects */
.group:hover {
  transform: translateY(-4px);
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { notify } from '../utils/notifications';

const clubRequests = ref([]);
const activeFilter = ref('all');
const processingClub = ref(null);
const showRejectModal = ref(false);
const rejectionReason = ref('');
const clubToReject = ref(null);

// Stats from backend
const stats = ref({ pending: 0, approved: 0, rejected: 0, total: 0 });

// Computed properties for stats
const pendingCount = computed(() => stats.value.pending);
const approvedCount = computed(() => stats.value.approved);
const rejectedCount = computed(() => stats.value.rejected);
const totalClubs = computed(() => stats.value.approved);

// Filtered clubs based on active filter
const filteredClubs = computed(() => {
  if (activeFilter.value === 'all') return clubRequests.value;
  return clubRequests.value.filter(club => club.status === activeFilter.value);
});

function getCountByStatus(status) {
  return clubRequests.value.filter(club => club.status === status).length;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

async function loadClubRequests() {
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const [clubsRes, statsRes] = await Promise.all([
      axios.get(`${API}/admin/clubs`),
      axios.get(`${API}/admin/stats`)
    ]);
    clubRequests.value = clubsRes.data.clubs || [];
    stats.value = statsRes.data.stats || stats.value;
    
    // Debug logging for logo data
    if (clubRequests.value.length > 0) {
      console.log('Sample club data:', clubRequests.value[0]);
      console.log('Logo Base64 for first club:', clubRequests.value[0]?.logoBase64 ? 'Data found' : 'No logo data');
      console.log('Logo URL for first club:', clubRequests.value[0]?.logoUrl);
      
      // Count clubs with logos
      const clubsWithLogos = clubRequests.value.filter(club => club.logoBase64).length;
      console.log(`Clubs with logos: ${clubsWithLogos} out of ${clubRequests.value.length}`);
    }
  } catch (error) {
    console.error('Error loading admin data:', error);
    const msg = error?.response?.data?.message || error.message || 'Failed to load admin data';
    notify.error(msg);
    clubRequests.value = [];
    // keep existing stats values
  }
}

async function approveClub(clubId) {
  processingClub.value = clubId;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    await axios.put(`${API}/admin/clubs/${clubId}/approve`);
    
    // Update local state
    const club = clubRequests.value.find(c => c.id === clubId);
    if (club) {
      club.status = 'approved';
      club.processedAt = new Date().toISOString();
    }
    
    notify.success('Club application approved successfully! The club manager will be notified.');
    await loadClubRequests(); // Refresh data
  } catch (error) {
    console.error('Error approving club:', error);
    notify.error('Failed to approve club. Please try again.');
  } finally {
    processingClub.value = null;
  }
}

function rejectClub(clubId) {
  clubToReject.value = clubId;
  rejectionReason.value = '';
  showRejectModal.value = true;
}

function closeRejectModal() {
  showRejectModal.value = false;
  clubToReject.value = null;
  rejectionReason.value = '';
}

async function confirmReject() {
  if (!clubToReject.value) return;
  
  processingClub.value = clubToReject.value;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    await axios.put(`${API}/admin/clubs/${clubToReject.value}/reject`, { reason: rejectionReason.value });
    
    // Update local state
    const club = clubRequests.value.find(c => c.id === clubToReject.value);
    if (club) {
      club.status = 'rejected';
      club.processedAt = new Date().toISOString();
      club.rejectionReason = rejectionReason.value || 'No reason provided';
    }
    
    closeRejectModal();
    notify.success('Club application rejected successfully!');
    await loadClubRequests(); // Refresh data
  } catch (error) {
    console.error('Error rejecting club:', error);
    notify.error('Failed to reject club. Please try again.');
  } finally {
    processingClub.value = null;
  }
}



// Helper function to get proper logo URL
function getLogoUrl(club) {
  if (!club.logoUrl) return null;
  
  const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
  
  // If logoUrl is already a full URL, use it as is
  if (club.logoUrl.startsWith('http')) {
    return club.logoUrl;
  }
  
  // If logoUrl starts with /api, prepend the base URL
  if (club.logoUrl.startsWith('/api')) {
    return `${API.replace('/api', '')}${club.logoUrl}`;
  }
  
  // Otherwise construct the URL
  return `${API}/clubs/${club.id}/logo`;
}

// Handle image loading errors
function handleImageError(event) {
  event.target.style.display = 'none';
  console.log('Failed to load club logo image');
}

onMounted(() => {
  loadClubRequests();
});
</script>