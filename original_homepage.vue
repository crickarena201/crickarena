<template>
  <div class="relative min-h-screen">
    <!-- Animated background -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-3xl opacity-30 animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full blur-2xl opacity-20 animate-bounce" style="animation-duration: 3s"></div>
    </div>

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 py-20">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Kerala's Premier Cricket Platform
              </div>
              <h1 class="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                <span class="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Crick</span><span class="text-gray-900">Arena</span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Empowering Kerala's grassroots cricket community. Discover local tournaments, join neighborhood clubs, and connect with cricket lovers across God's Own Country.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4">
              <template v-if="auth.user">
                <RouterLink to="/dashboard" class="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <span class="relative z-10">Go to Dashboard</span>
                  <div class="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </RouterLink>
                <button @click="onLogout" class="px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-bold text-lg hover:bg-green-600 hover:text-white transition-all duration-300">
                  Logout
                </button>
              </template>
              <template v-else>
                <RouterLink to="/register" class="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <span class="relative z-10">Get Started Free</span>
                  <div class="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </RouterLink>
                <RouterLink to="/login" class="px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-bold text-lg hover:bg-green-600 hover:text-white transition-all duration-300">
                  Sign In
                </RouterLink>
              </template>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 pt-8">
              <div class="text-center group cursor-pointer">
                <div class="text-3xl font-black text-green-600 group-hover:scale-110 transition-transform duration-300">{{ clubs.length }}</div>
                <div class="text-sm text-gray-500 font-medium">Kerala Clubs</div>
              </div>
              <div class="text-center group cursor-pointer">
                <div class="text-3xl font-black text-emerald-600 group-hover:scale-110 transition-transform duration-300">{{ upcoming.length }}</div>
                <div class="text-sm text-gray-500 font-medium">Active Tournaments</div>
              </div>
              <div class="text-center group cursor-pointer">
                <div class="text-3xl font-black text-green-600 group-hover:scale-110 transition-transform duration-300">{{ history.length }}</div>
                <div class="text-sm text-gray-500 font-medium">Completed Matches</div>
              </div>
            </div>
          </div>

          <!-- Right Content - Interactive Cricket Scene -->
          <div class="relative">
            <div class="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 shadow-2xl">
              <!-- Cricket Field Background -->
              <div class="absolute inset-0 opacity-20">
                <svg viewBox="0 0 400 300" class="w-full h-full">
                  <!-- Cricket pitch -->
                  <rect x="180" y="100" width="40" height="100" fill="white" opacity="0.8"/>
                  <!-- Wickets -->
                  <rect x="185" y="95" width="2" height="10" fill="white"/>
                  <rect x="190" y="95" width="2" height="10" fill="white"/>
                  <rect x="195" y="95" width="2" height="10" fill="white"/>
                  <rect x="185" y="205" width="2" height="10" fill="white"/>
                  <rect x="190" y="205" width="2" height="10" fill="white"/>
                  <rect x="195" y="205" width="2" height="10" fill="white"/>
                  <!-- Boundary circle -->
                  <circle cx="200" cy="150" r="120" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>
                </svg>
              </div>

              <!-- Floating Cricket Elements -->
              <div class="absolute top-8 left-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce" style="animation-duration: 2s">
                <div class="w-10 h-10 bg-red-500 rounded-full relative">
                  <div class="absolute top-1 left-1 right-1 bottom-1 border-2 border-white rounded-full"></div>
                </div>
              </div>

              <div class="absolute top-16 right-12 w-12 h-20 bg-amber-100 rounded-lg shadow-lg flex items-center justify-center animate-pulse">
                <div class="w-2 h-16 bg-amber-600 rounded-full"></div>
              </div>

              <div class="absolute bottom-12 left-16 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center animate-spin" style="animation-duration: 4s">
                <svg class="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>

              <!-- Featured Tournament Card -->
              <div v-if="upcoming.length" class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer" @click="showTournamentDetails = !showTournamentDetails">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                      <span class="text-sm font-semibold text-green-600">Featured Tournament</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">{{ activeTournament.name || 'Cricket Championship' }}</h3>
                    <p class="text-sm text-gray-600">{{ activeTournament.location || 'Multiple Venues' }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl">🏏</div>
                    <div class="text-xs text-gray-500 mt-1">Click to explore</div>
                  </div>
                </div>
              </div>
              <div v-else class="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div class="text-center">
                  <div class="text-2xl mb-2">🏏</div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">Kerala Cricket Hub</h3>
                  <p class="text-sm text-gray-600">Your gateway to local cricket tournaments and clubs</p>
                </div>
              </div>
            </div>

            <!-- Floating Action Cards -->
            <div class="absolute -right-4 top-20 bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div class="text-2xl mb-2">📊</div>
              <div class="text-sm font-semibold text-gray-900">Live Scores</div>
              <div class="text-xs text-gray-500">Real-time updates</div>
            </div>

            <div class="absolute -left-4 bottom-32 bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div class="text-2xl mb-2">🏏</div>
              <div class="text-sm font-semibold text-gray-900">Join Club</div>
              <div class="text-xs text-gray-500">Find nearby clubs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Kerala's Grassroots Cricket Hub</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">From Thiruvananthapuram to Kasaragod, connecting cricket enthusiasts across Kerala's villages, towns, and cities.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature Cards -->
          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Local Tournaments</h3>
              <p class="text-gray-600 text-sm leading-relaxed">Join district-level tournaments and village championships across Kerala.</p>
              <div class="mt-4 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                <span>Find tournaments</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Club Management</h3>
              <p class="text-gray-600 text-sm leading-relaxed">Register your club, manage players, and organize practice sessions.</p>
              <div class="mt-4 flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                <span>Manage club</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M15 10l4.5-4.5L21 7l-6 6-4.5-4.5L9 10l6 6 6-6z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Live Scoring</h3>
              <p class="text-gray-600 text-sm leading-relaxed">Real-time match updates from grounds across Kerala districts.</p>
              <div class="mt-4 flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                <span>Follow live</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div class="relative z-10">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Player Network</h3>
              <p class="text-gray-600 text-sm leading-relaxed">Connect with players, track statistics, and build your cricket profile.</p>
              <div class="mt-4 flex items-center text-orange-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                <span>Join network</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kerala Districts Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Cricket Across Kerala</h2>
          <p class="text-xl text-gray-600">Active cricket clubs and tournaments in all 14 districts of God's Own Country</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div v-for="district in keralaDistricts" :key="district" 
               class="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-center">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span class="text-white font-bold text-sm">{{ district.charAt(0) }}</span>
            </div>
            <h3 class="font-semibold text-gray-900 text-sm">{{ district }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Accepted Clubs Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-4xl font-black text-gray-900"> Clubs</h2>
          <span class="text-sm text-gray-500" v-if="clubs.length">{{ clubs.length }} clubs</span>
        </div>

        <div v-if="loading" class="text-center text-gray-500">Loading clubs...</div>
        <div v-else>
          <div v-if="clubs.length" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="club in clubs" :key="club.id || club._id" class="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
              <div class="h-28 bg-gray-50 flex items-center justify-center">
                <img v-if="club.logoUrl" :src="club.logoUrl" alt="Club Logo" class="h-20 w-20 rounded-full object-cover shadow" />
                <div v-else class="h-20 w-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-2xl">
                  {{ (club.clubName || club.name || 'C').charAt(0) }}
                </div>
              </div>
              <div class="p-5">
                <div class="mb-2">
                  <h3 class="font-bold text-gray-900 leading-tight">{{ club.clubName || club.name }}</h3>
                  <p class="text-xs text-gray-500">
                    <span v-if="club.city">{{ club.city }}, </span>{{ club.district }}
                  </p>
                </div>
                <p v-if="club.description" class="text-sm text-gray-600 line-clamp-2 mb-3">{{ club.description }}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span v-if="club.memberCount">👥 {{ club.memberCount }}</span>
                  <span v-if="club.groundName">🏟️ {{ club.groundName }}</span>
                  <span class="ml-auto inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full">● Approved</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">No approved clubs yet.</div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section 
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">What Kerala Cricketers Say</h2>
          <p class="text-xl text-gray-600">Hear from club managers, players, and tournament organizers across Kerala</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">🏏</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Club Manager</h3>
                <p class="text-sm text-gray-600">Kerala Cricket Club</p>
              </div>
            </div>
            <p class="text-gray-700 italic leading-relaxed">"CrickArena transformed how we manage our club. From player registrations to tournament scheduling, everything is streamlined and professional."</p>
            <div class="flex mt-4">
              <span v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400">★</span>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">📊</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Tournament Organizer</h3>
                <p class="text-sm text-gray-600">District Cricket Association</p>
              </div>
            </div>
            <p class="text-gray-700 italic leading-relaxed">"Organizing district-level tournaments was never this easy. The platform's features save hours of coordination work and keep everyone engaged."</p>
            <div class="flex mt-4">
              <span v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400">★</span>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">👥</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Cricket Player</h3>
                <p class="text-sm text-gray-600">Local Cricket Enthusiast</p>
              </div>
            </div>
            <p class="text-gray-700 italic leading-relaxed">"I discovered local clubs and joined weekend practice sessions. The player network helped me connect with fellow cricketers in my district."</p>
            <div class="flex mt-4">
              <span v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400">★</span>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- News & Updates Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Latest Cricket News</h2>
          <p class="text-xl text-gray-600">Stay updated with Kerala cricket tournaments, club news, and player achievements</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="h-48 bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden flex items-center justify-center">
              <div class="text-6xl text-white opacity-80">🏆</div>
              <div class="absolute bottom-4 left-4 text-white">
                <span class="bg-green-600 px-3 py-1 rounded-full text-xs font-semibold">Tournament</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Kerala Inter-District Championship</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">Annual cricket tournament bringing together teams from all Kerala districts in competitive matches.</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>Coming Soon</span>
                <span class="text-green-600 font-semibold group-hover:translate-x-1 transition-transform duration-300 cursor-pointer">Learn more →</span>
              </div>
            </div>
          </div>

          <div class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 relative overflow-hidden flex items-center justify-center">
              <div class="text-6xl text-white opacity-80">🏏</div>
              <div class="absolute bottom-4 left-4 text-white">
                <span class="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Infrastructure</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">New Cricket Grounds</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">Modern cricket facilities being developed across Kerala districts to support local cricket community growth.</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>In Development</span>
                <span class="text-green-600 font-semibold group-hover:translate-x-1 transition-transform duration-300 cursor-pointer">Learn more →</span>
              </div>
            </div>
          </div>

          <div class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="h-48 bg-gradient-to-br from-purple-400 to-pink-600 relative overflow-hidden flex items-center justify-center">
              <div class="text-6xl text-white opacity-80">🌟</div>
              <div class="absolute bottom-4 left-4 text-white">
                <span class="bg-purple-600 px-3 py-1 rounded-full text-xs font-semibold">Youth Cricket</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Young Talent Development</h3>
              <p class="text-gray-600 text-sm leading-relaxed mb-4">Supporting emerging cricket talents through youth leagues and training programs across Kerala.</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>Ongoing</span>
                <span class="text-green-600 font-semibold group-hover:translate-x-1 transition-transform duration-300 cursor-pointer">Learn more →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
      <div class="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 class="text-4xl font-black mb-6">Ready to Join Kerala's Cricket Community?</h2>
        <p class="text-xl mb-8 opacity-90">Whether you're a player, club manager, or cricket enthusiast, CrickArena is your gateway to Kerala's vibrant cricket ecosystem.</p>
        
        <div class="flex flex-wrap justify-center gap-4">
          <template v-if="!auth.user">
            <RouterLink to="/register" class="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Join Free Today
            </RouterLink>
            <RouterLink to="/login" class="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Sign In
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink to="/dashboard" class="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Go to Dashboard
            </RouterLink>
            <RouterLink to="/club-registration" class="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Register Your Club
            </RouterLink>
          </template>
        </div>

        <!-- Contact Info -->
        <div class="mt-16 pt-8 border-t border-white border-opacity-30">
          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-2xl mb-2">📧</div>
              <h3 class="font-semibold mb-1">Email Support</h3>
              <p class="text-sm opacity-80">support@crickarena.com</p>
            </div>
            <div>
              <div class="text-2xl mb-2">📱</div>
              <h3 class="font-semibold mb-1">WhatsApp</h3>
              <p class="text-sm opacity-80">+91 9876 543 210</p>
            </div>
            <div>
              <div class="text-2xl mb-2">🏏</div>
              <h3 class="font-semibold mb-1">Cricket Hub</h3>
              <p class="text-sm opacity-80">Kerala Cricket Association</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-2xl font-bold mb-4">
              <span class="text-green-400">Crick</span>Arena
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">Kerala's premier cricket management platform connecting players, clubs, and tournaments across God's Own Country.</p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Platform</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><a href="#" class="hover:text-green-400 transition-colors">Tournaments</a></li>
              <li><RouterLink to="/clubs" class="hover:text-green-400 transition-colors">Clubs</RouterLink></li>
              <li><a href="#" class="hover:text-green-400 transition-colors">Live Scores</a></li>
              <li><a href="#" class="hover:text-green-400 transition-colors">Player Stats</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><RouterLink to="/help" class="hover:text-green-400 transition-colors">Help Center</RouterLink></li>
              <li><RouterLink to="/contact" class="hover:text-green-400 transition-colors">Contact Us</RouterLink></li>
              <li><RouterLink to="/privacy" class="hover:text-green-400 transition-colors">Privacy Policy</RouterLink></li>
              <li><RouterLink to="/terms" class="hover:text-green-400 transition-colors">Terms of Service</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Connect</h4>
            <div class="flex space-x-4">
              <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span class="text-sm">f</span>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span class="text-sm">t</span>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <span class="text-sm">i</span>
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 CrickArena. Made with ❤️ in Kerala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import TournamentList from '../components/TournamentList.vue';
import TournamentHistory from '../components/TournamentHistory.vue';

const auth = useAuthStore();

const clubs = ref([]);
const upcoming = ref([]);
const history = ref([]);
const loading = ref(true);
const showTournamentDetails = ref(false);

// Kerala Districts (just names, no fake club counts)
const keralaDistricts = ref([
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
]);

// Simple featured carousel logic
const activeIndex = ref(0);
const activeTournament = computed(() => upcoming.value[activeIndex.value] || {});
let timer = null;
function setActive(i){ activeIndex.value = i; restartTimer(); }
function next(){ if (upcoming.value.length > 0) activeIndex.value = (activeIndex.value + 1) % upcoming.value.length; }
function restartTimer(){ if (timer) clearInterval(timer); if (upcoming.value.length > 1) timer = setInterval(next, 5000); }

// Logout function
async function onLogout() {
  await auth.logout();
}

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

onMounted(async () => {
  try {
    await auth.init();
    
    // Try to fetch real data, fallback to empty arrays if endpoints don't exist
    const [c, u, h] = await Promise.all([
      axios.get(`${API}/clubs/public`).catch(() => ({ data: [] })),
      axios.get(`${API}/tournaments/upcoming`).catch(() => ({ data: [] })),
      axios.get(`${API}/tournaments/history`).catch(() => ({ data: [] }))
    ]);
    
    clubs.value = c.data || []; 
    upcoming.value = u.data || []; 
    history.value = h.data || [];
  } catch (error) {
    console.error('Failed to load data:', error);
    // Set empty arrays as fallback
    clubs.value = [];
    upcoming.value = [];
    history.value = [];
  } finally {
    loading.value = false;
    restartTimer();
  }
});

onUnmounted(() => { 
  if (timer) clearInterval(timer); 
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>