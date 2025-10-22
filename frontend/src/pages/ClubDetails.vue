<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <button @click="$router.back()" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back to Clubs
    </button>
      </div>
    </div>

    <div v-if="loading" class="py-24 text-center text-gray-500">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
      <p class="text-lg">Loading club details...</p>
    </div>
    
    <div v-else-if="!club" class="py-24 text-center text-gray-500">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-lg font-medium">Club not found</p>
      <p class="text-sm text-gray-400 mt-1">The club you're looking for doesn't exist or has been removed</p>
    </div>
    
    <div v-else>
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
        
        <div class="relative max-w-7xl mx-auto px-4 py-16">
          <div class="flex flex-col lg:flex-row items-start gap-8">
            <!-- Club Logo and Basic Info -->
            <div class="flex items-center gap-6">
              <div class="relative">
                <img 
                  v-if="club.logoUrl" 
                  :src="resolvedLogoUrl" 
                  alt="Club Logo" 
                  class="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl" 
                  @error="e => (e.target.style.display='none')" 
                />
                <div 
                  v-else 
                  class="w-32 h-32 rounded-3xl bg-white bg-opacity-20 backdrop-blur-sm border-4 border-white shadow-2xl flex items-center justify-center text-white text-4xl font-bold"
                >
                  {{ (club.name || club.clubName)?.charAt(0)?.toUpperCase() || 'C' }}
                </div>
                <!-- Status Badge -->
                <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>
              
              <div class="text-white">
                <h1 class="text-4xl lg:text-5xl font-black mb-2">{{ club.name || club.clubName }}</h1>
                <div class="flex items-center gap-2 text-xl text-green-100 mb-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                  <span>{{ club.city || club.district }}</span>
                </div>
                
                <!-- Quick Stats -->
                <div class="flex flex-wrap gap-4">
                  <div class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30">
                    <div class="text-2xl font-bold">{{ club.memberCount || 0 }}</div>
                    <div class="text-sm text-green-100">Active Players</div>
                  </div>
                  <div v-if="club.foundedYear" class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30">
                    <div class="text-2xl font-bold">{{ club.foundedYear }}</div>
                    <div class="text-sm text-green-100">Founded</div>
                  </div>
                  <div v-if="club.groundName" class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30">
                    <div class="text-sm font-medium">Home Ground</div>
                    <div class="text-sm text-green-100 truncate max-w-32">{{ club.groundName }}</div>
                  </div>
                </div>
              </div>
          </div>
            
            <!-- Action Buttons -->
            <div class="lg:ml-auto flex flex-col gap-3">
              <button @click="toggleFavoriteClub()" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white hover:bg-opacity-30 transition-all duration-200">
                <span class="text-yellow-300 text-xl">{{ isFav ? '★' : '☆' }}</span>
                <span class="font-medium">{{ isFav ? 'Favorited' : 'Add to Favorites' }}</span>
            </button>
              
              <!-- Apply to Club Button -->
              <button 
                v-if="isPlayer && auth.user" 
                @click="handleApplyClick()" 
                :disabled="isApplying || !canApply"
                :class="[
                  'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg',
                  canApply 
                    ? 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-xl' 
                    : playerStatus?.hasClub 
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-yellow-600 text-white cursor-not-allowed',
                  'disabled:opacity-75'
                ]"
              >
                <svg v-if="isApplying" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                </svg>
                <svg v-else-if="canApply" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" stroke-linecap="round"/>
              </svg>
                <svg v-else-if="playerStatus?.hasClub" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
                <span>{{ getButtonText() }}</span>
            </button>
            
            <!-- Apply to Coach Club Button -->
            <button 
              v-if="isCoach && auth.user" 
              @click="handleCoachApplyClick()" 
              :disabled="isCoachApplying || !canCoachApply"
              :class="[
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg',
                canCoachApply 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl' 
                  : coachStatus?.hasClub 
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-yellow-600 text-white cursor-not-allowed',
                'disabled:opacity-75'
              ]"
            >
              <svg v-if="isCoachApplying" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
              <svg v-else-if="canCoachApply" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" stroke-linecap="round"/>
              </svg>
              <svg v-else-if="coachStatus?.hasClub" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ getCoachButtonText() }}</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content Area -->
          <div class="lg:col-span-2 space-y-8">
            <!-- About Section -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">About the Club</h2>
              </div>
              <div class="prose prose-gray max-w-none">
                <p class="text-gray-700 leading-relaxed text-lg">
                  {{ club.description || 'This cricket club is dedicated to promoting the sport and nurturing talent at all levels. We welcome players of all skill levels and provide a supportive environment for growth and development.' }}
                </p>
              </div>
            </div>

            <!-- Achievements Section -->
            <div v-if="club.achievements" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Achievements & Honors</h2>
              </div>
              <div class="prose prose-gray max-w-none">
                <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ club.achievements }}</p>
              </div>
            </div>
            
            <!-- Club Players Section -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900">Squad Members</h2>
                </div>
                <div v-if="clubPlayers.length > 0" class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {{ clubPlayers.length }} Active Players
                  </span>
                </div>
              </div>
              
              <div v-if="loadingPlayers" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p class="text-gray-500 text-lg">Loading squad members...</p>
              </div>
              
              <div v-else-if="clubPlayers.length === 0" class="text-center py-16 bg-gray-50 rounded-2xl">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No Active Players</h3>
                <p class="text-gray-500 max-w-md mx-auto">This club is currently building its squad. Be the first to join and help establish a strong team!</p>
              </div>
              
              <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="player in clubPlayers" :key="player.id" 
                     class="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:shadow-lg">
                  <div class="text-center">
                    <div class="relative inline-block mb-4">
                      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {{ player.fullName?.charAt(0)?.toUpperCase() || 'P' }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                    </div>
                    
                    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ player.fullName }}</h3>
                    <div class="flex items-center justify-center gap-2 mb-4">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {{ player.preferredPosition || 'All-rounder' }}
                      </span>
                      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Age {{ player.age }}
                      </span>
                    </div>

                    <!-- Player Stats -->
                    <div class="grid grid-cols-3 gap-2 mb-4">
                      <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                        <div class="text-lg font-bold text-blue-600">{{ player.statistics.matchesPlayed }}</div>
                        <div class="text-xs text-gray-500 font-medium">Matches</div>
                      </div>
                      <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                        <div class="text-lg font-bold text-green-600">{{ player.statistics.runsScored }}</div>
                        <div class="text-xs text-gray-500 font-medium">Runs</div>
                      </div>
                      <div class="text-center p-3 bg-white rounded-xl shadow-sm">
                        <div class="text-lg font-bold text-orange-600">{{ player.statistics.wicketsTaken }}</div>
                        <div class="text-xs text-gray-500 font-medium">Wickets</div>
          </div>
        </div>

                    <!-- Player Details -->
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                        <span class="text-gray-600">Experience</span>
                        <span class="font-semibold text-gray-900">{{ player.playingExperience || 'N/A' }}</span>
                      </div>
                      <div class="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                        <span class="text-gray-600">Joined</span>
                        <span class="font-semibold text-gray-900">{{ formatDate(player.joinedAt) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Club Coaches Section - Enhanced Details -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Coaching Team</h2>
              </div>
              <div v-if="clubCoaches.length > 0" class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                  {{ clubCoaches.length }} Coaches
                </span>
              </div>
            </div>
            
            <div v-if="loadingCoaches" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mb-4"></div>
              <p class="text-gray-500">Loading coaching team...</p>
            </div>
            
            <div v-else-if="clubCoaches.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-1">No coaches available</h3>
              <p class="text-gray-500 text-sm">This club is currently building its coaching team.</p>
            </div>
            
            <div v-else class="space-y-6">
              <div v-for="coach in clubCoaches" :key="coach.id" 
                   class="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <!-- Coach Header -->
                <div class="flex items-center gap-4 p-4 bg-gray-50">
                  <div class="relative flex-shrink-0">
                    <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                      {{ coach.fullName?.charAt(0)?.toUpperCase() || 'C' }}
                    </div>
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-lg truncate">{{ coach.fullName }}</h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1">
                      <span class="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                        {{ formatExperience(coach.coachingExperience) }}
                      </span>
                      <span class="text-sm text-gray-600">Age {{ coach.age }}</span>
                    </div>
                  </div>
                  
                  <button class="text-orange-600 hover:text-orange-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                    View Profile
                  </button>
                </div>
                
                <!-- Coach Details -->
                <div class="p-4">
                  <!-- Specializations -->
                  <div v-if="coach.specializations && coach.specializations.length > 0" class="mb-3">
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Specializations</div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="spec in coach.specializations" :key="spec" 
                            class="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                        {{ formatSpecialization(spec) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Coaching History Preview -->
                  <div v-if="coach.coachingHistory && coach.coachingHistory.length > 0" class="mb-3">
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Experience</div>
                    <div class="text-sm">
                      <div class="font-medium text-gray-900">{{ coach.coachingHistory[0].teamName }}</div>
                      <div class="text-gray-600">{{ coach.coachingHistory[0].position }} ({{ coach.coachingHistory[0].yearsCoached }})</div>
                      <div v-if="coach.coachingHistory[0].playersCoached" class="text-gray-500 text-xs mt-1">
                        Coached {{ coach.coachingHistory[0].playersCoached }} players
                      </div>
                    </div>
                  </div>
                  
                  <!-- Additional Stats -->
                  <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div class="flex items-center gap-4">
                      <span>{{ coach.coachingHistory?.length || 0 }} teams coached</span>
                      <span>{{ formatDate(coach.joinedAt) }}</span>
                    </div>
                    <div v-if="coach.coachingHistory && coach.coachingHistory.length > 1" class="text-orange-600">
                      +{{ coach.coachingHistory.length - 1 }} more roles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Information -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Contact Information</h3>
            </div>
            
            <div class="space-y-4">
              <div v-if="club.email" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Email</div>
                  <a :href="`mailto:${club.email}`" class="text-green-600 hover:text-green-700 font-medium">{{ club.email }}</a>
                </div>
              </div>
              
              <div v-if="club.phone" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Phone</div>
                  <a :href="`tel:${club.phone}`" class="text-green-600 hover:text-green-700 font-medium">{{ club.phone }}</a>
                </div>
              </div>
              
              <div v-if="club.website" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Website</div>
                  <a :href="club.website" target="_blank" class="text-green-600 hover:text-green-700 font-medium break-all">{{ club.website }}</a>
                </div>
              </div>
              
              <div v-if="!club.email && !club.phone && !club.website" class="text-center py-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-500">Contact information not available</p>
              </div>
            </div>
          </div>

          <!-- Club Statistics -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Club Statistics</h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <span class="text-gray-600 font-medium">Active Players</span>
                <span class="text-2xl font-bold text-green-600">{{ club.memberCount || 0 }}</span>
              </div>
              
              <div v-if="club.foundedYear" class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <span class="text-gray-600 font-medium">Years Active</span>
                <span class="text-2xl font-bold text-blue-600">{{ new Date().getFullYear() - club.foundedYear }}</span>
              </div>
              
              <div v-if="club.groundName" class="py-3 px-4 bg-gray-50 rounded-xl">
                <div class="text-gray-600 font-medium mb-1">Home Ground</div>
                <div class="text-gray-900 font-semibold">{{ club.groundName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../utils/api.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
// Prefill from navigation state if available to avoid flash/404 when coming from list
const initialStateClub = history.state?.club || null;
const club = ref(initialStateClub);
let cancelled = false;

// Player functionality
const isPlayer = computed(() => (auth.userProfile?.role || 'public') === 'player');
const isCoach = computed(() => (auth.userProfile?.role || 'public') === 'coach');
const isApplying = ref(false);
const isCoachApplying = ref(false);
const playerStatus = ref(null);
const coachStatus = ref(null);
const clubPlayers = ref([]);
const loadingPlayers = ref(false);

// Coach functionality
const clubCoaches = ref([]);
const loadingCoaches = ref(false);

const resolvedLogoUrl = computed(() => {
  if (!club.value) return '';
  const id = club.value.id || club.value._id;
  const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
  return club.value.logoUrl || (id ? `${API}/clubs/${id}/logo` : '');
});

// Computed properties for button logic
const canApply = computed(() => {
  return playerStatus.value?.canApply === true;
});

const canCoachApply = computed(() => {
  return coachStatus.value?.canApply === true;
});

const getButtonText = () => {
  if (isApplying.value) return 'Applying...';
  if (playerStatus.value?.hasClub) return `Member of ${playerStatus.value.currentClub?.name}`;
  if (playerStatus.value?.hasPendingApplication) return 'Application Pending';
  if (canApply.value) return 'Apply to Club';
  return 'Cannot Apply';
};

const getCoachButtonText = () => {
  if (isCoachApplying.value) return 'Applying...';
  if (coachStatus.value?.hasClub) return `Coaching at ${coachStatus.value.currentClub?.name}`;
  if (coachStatus.value?.hasPendingApplication) return 'Application Pending';
  if (canCoachApply.value) return 'Apply to Coach Club';
  return 'Cannot Apply';
};

// Favorites (server-backed per-account)
const isFav = ref(false);
async function syncFavFromServer(){
  try{
    const { data } = await api.get('/users/me/favorites');
    const list = (data.favoriteClubs || []).map(String);
    const id = String(route.params.id);
    isFav.value = list.includes(id);
  }catch{}
}
async function toggleFavoriteClub(){
  try{
    const id = String(route.params.id);
    const { data } = await api.get('/users/me/favorites');
    const current = (data.favoriteClubs || []).map(String);
    const action = current.includes(id) ? 'remove' : 'add';
    await api.post('/users/me/favorites', { type: 'club', id, action });
    isFav.value = action === 'add';
  }catch{}
}

// Load player status to determine button state
async function loadPlayerStatus() {
  if (!auth.user || !isPlayer.value) {
    playerStatus.value = { canApply: false, message: 'Please log in as a player' };
    return;
  }

  try {
    const { data } = await api.get('/players/club-status');
    playerStatus.value = data;
  } catch (error) {
    console.error('Error loading player status:', error);
    playerStatus.value = { canApply: false, message: 'Unable to check player status' };
  }
}

// Load coach status to determine button state
async function loadCoachStatus() {
  if (!auth.user || !isCoach.value) {
    coachStatus.value = { canApply: false, message: 'Please log in as a coach' };
    return;
  }

  try {
    const { data } = await api.get('/coaches/club-status');
    coachStatus.value = data;
  } catch (error) {
    console.error('Error loading coach status:', error);
    coachStatus.value = { canApply: false, message: 'Unable to check coach status' };
  }
}

// Load club players
async function loadClubPlayers() {
  if (!club.value) return;
  
  loadingPlayers.value = true;
  try {
    const clubId = club.value.id || club.value._id;
    console.log(`🏏 Loading players for club: ${club.value.name || club.value.clubName} (ID: ${clubId})`);
    const { data } = await api.get(`/clubs/public/${clubId}/players`);
    console.log(`✅ Loaded ${data.players?.length || 0} players:`, data.players);
    clubPlayers.value = data.players || [];
  } catch (error) {
    console.error('❌ Error loading club players:', error);
    console.error('Error details:', error.response?.data || error.message);
    clubPlayers.value = [];
  } finally {
    loadingPlayers.value = false;
  }
}

// Load club coaches
async function loadClubCoaches() {
  if (!club.value) return;
  
  loadingCoaches.value = true;
  try {
    const clubId = club.value.id || club.value._id;
    console.log(`🏏 Loading coaches for club: ${club.value.name || club.value.clubName} (ID: ${clubId})`);
    const { data } = await api.get(`/clubs/public/${clubId}/coaches`);
    console.log(`✅ Loaded ${data.coaches?.length || 0} coaches:`, data.coaches);
    clubCoaches.value = data.coaches || [];
  } catch (error) {
    console.error('❌ Error loading club coaches:', error);
    console.error('Error details:', error.response?.data || error.message);
    clubCoaches.value = [];
  } finally {
    loadingCoaches.value = false;
  }
}

// Handle apply button click
function handleApplyClick() {
  if (!canApply.value) {
    if (playerStatus.value?.hasClub) {
      alert(`You are already a member of ${playerStatus.value.currentClub?.name}. You cannot join multiple clubs.`);
    } else if (playerStatus.value?.hasPendingApplication) {
      alert('You have a pending application. Please wait for the club manager to review it before applying to other clubs.');
    } else {
      alert(playerStatus.value?.message || 'You cannot apply to this club at this time.');
    }
    return;
  }
  
  applyToClub();
}

async function applyToClub() {
  if (!auth.user || !isPlayer.value) {
    alert('Please log in as a player to apply to clubs.');
    return;
  }

  // Check if player has completed their profile
  try {
    const { data: playerProfile } = await api.get('/players/profile');
    if (!playerProfile?.player || !playerProfile.player.profileCompleted) {
      alert('Please complete your player profile before applying to clubs.');
      router.push({ name: 'player-registration' });
      return;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      alert('Please complete your player profile before applying to clubs.');
      router.push({ name: 'player-registration' });
      return;
    }
    console.error('Error checking player profile:', error);
    alert('Unable to verify player profile. Please try again.');
    return;
  }

  const message = prompt('Please enter a message with your application (optional):');
  if (message === null) return; // User cancelled

  isApplying.value = true;
  try {
    const clubId = club.value.id || club.value._id;
    await api.post(`/players/apply-to-club/${clubId}`, {
      message: message.trim() || 'I would like to join your club.'
    });
    
    alert('Application submitted successfully! The club manager will review your application.');
    // Refresh player status after successful application
    await loadPlayerStatus();
  } catch (error) {
    console.error('Error applying to club:', error);
    const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
    alert(errorMessage);
  } finally {
    isApplying.value = false;
  }
}

// Handle coach apply button click
function handleCoachApplyClick() {
  if (!canCoachApply.value) {
    if (coachStatus.value?.hasClub) {
      alert(`You are already coaching at ${coachStatus.value.currentClub?.name}. You cannot apply to multiple clubs.`);
    } else if (coachStatus.value?.hasPendingApplication) {
      alert('You have a pending application. Please wait for the club manager to review it before applying to other clubs.');
    } else {
      alert(coachStatus.value?.message || 'You cannot apply to this club at this time.');
    }
    return;
  }
  
  applyToCoachClub();
}

async function applyToCoachClub() {
  if (!auth.user || !isCoach.value) {
    alert('Please log in as a coach to apply to clubs.');
    return;
  }

  // Check if coach has completed their profile
  try {
    const { data: coachProfile } = await api.get('/coaches/profile');
    if (!coachProfile?.coach || !coachProfile.coach.profileCompleted) {
      alert('Please complete your coach profile before applying to clubs.');
      router.push({ name: 'coach-registration' });
      return;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      alert('Please complete your coach profile before applying to clubs.');
      router.push({ name: 'coach-registration' });
      return;
    }
    console.error('Error checking coach profile:', error);
    alert('Unable to verify coach profile. Please try again.');
    return;
  }

  const message = prompt('Please enter a message with your coaching application (optional):');
  if (message === null) return; // User cancelled

  isCoachApplying.value = true;
  try {
    const clubId = club.value.id || club.value._id;
    await api.post(`/coaches/apply-to-club/${clubId}`, {
      message: message.trim() || 'I would like to coach for your club.'
    });
    
    alert('Coaching application submitted successfully! The club manager will review your application.');
    // Refresh coach status after successful application
    await loadCoachStatus();
  } catch (error) {
    console.error('Error applying to coach club:', error);
    const errorMessage = error.response?.data?.message || 'Failed to submit coaching application. Please try again.';
    alert(errorMessage);
  } finally {
    isCoachApplying.value = false;
  }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format experience helper
function formatExperience(experience) {
  if (!experience) return 'N/A';
  return experience;
}

// Format specialization helper
function formatSpecialization(spec) {
  if (!spec) return '';
  return spec.charAt(0).toUpperCase() + spec.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

onMounted(async () => {
  cancelled = false;
  await syncFavFromServer();
  
  // Load player status if user is a player
  if (auth.user && isPlayer.value) {
    await loadPlayerStatus();
  }
  
  // Load coach status if user is a coach
  if (auth.user && isCoach.value) {
    await loadCoachStatus();
  }
  
  // If we already have club from list, render immediately and then refresh in background
  if (club.value) {
    loading.value = false;
    // Load club players and coaches immediately if we have club data
    loadClubPlayers();
    loadClubCoaches();
  } else {
    loading.value = true;
  }

  try {
    const { data } = await api
      .get(`/clubs/public/${route.params.id}`)
      .catch(() => ({ data: null }));
    if (!cancelled && data) {
      club.value = data;
      // Load club players and coaches after getting club data
      loadClubPlayers();
      loadClubCoaches();
    } else if (!cancelled) {
      // Fallback: fetch list and find the club client-side
      const listResp = await api.get('/clubs/public').catch(() => ({ data: [] }));
      const arr = Array.isArray(listResp.data) ? listResp.data : [];
      const found = arr.find(c => (c.id || c._id) == route.params.id);
      if (found) {
        club.value = found;
        loadClubPlayers();
        loadClubCoaches();
      }
    }
  } catch (e) {
    if (!cancelled) {
      console.error('Failed to load club', e);
      // Keep existing club if we had one from state; otherwise null
      club.value = club.value || null;
    }
  } finally {
    if (!cancelled) loading.value = false;
  }
});

watch(() => route.params.id, syncFavFromServer);

onUnmounted(() => { cancelled = true; });
</script>