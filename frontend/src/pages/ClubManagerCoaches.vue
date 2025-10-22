<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Coach Management</h1>
        <p class="text-slate-600">Manage coach applications and your club coaching staff</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
          <span class="text-sm font-semibold text-orange-700">{{ pendingApplications.length }} Pending</span>
        </div>
        <div class="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <span class="text-sm font-semibold text-green-700">{{ approvedCoaches.length }} Active Coaches</span>
        </div>
        <div class="px-4 py-2 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
          <span class="text-sm font-semibold text-gray-700">{{ resignedCoaches.length }} Resigned</span>
        </div>
      </div>
    </div>

    <!-- Coach Tabs -->
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-500/10 border border-slate-100/50 overflow-hidden">
      <div class="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <nav class="flex">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                  :class="[
                    'relative px-8 py-5 text-sm font-semibold transition-all duration-300',
                    activeTab === tab.key 
                      ? 'text-blue-600 bg-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  ]">
            <span class="relative z-10">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="ml-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              {{ tab.count }}
            </span>
            <div v-if="activeTab === tab.key" class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-full"></div>
          </button>
        </nav>
      </div>

      <div class="p-8">
        <!-- Pending Applications -->
        <div v-if="activeTab === 'pending'">
          <div v-if="loadingApplications" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p class="text-slate-600 mt-4 font-medium">Loading applications...</p>
          </div>
          <div v-else-if="pendingApplications.length === 0" class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Pending Applications</h3>
            <p class="text-slate-600 max-w-md mx-auto">There are no coach applications waiting for your review. New applications will appear here.</p>
          </div>
          <div v-else class="grid gap-6">
            <div v-for="application in pendingApplications" :key="application._id" 
                 class="group bg-white border-2 border-orange-100 rounded-3xl p-8 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                <div class="flex items-center gap-6 flex-1">
                  <div class="relative">
                    <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {{ application.coach?.fullName?.charAt(0)?.toUpperCase() || 'C' }}
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-bold text-slate-900 mb-2">{{ application.coach?.fullName || 'Unknown Coach' }}</h3>
                    <div class="grid sm:grid-cols-2 gap-3 text-sm">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Age: {{ application.coach?.age || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Experience: {{ formatExperience(application.coach?.coachingExperience) || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">{{ application.coach?.user?.email || 'No email' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Applied: {{ formatDate(application.appliedAt) }}</span>
                      </div>
                    </div>
                    
                    <!-- Coach Specializations -->
                    <div v-if="application.coach?.specializations && application.coach.specializations.length > 0" class="mt-4 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Specializations:</div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="spec in application.coach.specializations" :key="spec" 
                              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {{ formatSpecialization(spec) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Coaching Philosophy -->
                    <div v-if="application.coach?.coachingPhilosophy" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Coaching Philosophy:</div>
                      <div class="text-sm text-slate-600">{{ application.coach.coachingPhilosophy }}</div>
                    </div>
                    
                    <!-- Methodology -->
                    <div v-if="application.coach?.methodology" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Methodology:</div>
                      <div class="text-sm text-slate-600">{{ application.coach.methodology }}</div>
                    </div>
                    
                    <!-- Coaching History -->
                    <div v-if="application.coach?.coachingHistory && application.coach.coachingHistory.length > 0" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Coaching History:</div>
                      <div class="space-y-3">
                        <div v-for="(history, index) in application.coach.coachingHistory" :key="index" 
                             class="border-l-2 border-blue-200 pl-3 py-1">
                          <div class="font-medium text-slate-800">{{ history.teamName }}</div>
                          <div class="text-sm text-slate-600">{{ history.position }} ({{ history.yearsCoached }})</div>
                          <div v-if="history.playersCoached" class="text-xs text-slate-500">{{ history.playersCoached }} players coached</div>
                          <div v-if="history.achievements" class="text-xs text-slate-500 mt-1">
                            <span class="font-medium">Achievements:</span> {{ history.achievements }}
                          </div>
                          <div v-if="history.description" class="text-xs text-slate-500 mt-1">
                            <span class="font-medium">Description:</span> {{ history.description }}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Certifications -->
                    <div v-if="application.coach?.certifications && application.coach.certifications.length > 0" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Certifications:</div>
                      <div class="space-y-2">
                        <div v-for="(cert, index) in application.coach.certifications" :key="index" 
                             class="border-l-2 border-green-200 pl-3 py-1">
                          <div class="font-medium text-slate-800">{{ cert.name }}</div>
                          <div class="text-sm text-slate-600">{{ cert.issuingBody }} - {{ cert.level }}</div>
                          <div class="text-xs text-slate-500">Year: {{ cert.yearObtained }}</div>
                          <div v-if="cert.certificateNumber" class="text-xs text-slate-500">ID: {{ cert.certificateNumber }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Address Information -->
                    <div v-if="application.coach?.address" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Address:</div>
                      <div class="text-sm text-slate-600">
                        {{ application.coach.address.street }}, {{ application.coach.address.city }}, 
                        {{ application.coach.address.district }}, {{ application.coach.address.state }} - {{ application.coach.address.pincode }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row gap-3 lg:flex-col">
                  <button @click="approveApplication(application)" 
                          :disabled="processing === application._id"
                          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span v-if="processing === application._id">Approving...</span>
                    <span v-else>Approve</span>
                  </button>
                  <button @click="rejectApplication(application)" 
                          :disabled="processing === application._id"
                          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span v-if="processing === application._id">Rejecting...</span>
                    <span v-else>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved Coaches -->
        <div v-if="activeTab === 'approved'">
          <div v-if="loadingApplications || loadingCoaches" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p class="text-slate-600 mt-4 font-medium">Loading coaches...</p>
          </div>
          <div v-else-if="approvedCoaches.length === 0" class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Active Coaches</h3>
            <p class="text-slate-600 max-w-md mx-auto">You don't have any approved coaches yet. Approved coaches will appear here.</p>
          </div>
          <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="coach in approvedCoaches" :key="coach._id" 
                 class="group bg-white border-2 border-green-100 rounded-3xl p-6 hover:border-green-200 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <div class="text-center">
                <div class="relative inline-block mb-4">
                  <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto">
                    {{ coach.fullName?.charAt(0)?.toUpperCase() || 'C' }}
                  </div>
                  <div class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
                
                <h3 class="text-lg font-bold text-slate-900 mb-2">{{ coach.fullName }}</h3>
                <div class="flex items-center justify-center gap-2 mb-4 flex-wrap">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {{ formatExperience(coach.coachingExperience) }}
                  </span>
                  <span v-for="spec in coach.specializations" :key="spec" 
                        class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    {{ formatSpecialization(spec) }}
                  </span>
                </div>
                
                <div class="space-y-2 text-sm text-left mb-4">
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                    <span class="text-slate-600">Age</span>
                    <span class="font-semibold text-slate-900">{{ coach.age || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                    <span class="text-slate-600">Experience</span>
                    <span class="font-semibold text-slate-900">{{ formatExperience(coach.coachingExperience) || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center justify-between py-2 px-3 bg-green-50 rounded-xl border border-green-200">
                    <span class="text-green-700 font-medium">Joined</span>
                    <span class="font-semibold text-green-800">{{ formatDate(coach.joinedDate) }}</span>
                  </div>
                  <div v-if="coach.phone" class="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                    <span class="text-slate-600">Phone</span>
                    <span class="font-semibold text-slate-900">{{ coach.phone }}</span>
                  </div>
                  <div v-if="coach.address" class="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                    <span class="text-slate-600">Location</span>
                    <span class="font-semibold text-slate-900">{{ coach.address.city }}, {{ coach.address.district }}</span>
                  </div>
                </div>

                <!-- Coach Specializations -->
                <div v-if="coach.specializations && coach.specializations.length > 0" class="mb-4 p-3 bg-slate-50 rounded-xl">
                  <div class="text-sm font-medium text-slate-700 mb-2">Specializations:</div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="spec in coach.specializations" :key="spec" 
                          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {{ formatSpecialization(spec) }}
                    </span>
                  </div>
                </div>

                <!-- Coaching Philosophy -->
                <div v-if="coach.coachingPhilosophy" class="mb-4 p-3 bg-slate-50 rounded-xl">
                  <div class="text-sm font-medium text-slate-700 mb-2">Coaching Philosophy:</div>
                  <div class="text-sm text-slate-600">{{ coach.coachingPhilosophy }}</div>
                </div>

                <!-- Coaching History -->
                <div v-if="coach.coachingHistory && coach.coachingHistory.length > 0" class="mb-4 p-3 bg-slate-50 rounded-xl">
                  <div class="text-sm font-medium text-slate-700 mb-2">Coaching History:</div>
                  <div class="space-y-2">
                    <div v-for="(history, index) in coach.coachingHistory" :key="index" 
                         class="border-l-2 border-green-200 pl-2 py-1">
                      <div class="font-medium text-slate-800 text-sm">{{ history.teamName }}</div>
                      <div class="text-xs text-slate-600">{{ history.position }} ({{ history.yearsCoached }})</div>
                      <div v-if="history.playersCoached" class="text-xs text-slate-500">{{ history.playersCoached }} players coached</div>
                    </div>
                  </div>
                </div>

                <!-- Certifications -->
                <div v-if="coach.certifications && coach.certifications.length > 0" class="mb-4 p-3 bg-slate-50 rounded-xl">
                  <div class="text-sm font-medium text-slate-700 mb-2">Certifications:</div>
                  <div class="space-y-2">
                    <div v-for="(cert, index) in coach.certifications" :key="index" 
                         class="border-l-2 border-blue-200 pl-2 py-1">
                      <div class="font-medium text-slate-800 text-sm">{{ cert.name }}</div>
                      <div class="text-xs text-slate-600">{{ cert.issuingBody }} - {{ cert.level }}</div>
                      <div class="text-xs text-slate-500">Year: {{ cert.yearObtained }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <button @click="openCoachProfileModal(coach)" 
                          class="flex-1 px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors">
                    View Profile
                  </button>
                  <button @click="removeCoach(coach)" 
                          :disabled="processing === coach._id"
                          class="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Resigned Coaches -->
        <div v-if="activeTab === 'resigned'">
          <div v-if="loadingApplications || loadingCoaches" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-500 border-t-transparent"></div>
            <p class="text-slate-600 mt-4 font-medium">Loading resigned coaches...</p>
          </div>
          <div v-else-if="resignedCoaches.length === 0" class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Resigned Coaches</h3>
            <p class="text-slate-600 max-w-md mx-auto">There are no coaches who have resigned from your club yet.</p>
          </div>
          <div v-else class="grid gap-6">
            <div v-for="application in resignedCoaches" :key="application._id" 
                 class="group bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-500/10 transition-all duration-300">
              <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                <div class="flex items-center gap-6 flex-1">
                  <div class="relative">
                    <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {{ application.coach?.fullName?.charAt(0)?.toUpperCase() || 'C' }}
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-bold text-slate-900 mb-2">{{ application.coach?.fullName || 'Unknown Coach' }}</h3>
                    <div class="grid sm:grid-cols-2 gap-3 text-sm">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Age: {{ application.coach?.age || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Experience: {{ formatExperience(application.coach?.coachingExperience) || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">{{ application.coach?.user?.email || 'No email' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                          <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                        <span class="text-slate-600">Resigned: {{ formatDate(application.appliedAt) }}</span>
                      </div>
                    </div>
                    
                    <!-- Resignation Reason -->
                    <div v-if="application.resignationReason" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div class="text-sm font-medium text-red-700 mb-2">Resignation Reason:</div>
                      <div class="text-sm text-red-600">{{ application.resignationReason }}</div>
                    </div>
                    
                    <!-- Other coach information (same as pending applications) -->
                    <!-- Coach Specializations -->
                    <div v-if="application.coach?.specializations && application.coach.specializations.length > 0" class="mt-4 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Specializations:</div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="spec in application.coach.specializations" :key="spec" 
                              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {{ formatSpecialization(spec) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Coaching Philosophy -->
                    <div v-if="application.coach?.coachingPhilosophy" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Coaching Philosophy:</div>
                      <div class="text-sm text-slate-600">{{ application.coach.coachingPhilosophy }}</div>
                    </div>
                    
                    <!-- Methodology -->
                    <div v-if="application.coach?.methodology" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Methodology:</div>
                      <div class="text-sm text-slate-600">{{ application.coach.methodology }}</div>
                    </div>
                    
                    <!-- Coaching History -->
                    <div v-if="application.coach?.coachingHistory && application.coach.coachingHistory.length > 0" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Coaching History:</div>
                      <div class="space-y-3">
                        <div v-for="(history, index) in application.coach.coachingHistory" :key="index" 
                             class="border-l-2 border-blue-200 pl-3 py-1">
                          <div class="font-medium text-slate-800">{{ history.teamName }}</div>
                          <div class="text-sm text-slate-600">{{ history.position }} ({{ history.yearsCoached }})</div>
                          <div v-if="history.playersCoached" class="text-xs text-slate-500">{{ history.playersCoached }} players coached</div>
                          <div v-if="history.achievements" class="text-xs text-slate-500 mt-1">
                            <span class="font-medium">Achievements:</span> {{ history.achievements }}
                          </div>
                          <div v-if="history.description" class="text-xs text-slate-500 mt-1">
                            <span class="font-medium">Description:</span> {{ history.description }}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Certifications -->
                    <div v-if="application.coach?.certifications && application.coach.certifications.length > 0" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Certifications:</div>
                      <div class="space-y-2">
                        <div v-for="(cert, index) in application.coach.certifications" :key="index" 
                             class="border-l-2 border-green-200 pl-3 py-1">
                          <div class="font-medium text-slate-800">{{ cert.name }}</div>
                          <div class="text-sm text-slate-600">{{ cert.issuingBody }} - {{ cert.level }}</div>
                          <div class="text-xs text-slate-500">Year: {{ cert.yearObtained }}</div>
                          <div v-if="cert.certificateNumber" class="text-xs text-slate-500">ID: {{ cert.certificateNumber }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Address Information -->
                    <div v-if="application.coach?.address" class="mt-3 p-3 bg-slate-50 rounded-xl">
                      <div class="text-sm font-medium text-slate-700 mb-2">Address:</div>
                      <div class="text-sm text-slate-600">
                        {{ application.coach.address.street }}, {{ application.coach.address.city }}, 
                        {{ application.coach.address.district }}, {{ application.coach.address.state }} - {{ application.coach.address.pincode }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Coach Profile Modal -->
    <div v-if="showCoachProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Coach Profile</h3>
          <button @click="closeCoachProfileModal" class="text-gray-400 hover:text-gray-500">
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
                  <span class="text-sm text-gray-900">{{ selectedCoach.gender || 'Not specified' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Email:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.email }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Phone:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.phone || 'Not provided' }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-3">Address</h4>
              <div class="space-y-2">
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Street:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.street || 'Not provided' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">City:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.city || 'Not provided' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">District:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.district || 'Not provided' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">State:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.state || 'Not provided' }}</span>
                </div>
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Pincode:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.address?.pincode || 'Not provided' }}</span>
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
                <div v-if="selectedCoach.specializations && selectedCoach.specializations.length > 0" class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Specializations:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.specializations.map(spec => formatSpecialization(spec)).join(', ') }}</span>
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
                <div class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Joined Club:</span>
                  <span class="text-sm text-gray-900">{{ formatDate(selectedCoach.joinedDate) }}</span>
                </div>
                <div v-if="selectedCoach.approvalNotes" class="flex">
                  <span class="text-sm font-medium text-gray-500 w-32">Approval Notes:</span>
                  <span class="text-sm text-gray-900">{{ selectedCoach.approvalNotes }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Coaching History Section -->
          <div v-if="selectedCoach.coachingHistory && selectedCoach.coachingHistory.length > 0" class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-3">Coaching History</h4>
            <div class="border border-gray-200 rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team/Club</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players Coached</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(history, index) in selectedCoach.coachingHistory" :key="index">
                    <td class="px-4 py-2 text-sm text-gray-900">
                      <div>{{ history.teamName }}</div>
                      <div v-if="history.description" class="text-xs text-gray-500">{{ history.description }}</div>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ history.position }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ history.yearsCoached }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ history.playersCoached || 'N/A' }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ history.achievements || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Certifications Section -->
          <div v-if="selectedCoach.certifications && selectedCoach.certifications.length > 0" class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-3">Certifications</h4>
            <div class="border border-gray-200 rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuing Body</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(cert, index) in selectedCoach.certifications" :key="index">
                    <td class="px-4 py-2 text-sm text-gray-900">
                      <div>{{ cert.name }}</div>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ cert.issuingBody }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ cert.level }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ cert.yearObtained }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ cert.certificateNumber || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Documents Section -->
          <div v-if="selectedCoach.documents && selectedCoach.documents.length > 0" class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-3">Documents</h4>
            <div class="border border-gray-200 rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(doc, index) in selectedCoach.documents" :key="index">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ doc.name }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">
                      <span class="px-2 py-1 text-xs rounded-full" :class="{
                        'bg-blue-100 text-blue-800': doc.type === 'certificate',
                        'bg-green-100 text-green-800': doc.type === 'reference',
                        'bg-purple-100 text-purple-800': doc.type === 'portfolio',
                        'bg-yellow-100 text-yellow-800': doc.type === 'photo'
                      }">
                        {{ doc.type }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ formatDate(doc.uploadedAt) }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">
                      <button @click="viewDocument(selectedCoach._id, doc._id)" 
                              class="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            @click="closeCoachProfileModal"
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
import { ref, computed, onMounted } from 'vue'
import { notify } from '../utils/notifications'
import api from '../utils/api'

// Tabs and navigation
const activeTab = ref('pending')
const tabs = computed(() => [
  { key: 'pending', label: 'Pending Applications', count: pendingApplications.value.length },
  { key: 'approved', label: 'Approved Coaches', count: approvedCoaches.value.length },
  { key: 'resigned', label: 'Resigned Coaches', count: resignedCoaches.value.length }
])

// Data
const pendingApplications = ref([])
const approvedCoaches = ref([])
const loadingApplications = ref(true)
const loadingCoaches = ref(true)
const processing = ref(null)

// Modal states
const showCoachProfileModal = ref(false)
const selectedCoach = ref(null)

// Fetch all coach applications and filter by status
const allApplications = ref([])

// Add resigned coaches data
const resignedCoaches = computed(() => {
  return allApplications.value.filter(app => app.status === 'resigned')
})

const fetchCoachApplications = async () => {
  try {
    loadingApplications.value = true
    loadingCoaches.value = true
    
    const response = await api.get('/coaches/club/applications')
    allApplications.value = response.data.applications || []
    
    // Filter applications by status
    pendingApplications.value = allApplications.value.filter(app => app.status === 'pending')
    
    // Transform approved applications into coach objects with proper structure
    approvedCoaches.value = allApplications.value
      .filter(app => app.status === 'approved')
      .map(app => ({
        _id: app.coach._id,
        applicationId: app._id,
        fullName: app.coach.fullName,
        age: app.coach.age,
        coachingExperience: app.coach.coachingExperience,
        specializations: app.coach.specializations,
        coachingHistory: app.coach.coachingHistory,
        email: app.coach.user?.email,
        phone: app.coach.phone,
        address: app.coach.address,
        gender: app.coach.gender,
        coachingPhilosophy: app.coach.coachingPhilosophy,
        methodology: app.coach.methodology,
        certifications: app.coach.certifications,
        joinedDate: app.processedAt || app.appliedAt,
        approvalNotes: app.approvalNotes,
        hasProfilePhoto: app.coach.hasProfilePhoto,
        playersCoached: app.coach.playersCoached || 0,
        yearsOfExperience: app.coach.yearsOfExperience || 0,
        tournamentsWon: app.coach.tournamentsWon || 0
      }))
    
    // resignedCoaches is computed from allApplications
    
  } catch (error) {
    console.error('Error fetching coach applications:', error)
    notify.error('Failed to load coach applications')
  } finally {
    loadingApplications.value = false
    loadingCoaches.value = false
  }
}

// Approve application
const approveApplication = async (application) => {
  try {
    processing.value = application._id
    const approvalNotes = prompt('Add approval notes (optional):') || ''
    
    await api.put(`/coaches/club/applications/${application._id}/approve`, {
      approvalNotes: approvalNotes
    })
    
    notify.success('Coach application approved successfully')
    // Refresh applications
    await fetchCoachApplications()
  } catch (error) {
    console.error('Error approving application:', error)
    notify.error('Failed to approve coach application')
  } finally {
    processing.value = null
  }
}

// Reject application
const rejectApplication = async (application) => {
  const rejectionReason = prompt('Please provide a reason for rejection (minimum 10 characters):')
  
  if (!rejectionReason || rejectionReason.trim().length < 10) {
    notify.error('Rejection reason must be at least 10 characters long')
    return
  }
  
  try {
    processing.value = application._id
    await api.put(`/coaches/club/applications/${application._id}/reject`, {
      rejectionReason: rejectionReason.trim()
    })
    
    notify.success('Coach application rejected')
    // Refresh applications
    await fetchCoachApplications()
  } catch (error) {
    console.error('Error rejecting application:', error)
    notify.error('Failed to reject coach application')
  } finally {
    processing.value = null
  }
}

// Remove coach
const removeCoach = async (coach) => {
  const removalReason = prompt(`Please provide a reason for removing ${coach.fullName} from your club (minimum 10 characters):`);
  
  if (!removalReason || removalReason.trim().length < 10) {
    notify.error('Removal reason must be at least 10 characters long');
    return;
  }
  
  if (!confirm(`Are you sure you want to remove ${coach.fullName} from your club?`)) return;
  
  try {
    processing.value = coach._id;
    await api.delete(`/clubs/remove-coach/${coach._id}`, {
      data: { removalReason: removalReason.trim() }
    });
    notify.success('Coach removed from club');
    // Refresh applications
    await fetchCoachApplications();
  } catch (error) {
    console.error('Error removing coach:', error);
    notify.error('Failed to remove coach from club');
  } finally {
    processing.value = null;
  }
}

// Format experience
const formatExperience = (years) => {
  if (!years) return 'N/A'
  return years === 1 ? '1 year' : `${years} years`
}

// Format specialization
const formatSpecialization = (spec) => {
  if (!spec) return ''
  return spec.charAt(0).toUpperCase() + spec.slice(1).replace(/([A-Z])/g, ' $1').trim()
}

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// View document
const viewDocument = async (coachId, documentId) => {
  try {
    const response = await api.get(`/coaches/club/coach/${coachId}/document/${documentId}`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error viewing document:', error)
    notify.error('Failed to view document')
  }
}

// Modal functions for coach profile
const openCoachProfileModal = (coach) => {
  selectedCoach.value = coach
  showCoachProfileModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeCoachProfileModal = () => {
  showCoachProfileModal.value = false
  selectedCoach.value = null
  document.body.style.overflow = 'auto'
}

// Fetch data on mount
onMounted(() => {
  fetchCoachApplications()
})
</script>
