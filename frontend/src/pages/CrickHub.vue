<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-emerald-50">
    <!-- Cricket-themed header with dynamic elements -->
    <div class="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-green-700 text-white">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
        <div class="absolute top-32 right-20 w-16 h-16 border-4 border-white rotate-45"></div>
        <div class="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-white rounded-full"></div>
        <div class="absolute top-1/3 right-1/3 w-12 h-12 border-4 border-white"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div class="grid md:grid-cols-3 gap-8 items-center">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-3 py-1 bg-emerald-600/30 rounded-full text-xs font-medium">Live</span>
              <span class="text-emerald-200 text-sm">Welcome back, {{ auth.userProfile?.name || auth.user?.displayName || auth.user?.email }}</span>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">Crick<span class="text-emerald-300">Hub</span> Dashboard</h1>
            <p class="text-emerald-100 max-w-2xl mb-6">
              Your personalized cricket command center. Track matches, manage your teams, and stay connected with Kerala's cricket community.
            </p>
            
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/clubs" class="px-5 py-2.5 bg-white text-emerald-800 rounded-lg font-medium hover:bg-emerald-50 transition flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Find Clubs
              </RouterLink>
              <RouterLink to="/tournaments" class="px-5 py-2.5 bg-emerald-700/50 border border-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                View Tournaments
              </RouterLink>
            </div>
          </div>
          
          <div class="hidden md:block relative">
            <div class="bg-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/50">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-lg">Live Matches</h3>
                <span class="text-xs bg-red-500 px-2 py-1 rounded-full">LIVE</span>
              </div>
              
              <!-- Carousel Container for Live Matches -->
              <div class="relative overflow-hidden">
                <!-- Navigation Arrows for Live Matches -->
                <button 
                  @click="prevLiveMatch" 
                  class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-emerald-800/50 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-emerald-700 transition-all duration-300"
                  :disabled="currentLiveMatchIndex === 0"
                  v-if="liveMatches.length > 1"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <button 
                  @click="nextLiveMatch" 
                  class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-emerald-800/50 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-emerald-700 transition-all duration-300"
                  :disabled="currentLiveMatchIndex >= liveMatches.length - 1"
                  v-if="liveMatches.length > 1"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                
                <!-- Carousel Content for Live Matches -->
                <div class="overflow-hidden py-2">
                  <div 
                    class="flex transition-transform duration-500 ease-in-out"
                    :style="{ transform: `translateX(-${currentLiveMatchIndex * 100}%)` }"
                  >
                    <div 
                      v-for="match in liveMatches" 
                      :key="match._id"
                      class="flex-shrink-0 w-full px-1"
                    >
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
                              {{ getInitials(match?.homeClub?.clubName || match?.homeClub?.name || 'HC') }}
                            </div>
                            <span class="text-sm">{{ match?.homeClub?.clubName || match?.homeClub?.name || 'Home Team' }}</span>
                          </div>
                          <div class="text-center">
                            <div class="text-lg font-bold">{{ getCurrentScore(match, 1) }}</div>
                            <div class="text-xs text-emerald-200">{{ getCurrentOvers(match, 1) }}</div>
                          </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                              {{ getInitials(match?.awayClub?.clubName || match?.awayClub?.name || 'AC') }}
                            </div>
                            <span class="text-sm">{{ match?.awayClub?.clubName || match?.awayClub?.name || 'Away Team' }}</span>
                          </div>
                          <div class="text-center">
                            <div class="text-lg font-bold">{{ getCurrentScore(match, 2) }}</div>
                            <div class="text-xs text-emerald-200">{{ getCurrentOvers(match, 2) }}</div>
                          </div>
                        </div>
                        
                        <div class="text-xs text-emerald-200 mt-1">
                          {{ match?.tournament?.name || 'Tournament' }} • {{ match?.venue || 'Venue' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Indicators for Live Matches -->
              <div class="flex justify-center py-2 space-x-1" v-if="liveMatches.length > 1">
                <button
                  v-for="(_, index) in liveMatches.length"
                  :key="index"
                  @click="goToLiveMatch(index)"
                  class="w-1.5 h-1.5 rounded-full transition-all"
                  :class="{
                    'bg-emerald-400': currentLiveMatchIndex === index,
                    'bg-emerald-800': currentLiveMatchIndex !== index
                  }"
                />
              </div>
              
              <div v-if="liveMatches.length === 0" class="text-center py-4 text-emerald-200">
                No live matches currently
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Role-specific quick actions -->
      <div v-if="isPlayer || isCoach || isClubManager" class="mb-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-if="isPlayer" class="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6 hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Player Profile</h3>
                <p class="text-sm text-gray-600 mb-3">Manage your cricket profile and stats</p>
                <RouterLink :to="{ name: 'player-panel' }" class="text-sm text-orange-700 font-medium hover:underline">Go to Dashboard</RouterLink>
              </div>
            </div>
          </div>
          
          <div v-if="isCoach" class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6 hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Coach Dashboard</h3>
                <p class="text-sm text-gray-600 mb-3">Manage training programs and players</p>
                <RouterLink to="/coach-panel" class="text-sm text-purple-700 font-medium hover:underline">Go to Dashboard</RouterLink>
              </div>
            </div>
          </div>
          
          <div v-if="isClubManager" class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200 p-6 hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">Club Management</h3>
                <p class="text-sm text-gray-600 mb-3">Manage your club and players</p>
                <RouterLink to="/club-manager" class="text-sm text-sky-700 font-medium hover:underline">Go to Dashboard</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Favorites Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.17L12 18.896l-7.336 3.87 1.402-8.17L.132 9.21l8.2-1.192L12 .587z"/>
            </svg>
            Your Favorites
          </h2>
          <div class="text-sm text-gray-500" v-if="!favClubs.length && !favTournaments.length">
            No favorites yet. Mark tournaments and clubs as ★ Favorite to see them here.
          </div>
        </div>

        <!-- Favorite Tournaments -->
        <div v-if="favTournaments.length" class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
              Tournaments
            </h3>
            <button v-if="favTournaments.length" @click="clearFavorites('tournaments')" class="text-xs text-emerald-700 hover:underline flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear all
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div v-for="t in favTournaments" :key="t._id" class="group relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
              <div class="h-32 bg-gradient-to-br from-emerald-100 to-emerald-50 relative">
                <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
                <div v-else class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-amber-500 hover:bg-amber-100 transition" @click="toggleFavoriteTournament(t._id)">
                  ★
                </button>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 class="font-bold text-gray-900 leading-tight">{{ t.name }}</h4>
                    <div class="text-xs text-gray-500 mt-1">{{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" class="text-sm text-emerald-700 hover:underline font-medium">View Details</RouterLink>
                  <span class="text-[10px] px-2 py-1 rounded-full border" :class="statusBadgeClass(t.status)">{{ t.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorite Clubs -->
        <div v-if="favClubs.length">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Clubs
            </h3>
            <button v-if="favClubs.length" @click="clearFavorites('clubs')" class="text-xs text-emerald-700 hover:underline flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Clear all
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <div v-for="c in favClubs" :key="c._id || c.id" class="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
              <div class="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
                <img v-if="c.logoUrl" :src="c.logoUrl" class="w-20 h-20 object-cover rounded-full border-2 border-white shadow-sm" />
                <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-white flex items-center justify-center">
                  <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-amber-500 hover:bg-amber-100 transition" @click="toggleFavoriteClub(c._id || c.id)">
                  ★
                </button>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 class="font-bold text-gray-900 leading-tight">{{ c.name || c.clubName }}</h4>
                    <div class="text-xs text-gray-500">{{ c.district || c.city || 'Kerala' }}</div>
                  </div>
                </div>
                <div class="mt-3">
                  <RouterLink :to="{ name: 'club-details', params: { id: c._id || c.id } }" class="text-sm text-emerald-700 hover:underline font-medium">View Club</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Upcoming Matches Section -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Upcoming Matches
          </h2>
          <RouterLink to="/tournaments" class="text-sm text-emerald-700 hover:underline font-medium">View All</RouterLink>
        </div>
        
        <!-- Carousel Container -->
        <div class="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Navigation Arrows -->
          <button 
            @click="prevMatch" 
            class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-300"
            :disabled="currentMatchIndex === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentMatchIndex === 0 }"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <button 
            @click="nextMatch" 
            class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-300"
            :disabled="currentMatchIndex >= Math.max(0, upcomingMatches.length - matchesToShow)"
            :class="{ 'opacity-50 cursor-not-allowed': currentMatchIndex >= Math.max(0, upcomingMatches.length - matchesToShow) }"
          >
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <!-- Carousel Content -->
          <div class="overflow-hidden py-6">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentMatchIndex * (100 / matchesToShow)}%)` }"
            >
              <div 
                v-for="match in upcomingMatches" 
                :key="match._id"
                class="flex-shrink-0 px-4"
                :style="{ width: `${100 / matchesToShow}%` }"
              >
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-5 h-full hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-sm font-medium text-gray-500">
                      {{ fmtDateTime(match.date) }}
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Scheduled
                    </span>
                  </div>
                  
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-center">
                      <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                        <div class="text-xs font-bold text-emerald-700">
                          {{ getInitials(match?.homeClub?.clubName || match?.homeClub?.name || 'HT') }}
                        </div>
                      </div>
                      <div class="text-sm font-medium text-gray-900 max-w-[100px] truncate">
                        {{ match?.homeClub?.clubName || match?.homeClub?.name || 'Home Team' }}
                      </div>
                    </div>
                    
                    <div class="text-center">
                      <div class="text-lg font-bold text-gray-700">VS</div>
                      <div class="text-xs text-gray-500 mt-1">{{ match?.tournament?.name || 'Tournament' }}</div>
                    </div>
                    
                    <div class="text-center">
                      <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <div class="text-xs font-bold text-blue-700">
                          {{ getInitials(match?.awayClub?.clubName || match?.awayClub?.name || 'AT') }}
                        </div>
                      </div>
                      <div class="text-sm font-medium text-gray-900 max-w-[100px] truncate">
                        {{ match?.awayClub?.clubName || match?.awayClub?.name || 'Away Team' }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-center">
                    <div class="text-xs text-gray-500 truncate">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {{ match.venue || 'TBA' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Empty state -->
              <div v-if="upcomingMatches.length === 0" class="w-full text-center py-12">
                <div class="text-gray-500">
                  No upcoming matches at the moment. Check back later for new fixtures.
                </div>
              </div>
            </div>
          </div>
          
          <!-- Indicators -->
          <div class="flex justify-center py-4 space-x-2">
            <button
              v-for="(_, index) in Math.ceil(upcomingMatches.length / matchesToShow)"
              :key="index"
              @click="goToMatch(index * matchesToShow)"
              class="w-2 h-2 rounded-full transition-all"
              :class="{
                'bg-emerald-600': Math.floor(currentMatchIndex / matchesToShow) === index,
                'bg-gray-300': Math.floor(currentMatchIndex / matchesToShow) !== index
              }"
            />
          </div>
        </div>
      </section>
      
      <!-- Cricket News Section -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            Cricket News
          </h2>
          <RouterLink to="/" class="text-sm text-emerald-700 hover:underline font-medium">View All</RouterLink>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="n in news" :key="n.id" class="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div class="h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <svg class="w-12 h-12 text-emerald-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-lg mb-2">{{ n.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ n.summary }}</p>
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">{{ n.date }}</div>
                <RouterLink :to="n.link || '#'" class="text-sm text-emerald-700 hover:underline font-medium">Read More</RouterLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import api from '../utils/api';
import axios from 'axios';

const auth = useAuthStore();
const isClubManager = computed(() => (auth.userProfile?.role || 'public') === 'clubManager');
const isPlayer = computed(() => (auth.userProfile?.role || 'public') === 'player');
const isCoach = computed(() => (auth.userProfile?.role || 'public') === 'coach');
const playerPhotoUrl = ref('');

// Favorites state (server-backed per-account)
const favTournamentIds = ref([]);
const favClubIds = ref([]);
const favTournaments = ref([]);
const favClubs = ref([]);

// Upcoming matches
const upcomingMatches = ref([]);

// Live matches
const liveMatches = ref([]);
const currentLiveMatchIndex = ref(0);
const liveMatchInterval = ref(null);

async function loadFavoriteIds(){
  try{
    const { data } = await api.get('/users/me/favorites');
    favTournamentIds.value = (data.favoriteTournaments || []).map(String);
    favClubIds.value = (data.favoriteClubs || []).map(String);
  } catch {
    favTournamentIds.value = [];
    favClubIds.value = [];
  }
}

async function fetchFavoriteTournaments(){
  const ids = Array.from(new Set(favTournamentIds.value));
  const results = [];
  for (const id of ids){
    try {
      const { data } = await api.get(`/tournaments/${id}`);
      if (data && data._id) results.push(data);
    } catch {}
  }
  favTournaments.value = results;
}

async function fetchFavoriteClubs(){
  const ids = Array.from(new Set(favClubIds.value));
  const results = [];
  for (const id of ids){
    try {
      const { data } = await api.get(`/clubs/public/${id}`);
      if (data && (data._id || data.id)) results.push(data);
    } catch {}
  }
  favClubs.value = results;
}

async function toggleFavoriteTournament(id){
  try{
    const isFav = favTournamentIds.value.includes(String(id));
    const { data } = await api.post('/users/me/favorites', { type: 'tournament', id, action: isFav ? 'remove' : 'add' });
    favTournamentIds.value = (data.favoriteTournaments || []).map(String);
    // prune list if removed
    favTournaments.value = favTournaments.value.filter(t => favTournamentIds.value.includes(String(t._id)));
  } catch {}
}

async function toggleFavoriteClub(id){
  try{
    const isFav = favClubIds.value.includes(String(id));
    const { data } = await api.post('/users/me/favorites', { type: 'club', id, action: isFav ? 'remove' : 'add' });
    favClubIds.value = (data.favoriteClubs || []).map(String);
    favClubs.value = favClubs.value.filter(c => favClubIds.value.includes(String(c._id || c.id)));
  } catch {}
}

async function clearFavorites(type){
  try{
    if (type === 'tournaments'){
      // remove all tournaments
      for (const id of favTournamentIds.value) {
        try { await api.post('/users/me/favorites', { type: 'tournament', id, action: 'remove' }); } catch {}
      }
      favTournamentIds.value = []; favTournaments.value = [];
    } else if (type === 'clubs'){
      for (const id of favClubIds.value) {
        try { await api.post('/users/me/favorites', { type: 'club', id, action: 'remove' }); } catch {}
      }
      favClubIds.value = []; favClubs.value = [];
    }
  } catch {}
}

function fmtDate(d){ 
  if(!d) return ''; 
  return new Date(d).toLocaleDateString(); 
}

function fmtDateTime(d) {
  if (!d) return '';
  const date = new Date(d);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function statusBadgeClass(s){
  return s === 'completed' || s === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
         s === 'ongoing' || s === 'Live' ? 'bg-amber-100 text-amber-800 border-amber-200' :
         s === 'cancelled' || s === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-200' :
         'bg-gray-100 text-gray-800 border-gray-200';
}

// Static placeholder news
const news = ref([
  { id: 1, title: 'Kochi Tuskers defeat Thrissur Warriors in thriller', date: 'Today', summary: 'A nail-biting final over at the Kochi Cricket Ground saw the Tuskers clinch victory with a last-ball boundary.', link: '#' },
  { id: 2, title: 'Young Kozhikode batsman scores maiden century', date: 'Yesterday', summary: 'The 19-year-old opener from Kozhikode showcased maturity beyond his years, crafting a classy ton in the district championship.', link: '#' },
  { id: 3, title: 'Kannur Spinners dominate Palakkad in night match', date: '2 days ago', summary: 'Local spinners ruled the roost under lights as Kannur secured a convincing victory in the inter-district tournament.', link: '#' },
]);

// Fetch upcoming matches
async function fetchUpcomingMatches() {
  try {
    const { data } = await api.get('/tournaments/matches/upcoming', { params: { limit: 5 } });
    upcomingMatches.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch upcoming matches:', error);
    upcomingMatches.value = [];
  }
}

// Fetch live matches
async function fetchLiveMatches() {
  try {
    const { data } = await api.get('/tournaments/matches/live');
    liveMatches.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch live matches:', error);
    liveMatches.value = [];
  }
}

// Helper functions for match data
function getInitials(name) {
  if (!name) return '??';
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getCurrentScore(match, inningsNumber) {
  if (!match || !match.innings || match.innings.length < inningsNumber) {
    return '0/0';
  }
  const innings = match.innings[inningsNumber - 1];
  return `${innings.runs || 0}/${innings.wickets || 0}`;
}

function getCurrentOvers(match, inningsNumber) {
  if (!match || !match.innings || match.innings.length < inningsNumber) {
    return '0.0 overs';
  }
  const innings = match.innings[inningsNumber - 1];
  if (!innings.balls) return '0.0 overs';
  const overs = Math.floor(innings.balls / 6);
  const balls = innings.balls % 6;
  return `${overs}.${balls} overs`;
}

// Carousel state
const currentMatchIndex = ref(0);
const matchesToShow = ref(3); // Default to 3 matches, will be updated based on screen size
const carouselInterval = ref(null);

// Update matches to show based on screen size
function updateMatchesToShow() {
  if (window.innerWidth < 768) {
    matchesToShow.value = 1; // Mobile: show 1 match
  } else if (window.innerWidth < 1024) {
    matchesToShow.value = 2; // Tablet: show 2 matches
  } else {
    matchesToShow.value = 3; // Desktop: show 3 matches
  }
  console.log('Screen size updated, matches to show:', matchesToShow.value);
}

// Carousel navigation functions
function nextMatch() {
  console.log('Next match clicked');
  console.log('Current index:', currentMatchIndex.value);
  console.log('Upcoming matches length:', upcomingMatches.value.length);
  console.log('Matches to show:', matchesToShow.value);
  
  // Calculate how many "pages" of matches we have
  const totalPages = Math.ceil(upcomingMatches.value.length / matchesToShow.value);
  const currentPage = Math.floor(currentMatchIndex.value / matchesToShow.value);
  
  console.log('Total pages:', totalPages);
  console.log('Current page:', currentPage);
  
  // If we're not on the last page, go to the next page
  if (currentPage < totalPages - 1) {
    currentMatchIndex.value = (currentPage + 1) * matchesToShow.value;
    console.log('New index after next:', currentMatchIndex.value);
  }
}

function prevMatch() {
  console.log('Prev match clicked');
  console.log('Current index:', currentMatchIndex.value);
  console.log('Matches to show:', matchesToShow.value);
  
  // Calculate current page
  const currentPage = Math.floor(currentMatchIndex.value / matchesToShow.value);
  
  console.log('Current page:', currentPage);
  
  // If we're not on the first page, go to the previous page
  if (currentPage > 0) {
    currentMatchIndex.value = (currentPage - 1) * matchesToShow.value;
    console.log('New index after prev:', currentMatchIndex.value);
  }
}

function goToMatch(index) {
  console.log('Go to match index:', index);
  currentMatchIndex.value = index;
}

// Auto-scroll carousel
function startCarousel() {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
  }
  
  carouselInterval.value = setInterval(() => {
    console.log('Auto-scroll triggered');
    console.log('Upcoming matches length:', upcomingMatches.value.length);
    console.log('Matches to show:', matchesToShow.value);
    console.log('Current index:', currentMatchIndex.value);
    
    if (upcomingMatches.value.length > matchesToShow.value) {
      // Calculate how many "pages" of matches we have
      const totalPages = Math.ceil(upcomingMatches.value.length / matchesToShow.value);
      const currentPage = Math.floor(currentMatchIndex.value / matchesToShow.value);
      
      console.log('Total pages:', totalPages);
      console.log('Current page:', currentPage);
      
      // Go to the next page, or reset to beginning if we're on the last page
      if (currentPage >= totalPages - 1) {
        currentMatchIndex.value = 0; // Reset to beginning
        console.log('Reset to beginning');
      } else {
        nextMatch();
      }
    } else {
      console.log('Not enough matches to scroll');
    }
  }, 10000); // 10 seconds
}

// Stop carousel when component is unmounted
onUnmounted(() => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
  }
  if (liveMatchInterval.value) {
    clearInterval(liveMatchInterval.value);
  }
});

// Handle window resize
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateMatchesToShow();
    // Reset carousel position when screen size changes
    currentMatchIndex.value = 0;
  }, 100);
}

onMounted(async () => {
  updateMatchesToShow();
  window.addEventListener('resize', handleResize);
  
  await loadFavoriteIds();
  await Promise.all([fetchFavoriteTournaments(), fetchFavoriteClubs(), fetchUpcomingMatches(), fetchLiveMatches()]);
  
  // Debugging
  console.log('Upcoming matches:', upcomingMatches.value);
  console.log('Matches to show:', matchesToShow.value);
  console.log('Current index:', currentMatchIndex.value);
  
  // Start carousels after data is loaded
  startCarousel();
  startLiveMatchCarousel();
  
  // Try to load player photo
  if (isPlayer.value) {
    try {
      const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
      // Add cache-busting parameter to prevent browser caching issues
      const cacheBuster = Date.now();
      const resp = await axios.get(`${API}/players/photo?t=${cacheBuster}`, { 
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      // Clean up previous blob URL if it exists
      if (playerPhotoUrl.value) {
        URL.revokeObjectURL(playerPhotoUrl.value);
      }
      const blobUrl = URL.createObjectURL(resp.data);
      playerPhotoUrl.value = blobUrl;
    } catch {}
  }
});

// Add debugging for carousel navigation
watch(currentMatchIndex, (newIndex) => {
  console.log('Current match index changed to:', newIndex);
});

watch(matchesToShow, (newMatchesToShow) => {
  console.log('Matches to show changed to:', newMatchesToShow);
});

watch(upcomingMatches, (newMatches) => {
  console.log('Upcoming matches updated:', newMatches);
  // Reset carousel position when matches change
  currentMatchIndex.value = 0;
});

// Carousel navigation functions for live matches
function nextLiveMatch() {
  if (currentLiveMatchIndex.value < liveMatches.value.length - 1) {
    currentLiveMatchIndex.value++;
  }
}

function prevLiveMatch() {
  if (currentLiveMatchIndex.value > 0) {
    currentLiveMatchIndex.value--;
  }
}

function goToLiveMatch(index) {
  currentLiveMatchIndex.value = index;
}

// Auto-scroll live matches carousel
function startLiveMatchCarousel() {
  if (liveMatchInterval.value) {
    clearInterval(liveMatchInterval.value);
  }
  
  liveMatchInterval.value = setInterval(() => {
    if (liveMatches.value.length > 1) {
      if (currentLiveMatchIndex.value >= liveMatches.value.length - 1) {
        currentLiveMatchIndex.value = 0; // Reset to beginning
      } else {
        nextLiveMatch();
      }
    }
  }, 10000); // 10 seconds
}

</script>
