<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Club Manager Portal
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Club Management Dashboard</h1>
        <p class="text-xl text-gray-600">Manage your cricket club and connect with Kerala's cricket community</p>
      </div>

      <!-- Club Status Card -->
      <div v-if="clubData" class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">{{ clubData.clubName }}</h2>
              <p class="text-blue-100">{{ clubData.city }}, {{ clubData.district }}</p>
            </div>
            <div class="text-right">
              <span 
                :class="[
                  'px-4 py-2 rounded-full text-sm font-semibold',
                  clubData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  clubData.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                {{ clubData.status.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Status Messages -->
          <div v-if="clubData.status === 'pending'" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-yellow-800 mb-2">Registration Under Review</h3>
                <p class="text-yellow-700">
                  Your club registration is currently being reviewed by our admin team. You will receive an email notification once the review is complete. This process typically takes 2-3 business days.
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="clubData.status === 'approved'" class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-green-800 mb-2">Club Approved! 🎉</h3>
                <p class="text-green-700">
                  Congratulations! Your club has been approved and is now part of the CrickArena community. You can now access all club management features and participate in tournaments.
                </p>
              </div>
            </div>
          </div>

          <div v-else-if="clubData.status === 'rejected'" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-red-800 mb-2">Registration Rejected</h3>
                <p class="text-red-700 mb-3">
                  Unfortunately, your club registration was not approved. 
                  <span v-if="clubData.rejectionReason">Reason: {{ clubData.rejectionReason }}</span>
                </p>
                <button 
                  @click="$router.push('/club-registration')"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Submit New Registration
                </button>
              </div>
            </div>
          </div>

          <!-- Edit Approved Club Details -->
          <div v-if="clubData.status === 'approved'" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Club Details</h3>
              <button v-if="!isEditing" @click="startEdit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Edit Club Details</button>
              <div v-else class="flex gap-2">
                <button @click="saveEdit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">Save Changes</button>
                <button @click="cancelEdit" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
              </div>
            </div>

            <div v-if="isEditing" class="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
              <p class="text-sm text-gray-600 mb-4">Editing an approved club will send the details for re-approval.</p>

              <!-- Logo Upload -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Club Logo</label>
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img v-if="editable.logoPreview || editable.logoUrl" :src="editable.logoPreview || editable.logoUrl" alt="Logo preview" class="w-full h-full object-cover" />
                    <span v-else class="text-gray-400 text-xs">No logo</span>
                  </div>
                  <input type="file" accept="image/*" @change="onEditLogoSelected" />
                </div>
              </div>



              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Club Name</label>
                  <input v-model="editable.clubName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">District</label>
                  <input v-model="editable.district" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">City/Town</label>
                  <input v-model="editable.city" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Founded Year</label>
                  <input v-model.number="editable.foundedYear" type="number" min="1900" :max="new Date().getFullYear()" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input v-model="editable.phone" type="tel" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input v-model="editable.email" type="email" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Club Description</label>
                  <textarea v-model="editable.description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Ground/Venue Name</label>
                  <input v-model="editable.groundName" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Estimated Members</label>
                  <input v-model.number="editable.memberCount" type="number" min="1" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Website/Social</label>
                  <input v-model="editable.website" type="url" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Achievements/Notes</label>
                  <textarea v-model="editable.achievements" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Club Information -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div class="text-sm font-semibold text-gray-700 mb-1">Manager</div>
              <div class="text-gray-900">{{ clubData.managerName }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-700 mb-1">Contact</div>
              <div class="text-gray-900">{{ clubData.phone }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-700 mb-1">Email</div>
              <div class="text-gray-900">{{ clubData.email }}</div>
            </div>
            <div v-if="clubData.foundedYear">
              <div class="text-sm font-semibold text-gray-700 mb-1">Founded</div>
              <div class="text-gray-900">{{ clubData.foundedYear }}</div>
            </div>
            <div v-if="clubData.memberCount">
              <div class="text-sm font-semibold text-gray-700 mb-1">Members</div>
              <div class="text-gray-900">{{ clubData.memberCount }}</div>
            </div>
            <div v-if="clubData.groundName">
              <div class="text-sm font-semibold text-gray-700 mb-1">Ground</div>
              <div class="text-gray-900">{{ clubData.groundName }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Club Registered -->
      <div v-else class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="p-12 text-center">
          <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/>
              <path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="7" cy="7" r="4"/>
              <circle cx="17" cy="7" r="4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">No Club Registered</h3>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't registered a cricket club yet. Register your club to join Kerala's premier cricket community and access all management features.
          </p>
          <RouterLink 
            to="/club-registration"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Register Your Club
          </RouterLink>
        </div>
      </div>

      <!-- Player Applications Section (Only for Approved Clubs) -->
      <div v-if="clubData && clubData.status === 'approved'" class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Player Applications</h2>
              <p class="text-green-100">Review and manage player applications to your club</p>
            </div>
            <div class="text-right">
              <span class="px-4 py-2 rounded-full text-sm font-semibold bg-white text-green-600">
                {{ pendingApplications.length }} Pending
              </span>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Loading State -->
          <div v-if="loadingApplications" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p class="text-gray-600 mt-2">Loading applications...</p>
          </div>

          <!-- No Applications -->
          <div v-else-if="playerApplications.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/>
                <path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/>
                <circle cx="7" cy="7" r="4"/>
                <circle cx="17" cy="7" r="4"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Player Applications</h3>
            <p class="text-gray-600">No players have applied to join your club yet.</p>
          </div>

          <!-- Applications List -->
          <div v-else class="space-y-6">
            <!-- Filter Tabs -->
            <div class="flex gap-2 border-b border-gray-200">
              <button 
                v-for="status in ['all', 'pending', 'approved', 'rejected']" 
                :key="status"
                @click="applicationFilter = status"
                :class="[
                  'px-4 py-2 font-semibold text-sm border-b-2 transition-colors',
                  applicationFilter === status 
                    ? 'border-green-600 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ status.charAt(0).toUpperCase() + status.slice(1) }}
                <span v-if="status !== 'all'" class="ml-1 text-xs">
                  ({{ getApplicationsByStatus(status).length }})
                </span>
                <span v-else class="ml-1 text-xs">
                  ({{ playerApplications.length }})
                </span>
              </button>
            </div>

            <!-- Applications -->
            <div class="space-y-4">
              <div 
                v-for="application in filteredApplications" 
                :key="application._id"
                class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span class="text-green-600 font-bold text-lg">
                        {{ application.playerName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <h4 class="text-lg font-bold text-gray-900">{{ application.playerName }}</h4>
                      <p class="text-gray-600">{{ application.playerEmail }}</p>
                      <p class="text-sm text-gray-500">Applied {{ formatDate(application.appliedAt) }}</p>
                    </div>
                  </div>
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ application.status.toUpperCase() }}
                  </span>
                </div>

                <!-- Player Details -->
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span class="font-semibold text-gray-700">Age:</span>
                    <span class="text-gray-600 ml-1">{{ application.playerAge }} years</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Position:</span>
                    <span class="text-gray-600 ml-1">{{ application.playerPosition }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Batting:</span>
                    <span class="text-gray-600 ml-1">{{ application.playerBattingStyle }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Bowling:</span>
                    <span class="text-gray-600 ml-1">{{ application.playerBowlingStyle }}</span>
                  </div>
                </div>

                <!-- Application Message -->
                <div v-if="application.message" class="bg-gray-50 rounded-lg p-4 mb-4">
                  <p class="text-sm text-gray-700">
                    <span class="font-semibold">Message:</span> {{ application.message }}
                  </p>
                </div>

                <!-- Rejection Reason -->
                <div v-if="application.status === 'rejected' && application.rejectionReason" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p class="text-sm text-red-700">
                    <span class="font-semibold">Rejection Reason:</span> {{ application.rejectionReason }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div v-if="application.status === 'pending'" class="flex gap-3">
                  <button 
                    @click="approveApplication(application._id)"
                    :disabled="processingApplication === application._id"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <span v-if="processingApplication === application._id">Processing...</span>
                    <span v-else>Approve</span>
                  </button>
                  <button 
                    @click="openRejectModal(application)"
                    :disabled="processingApplication === application._id"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button 
                    @click="viewPlayerProfile(application.playerId)"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity Section (Only for Approved Clubs) -->
      <div v-if="clubData && clubData.status === 'approved'" class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Recent Activity</h2>
              <p class="text-indigo-100">Latest events and updates for your club</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Loading State -->
          <div v-if="loadingActivity" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="text-gray-600 mt-2">Loading activity...</p>
          </div>

          <!-- No Activity -->
          <div v-else-if="recentActivity.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
            <p class="text-gray-600">There's no recent activity for your club yet.</p>
          </div>

          <!-- Activity List with Scrollbar -->
          <div v-else class="max-h-96 overflow-y-auto space-y-4 pr-2">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div class="flex-shrink-0 mt-1">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  `bg-${getActivityColor(activity.type)}-100`,
                  `text-${getActivityColor(activity.type)}-600`
                ]">
                  <svg v-if="getActivityIcon(activity.type) === 'upload'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'check'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'x'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'user-plus'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'user-check'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'user-x'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <svg v-else-if="getActivityIcon(activity.type) === 'calendar'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-900 font-medium">{{ activity.message }}</p>
                <p class="text-sm text-gray-500">{{ formatDateTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Training Sessions Section (Only for Approved Clubs) -->
      <div v-if="clubData && clubData.status === 'approved'" class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Training Sessions</h2>
              <p class="text-cyan-100">View training sessions se the fixconducted by your club's coach</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Loading State -->
          <div v-if="loadingSessions" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            <p class="text-gray-600 mt-2">Loading training sessions...</p>
          </div>

          <!-- No Sessions -->
          <div v-else-if="trainingSessions.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Training Sessions</h3>
            <p class="text-gray-600">Your club's coach hasn't scheduled any training sessions yet.</p>
          </div>

          <!-- Sessions List -->
          <div v-else class="space-y-6">
            <div 
              v-for="session in trainingSessions" 
              :key="session._id"
              class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-lg font-bold text-gray-900">{{ session.focusArea }}</h4>
                  <p class="text-gray-600">{{ session.location }}</p>
                  <p class="text-sm text-gray-500">{{ session.programTitle }}</p>
                </div>
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-semibold',
                    isUpcoming(session.date) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ isUpcoming(session.date) ? 'Upcoming' : 'Completed' }}
                </span>
              </div>

              <div class="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span class="font-semibold text-gray-700">Date:</span>
                  <span class="text-gray-600 ml-1">{{ formatDate(session.date) }}</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">Time:</span>
                  <span class="text-gray-600 ml-1">{{ formatTime(session.startTime) }} - {{ formatTime(session.endTime) }}</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">Attendance:</span>
                  <span class="text-gray-600 ml-1">{{ session.attendees }}/{{ session.totalPlayers }} players</span>
                </div>
              </div>

              <div v-if="session.notes" class="bg-gray-50 rounded-lg p-4 mb-4">
                <p class="text-sm text-gray-700">
                  <span class="font-semibold">Notes:</span> {{ session.notes }}
                </p>
              </div>

              <div v-if="session.attendanceInfo && session.attendanceInfo.count > 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center text-sm text-green-800">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Attendance marked for {{ session.attendanceInfo.count }} out of {{ session.attendanceInfo.total }} players</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Features (Only for Approved Clubs) -->
      <div v-if="clubData && clubData.status === 'approved'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Player Management -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/>
              <path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="7" cy="7" r="4"/>
              <circle cx="17" cy="7" r="4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Player Management</h3>
          <p class="text-gray-600 mb-4">Manage your club members, track player statistics, and organize team rosters.</p>
          <div class="flex items-center justify-between">
            <div class="text-green-600 font-semibold text-sm">
              {{ approvedApplications.length }} Active Players
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Coach Management -->
        <div @click="$router.push('/club-manager/coaches')" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/>
              <path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/>
              <circle cx="7" cy="7" r="4"/>
              <circle cx="17" cy="7" r="4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Coach Management</h3>
          <p class="text-gray-600 mb-4">Manage coaching staff, review applications, and organize training programs.</p>
          <div class="flex items-center justify-between">
            <div class="text-blue-600 font-semibold text-sm">
              Coming Soon
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- Tournament Registration -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Tournament Registration</h3>
          <p class="text-gray-600 mb-4">Register your club for upcoming tournaments and competitions across Kerala.</p>
          <div class="text-blue-600 font-semibold text-sm">Coming Soon</div>
        </div>

        <!-- Match Scheduling -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Match Scheduling</h3>
          <p class="text-gray-600 mb-4">Schedule practice matches, friendly games, and coordinate with other clubs.</p>
          <div class="text-blue-600 font-semibold text-sm">Coming Soon</div>
        </div>

        <!-- Club Statistics -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Club Statistics</h3>
          <p class="text-gray-600 mb-4">View detailed statistics, performance metrics, and club achievements.</p>
          <div class="text-blue-600 font-semibold text-sm">Coming Soon</div>
        </div>

        <!-- Ground Booking -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <circle cx="12" cy="8" r="3"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Ground Booking</h3>
          <p class="text-gray-600 mb-4">Book cricket grounds and facilities for practice sessions and matches.</p>
          <div class="text-blue-600 font-semibold text-sm">Coming Soon</div>
        </div>

        <!-- Communication Hub -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Communication Hub</h3>
          <p class="text-gray-600 mb-4">Connect with other clubs, send announcements, and manage club communications.</p>
          <div class="text-blue-600 font-semibold text-sm">Coming Soon</div>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reject Application</h3>
        <p class="text-gray-600 mb-4">
          Please provide a reason for rejecting {{ selectedApplication?.playerName }}'s application:
        </p>
        <textarea 
          v-model="rejectionReason"
          rows="4"
          placeholder="Enter rejection reason..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>
        <div class="flex gap-3">
          <button 
            @click="confirmRejectApplication"
            :disabled="!rejectionReason.trim() || processingApplication"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <span v-if="processingApplication">Processing...</span>
            <span v-else>Reject Application</span>
          </button>
          <button 
            @click="closeRejectModal"
            :disabled="processingApplication"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

const auth = useAuthStore();
const router = useRouter();
const clubData = ref(null);

// Player Applications
const playerApplications = ref([]);
const loadingApplications = ref(false);
const applicationFilter = ref('all');
const processingApplication = ref(null);

// Club Activity
const clubActivity = ref([]);
const loadingActivity = ref(false);

// Training Sessions
const trainingSessions = ref([]);
const loadingSessions = ref(false);

// Rejection Modal
const showRejectModal = ref(false);
const selectedApplication = ref(null);
const rejectionReason = ref('');

async function loadClubData() {
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/clubs/my-club`);
    // Ensure frontend has stable image URLs
    const c = response.data.club;
    if (c) {
      c.logoUrl = c.logoUrl || (c.logo?.data ? `${API}/clubs/${c._id || c.id}/logo` : '');
    }
    clubData.value = c;
  } catch (error) {
    console.error('Error loading club data:', error);
    // For demo purposes, load mock data if user email matches
    if (auth.user?.email === 'rajesh@kochicricket.com') {
      clubData.value = {
        id: 1,
        clubName: 'Kochi Cricket Club',
        district: 'Ernakulam',
        city: 'Kochi',
        foundedYear: 2015,
        managerName: 'Rajesh Kumar',
        phone: '+91 9876543210',
        email: 'rajesh@kochicricket.com',
        description: 'A passionate cricket club dedicated to promoting grassroots cricket in Kochi.',
        groundName: 'Kochi Cricket Stadium',
        memberCount: 45,
        website: 'https://kochicricket.com',
        status: 'approved',
        submittedAt: '2024-01-15T10:30:00Z'
      };
    }
  }
}

// Load club activity
async function loadClubActivity() {
  if (!clubData.value || clubData.value.status !== 'approved') return;
  
  loadingActivity.value = true;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/clubs/my-club/activity`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    clubActivity.value = response.data.activity || [];
  } catch (error) {
    console.error('Error loading club activity:', error);
    clubActivity.value = [];
  } finally {
    loadingActivity.value = false;
  }
}

// Load training sessions
async function loadTrainingSessions() {
  if (!clubData.value || clubData.value.status !== 'approved') return;
  
  loadingSessions.value = true;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/coaches/club/sessions`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    trainingSessions.value = response.data.sessions || [];
  } catch (error) {
    console.error('Error loading training sessions:', error);
    trainingSessions.value = [];
  } finally {
    loadingSessions.value = false;
  }
}

// Inline edit state
const isEditing = ref(false);
const editable = ref({});
const editLogoFile = ref(null);

function startEdit(){
  editable.value = { ...clubData.value, logoPreview: '' };
  isEditing.value = true;
}
function cancelEdit(){
  isEditing.value = false;
  editable.value = {};
}

async function onEditLogoSelected(event){
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) { alert('Logo too large. Use < 1.5MB'); return; }
  editable.value.logoPreview = URL.createObjectURL(file);
  editLogoFile.value = file;
  // Clear any previous URL; backend will serve from stable route
  editable.value.logoUrl = '';
}

async function saveEdit(){
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

    // Build multipart form for file uploads + fields
    const formData = new FormData();
    const fields = {
      clubName: editable.value.clubName,
      district: editable.value.district,
      city: editable.value.city,
      foundedYear: editable.value.foundedYear,
      phone: editable.value.phone,
      email: editable.value.email,
      description: editable.value.description,
      groundName: editable.value.groundName,
      memberCount: editable.value.memberCount,
      website: editable.value.website,
      achievements: editable.value.achievements,
    };
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') formData.append(k, String(v));
    });
    if (editLogoFile.value) formData.append('logo', editLogoFile.value);

    await axios.put(`${API}/clubs/my-club`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Club updated. It will be re-reviewed by admin.');
    isEditing.value = false;
    await loadClubData();
  } catch (e) {
    console.error('Failed to update club', e);
    alert(e.response?.data?.message || 'Failed to update club.');
  }
}

// Player Applications Functions
async function loadPlayerApplications() {
  if (!clubData.value || clubData.value.status !== 'approved') return;
  
  loadingApplications.value = true;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const response = await axios.get(`${API}/players/club/applications`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    playerApplications.value = response.data.applications || [];
  } catch (error) {
    console.error('Error loading player applications:', error);
    playerApplications.value = [];
  } finally {
    loadingApplications.value = false;
  }
}

async function approveApplication(applicationId) {
  processingApplication.value = applicationId;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    await axios.put(`${API}/players/club/applications/${applicationId}/approve`, {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    // Update local state
    const application = playerApplications.value.find(app => app._id === applicationId);
    if (application) {
      application.status = 'approved';
    }
    
    // Reload activity to show the new approval
    await loadClubActivity();
    
    alert('Application approved successfully!');
  } catch (error) {
    console.error('Error approving application:', error);
    alert(error.response?.data?.message || 'Failed to approve application');
  } finally {
    processingApplication.value = null;
  }
}

async function confirmRejectApplication() {
  if (!selectedApplication.value || !rejectionReason.value.trim()) return;
  
  processingApplication.value = selectedApplication.value._id;
  try {
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    await axios.put(`${API}/players/club/applications/${selectedApplication.value._id}/reject`, {
      rejectionReason: rejectionReason.value.trim()
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    // Update local state
    const application = playerApplications.value.find(app => app._id === selectedApplication.value._id);
    if (application) {
      application.status = 'rejected';
      application.rejectionReason = rejectionReason.value.trim();
    }
    
    // Reload activity to show the new rejection
    await loadClubActivity();
    
    closeRejectModal();
    alert('Application rejected successfully!');
  } catch (error) {
    console.error('Error rejecting application:', error);
    alert(error.response?.data?.message || 'Failed to reject application');
  } finally {
    processingApplication.value = null;
  }
}

function openRejectModal(application) {
  selectedApplication.value = application;
  rejectionReason.value = '';
  showRejectModal.value = true;
}

function closeRejectModal() {
  showRejectModal.value = false;
  selectedApplication.value = null;
  rejectionReason.value = '';
}

function viewPlayerProfile(playerId) {
  // For now, we'll show an alert. In the future, this could open a modal or navigate to a detailed view
  alert('Player profile view feature coming soon!');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return 'N/A';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  return hour > 12 ? `${hour - 12}:${minutes} PM` : `${hour}:${minutes} AM`;
}

function isUpcoming(dateString) {
  if (!dateString) return false;
  const sessionDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return sessionDate >= today;
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getActivityIcon(type) {
  const icons = {
    'registration': 'upload',
    'approval': 'check',
    'rejection': 'x',
    'player-application': 'user-plus',
    'player-approved': 'user-check',
    'player-rejected': 'user-x',
    'coach-application': 'user-plus',
    'coach-approved': 'user-check',
    'coach-rejected': 'user-x',
    'coach-resigned': 'user-x',
    'tournament': 'calendar',
    'tournament-approved': 'check',
    'tournament-rejected': 'x',
    'session': 'calendar'
  };
  return icons[type] || 'info';
}

function getActivityColor(type) {
  const colors = {
    'registration': 'blue',
    'approval': 'green',
    'rejection': 'red',
    'player-application': 'purple',
    'player-approved': 'green',
    'player-rejected': 'red',
    'coach-application': 'orange',
    'coach-approved': 'green',
    'coach-rejected': 'red',
    'coach-resigned': 'red',
    'tournament': 'indigo',
    'tournament-approved': 'green',
    'tournament-rejected': 'red',
    'session': 'cyan'
  };
  return colors[type] || 'gray';
}

// Computed Properties
const pendingApplications = computed(() => 
  playerApplications.value.filter(app => app.status === 'pending')
);

const approvedApplications = computed(() => 
  playerApplications.value.filter(app => app.status === 'approved')
);

const getApplicationsByStatus = (status) => {
  return playerApplications.value.filter(app => app.status === status);
};

const filteredApplications = computed(() => {
  if (applicationFilter.value === 'all') {
    return playerApplications.value;
  }
  return getApplicationsByStatus(applicationFilter.value);
});

const recentActivity = computed(() => {
  return clubActivity.value; // Show all activities with scrollbar
});

onMounted(async () => {
  await loadClubData();
  if (clubData.value && clubData.value.status === 'approved') {
    await Promise.all([loadPlayerApplications(), loadClubActivity(), loadTrainingSessions()]);
  }
});
</script>

<style scoped>
/* Custom scrollbar for Recent Activity */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #a5b4fc;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>