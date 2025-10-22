<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">Club Applications</h1>
          <p class="text-blue-100">Manage your club membership applications</p>
        </div>
        <button 
          @click="showApplyModal = true"
          :disabled="hasPendingApplication"
          class="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          :title="hasPendingApplication ? 'You already have a pending application' : ''"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Apply to Club
        </button>
      </div>
    </div>

    <!-- Applications List -->
    <div v-if="applications.length > 0" class="space-y-4">
      <div 
        v-for="application in applications" 
        :key="application._id"
        class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
      >
        <!-- Status Banner -->
        <div 
          :class="[
            'px-6 py-3',
            application.status === 'pending' ? 'bg-yellow-50 border-b-2 border-yellow-200' :
            application.status === 'approved' ? 'bg-green-50 border-b-2 border-green-200' :
            'bg-red-50 border-b-2 border-red-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div 
                :class="[
                  'w-3 h-3 rounded-full',
                  application.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                  application.status === 'approved' ? 'bg-green-500' :
                  'bg-red-500'
                ]"
              ></div>
              <span 
                :class="[
                  'text-sm font-semibold uppercase tracking-wide',
                  application.status === 'pending' ? 'text-yellow-800' :
                  application.status === 'approved' ? 'text-green-800' :
                  'text-red-800'
                ]"
              >
                {{ formatStatus(application.status) }}
              </span>
            </div>
            <span class="text-xs text-gray-600">Application #{{ application._id.slice(-6) }}</span>
          </div>
        </div>

        <div class="p-6">
          <!-- Club Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{ application.clubName }}</h3>
                <div class="flex items-center gap-2 mt-1 text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-sm">{{ application.clubLocation }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Applied On</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(application.appliedAt) }}</p>
                </div>
              </div>
              <div v-if="application.processedAt" class="flex items-center gap-3">
                <div 
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    application.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                  ]"
                >
                  <svg 
                    :class="[
                      'w-5 h-5',
                      application.status === 'approved' ? 'text-green-600' : 'text-red-600'
                    ]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Processed On</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(application.processedAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rejection Reason -->
          <div v-if="application.rejectionReason" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-red-800 mb-1">Rejection Reason</p>
                <p class="text-sm text-red-700">{{ application.rejectionReason }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button 
              v-if="application.status === 'pending'"
              @click.stop="confirmCancel(application)"
              class="inline-flex items-center px-4 py-2 border-2 border-red-200 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancel Application
            </button>
            <button 
              @click="viewClubDetails(application)"
              class="inline-flex items-center px-4 py-2 border-2 border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              View Club Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-lg p-12">
      <div class="text-center">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">Start your cricket journey by applying to clubs. Browse available clubs and submit your application to join their training programs.</p>
        <button 
          @click="showApplyModal = true"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all font-semibold text-lg"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Apply to Your First Club
        </button>
      </div>
    </div>

    <!-- Apply to Club Modal -->
    <div v-if="showApplyModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">Browse & Apply to Clubs</h3>
              <p class="text-blue-100 text-sm mt-1">Choose a club that matches your cricket goals</p>
            </div>
            <button 
              @click="closeApplyModal"
              class="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="availableClubs.length > 0" class="space-y-4">
            <div 
              v-for="club in availableClubs" 
              :key="club._id"
              class="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl cursor-pointer transition-all group"
              @click="selectClub(club)"
            >
              <div class="flex items-start gap-4">
                <!-- Club Icon -->
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                
                <!-- Club Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ club.name }}</h4>
                    <div class="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0 ml-4">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>{{ club.district }}, {{ club.city }}</span>
                    </div>
                  </div>
                  
                  <p v-if="club.description" class="text-gray-600 text-sm mb-3 line-clamp-2">{{ club.description }}</p>
                  
                  <div class="flex items-center gap-6 text-sm">
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span class="font-medium">{{ club.memberCount || 0 }} Members</span>
                    </div>
                    <div class="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Accepting Applications
                    </div>
                  </div>
                </div>

                <!-- Arrow Icon -->
                <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Clubs Available -->
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Clubs Available</h3>
            <p class="text-gray-600">There are currently no clubs accepting applications. Please check back later.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-8 py-4 flex justify-end">
          <button 
            type="button"
            @click="closeApplyModal"
            class="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="bg-red-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white">Cancel Application</h3>
          </div>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700 mb-2">Are you sure you want to cancel your application to</p>
          <p class="text-lg font-bold text-gray-900 mb-4">{{ applicationToCancel?.clubName }}?</p>
          <p class="text-sm text-gray-600">This action cannot be undone. You'll need to submit a new application if you change your mind.</p>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button 
            @click="showCancelModal = false"
            class="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Keep Application
          </button>
          <button 
            @click="cancelApplication"
            :disabled="isCancelling"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isCancelling" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isCancelling ? 'Cancelling...' : 'Yes, Cancel Application' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Club Details Modal -->
    <div v-if="showClubDetailsModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">Club Details</h3>
              <p class="text-blue-100 text-sm mt-1">Complete information about the club</p>
            </div>
            <button 
              @click="closeClubDetailsModal"
              class="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-200px)]" v-if="selectedClub">
          <!-- Club Header -->
          <div class="flex items-center gap-6 mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="flex-1">
              <h4 class="text-3xl font-bold text-gray-900 mb-2">{{ selectedClub.name }}</h4>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-lg">{{ selectedClub.district }}, {{ selectedClub.city }}</span>
              </div>
            </div>
          </div>

          <!-- Club Description -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
            <h5 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              About the Club
            </h5>
            <p class="text-gray-700 leading-relaxed">
              {{ selectedClub.description || 'A premier cricket club dedicated to developing talent and fostering excellence in cricket. Our club provides world-class facilities, professional coaching, and a supportive environment for players of all skill levels.' }}
            </p>
          </div>

          <!-- Club Stats -->
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="bg-white border-2 border-blue-100 rounded-xl p-5 hover:border-blue-300 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total Members</p>
                  <p class="text-2xl font-bold text-gray-900">{{ selectedClub.memberCount || 0 }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white border-2 border-green-100 rounded-xl p-5 hover:border-green-300 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Application Status</p>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p class="text-lg font-bold text-green-700">Accepting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="bg-gray-50 rounded-2xl p-6">
            <h5 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              Club Features
            </h5>
            <div class="grid md:grid-cols-2 gap-3">
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Professional Coaching</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Modern Facilities</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Regular Training Sessions</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Performance Tracking</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Match Opportunities</span>
              </div>
              <div class="flex items-center gap-3 text-gray-700">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Fitness Programs</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-8 py-4 flex justify-end gap-3">
          <button 
            type="button"
            @click="closeClubDetailsModal"
            class="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Close
          </button>
          <button 
            v-if="!applications.some(app => app.club?._id === selectedClub._id || app.clubName === selectedClub.name)"
            type="button"
            @click="confirmApply"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Apply to Join
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Apply Modal -->
    <div v-if="showConfirmApplyModal" class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white">Confirm Application</h3>
          </div>
        </div>
        
        <div class="p-6">
          <p class="text-gray-700 mb-2">You're about to submit your application to</p>
          <p class="text-lg font-bold text-gray-900 mb-4">{{ selectedClub?.name }}</p>
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
            <p class="text-sm text-blue-900"><strong>Note:</strong> The club manager will review your profile and you'll be notified of their decision.</p>
          </div>
          <p class="text-sm text-gray-600">Are you sure you want to proceed?</p>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button 
            @click="showConfirmApplyModal = false; showClubDetailsModal = true"
            class="inline-flex items-center px-4 py-2 border-2 border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Go Back
          </button>
          <button 
            @click="submitApplication"
            :disabled="isSubmitting"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isSubmitting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Yes, Submit Application' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { notify } from '../../../utils/notifications';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    required: true
  }
});

// Reactive data
const applications = ref([]);
const availableClubs = ref([]);
const showApplyModal = ref(false);
const isSubmitting = ref(false);
const showCancelModal = ref(false);
const applicationToCancel = ref(null);
const isCancelling = ref(false);
const showClubDetailsModal = ref(false);
const selectedClub = ref(null);
const showConfirmApplyModal = ref(false);

// Computed properties
const hasPendingApplication = computed(() => {
  return applications.value.some(app => app.status === 'pending');
});

// Fetch real application data
onMounted(async () => {
  await fetchApplications();
  await fetchAvailableClubs();
});

async function fetchApplications() {
  try {
    // Fetch real applications from the backend
    const response = await axios.get(`${API}/players/applications`, { withCredentials: true });
    
    // Map applications to include club details in the proper format
    applications.value = (response.data.applications || []).map(app => ({
      _id: app._id,
      clubName: app.club?.clubName || app.club?.name || 'Unknown Club',
      clubLocation: app.club ? `${app.club.district}, ${app.club.city}` : 'Unknown Location',
      status: app.status,
      appliedAt: app.appliedAt,
      processedAt: app.processedAt,
      rejectionReason: app.rejectionReason,
      club: app.club // Keep the full club object for details modal
    }));
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
  }
}

async function fetchAvailableClubs() {
  try {
    // Fetch real available clubs from the backend
    const response = await axios.get(`${API}/players/clubs/available`, { withCredentials: true });
    availableClubs.value = response.data.clubs || [];
  } catch (error) {
    console.error('Error fetching available clubs:', error);
    availableClubs.value = [];
  }
}

function formatStatus(status) {
  const statusMap = {
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function closeApplyModal() {
  showApplyModal.value = false;
}

function selectClub(club) {
  selectedClub.value = club;
  showApplyModal.value = false;
  showClubDetailsModal.value = true;
}

function confirmApply() {
  showClubDetailsModal.value = false;
  showConfirmApplyModal.value = true;
}

async function submitApplication() {
  if (!selectedClub.value) return;
  
  isSubmitting.value = true;
  try {
    await axios.post(`${API}/players/apply-to-club/${selectedClub.value._id}`, {}, { withCredentials: true });
    notify.success('Application submitted successfully! The club manager will review your profile.');
    showConfirmApplyModal.value = false;
    selectedClub.value = null;
    await fetchApplications();
  } catch (error) {
    console.error('Error submitting application:', error);
    notify.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}

function viewClubDetails(application) {
  selectedClub.value = {
    _id: application.club?._id,
    name: application.club?.clubName || application.club?.name || application.clubName,
    district: application.club?.district,
    city: application.club?.city,
    description: application.club?.description,
    memberCount: application.club?.memberCount
  };
  showClubDetailsModal.value = true;
}

function closeClubDetailsModal() {
  showClubDetailsModal.value = false;
  showConfirmApplyModal.value = false;
  if (!showConfirmApplyModal.value) {
    selectedClub.value = null;
  }
}

function confirmCancel(application) {
  applicationToCancel.value = application;
  showCancelModal.value = true;
}

async function cancelApplication() {
  if (!applicationToCancel.value) return;
  
  isCancelling.value = true;
  try {
    // Make API call to cancel the application
    await axios.delete(`${API}/players/applications/${applicationToCancel.value._id}`, { withCredentials: true });
    
    // Close modal and refresh applications
    showCancelModal.value = false;
    applicationToCancel.value = null;
    await fetchApplications();
    
    notify.success('Application cancelled successfully');
  } catch (error) {
    console.error('Error cancelling application:', error);
    notify.error(error.response?.data?.message || 'Failed to cancel application. Please try again.');
  } finally {
    isCancelling.value = false;
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>