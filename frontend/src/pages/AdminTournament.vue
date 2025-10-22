<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header Bar -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold">
            Tournament Management
          </h1>
        <button @click="openCreate = true"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Create Tournament
        </button>
        </div>
      </div>
      </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters & Search -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center gap-4">
          <!-- Status Filters -->
          <div class="flex flex-wrap gap-2">
        <button v-for="f in filters" :key="f.key" @click="activeFilter = f.key; fetchTournaments()"
                    class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105"
                    :class="activeFilter === f.key 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
          {{ f.label }}
        </button>
      </div>

          <!-- Search -->
          <div class="flex-1 lg:max-w-md">
            <div class="relative">
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" placeholder="Search tournaments..." 
                     class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p class="text-gray-600 font-medium">Loading tournaments...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tournaments.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <svg class="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tournaments found</h3>
        <p class="text-gray-600 mb-6">Get started by creating your first tournament</p>
        <button @click="openCreate = true" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Create Tournament
        </button>
      </div>

      <!-- Tournaments Grid -->
      <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="t in tournaments" :key="t._id" 
             class="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <!-- Tournament Header -->
          <div class="relative p-6 pb-4">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {{ t.name }}
                </h3>
                <div class="flex items-center gap-2 mb-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        :class="statusClass(t.status)">
                    <span class="w-2 h-2 rounded-full mr-2" :class="statusDotClass(t.status)"></span>
                    {{ t.status }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {{ t.format }}
                  </span>
                  <span v-if="t.matchFormat" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {{ t.matchFormat }}
                  </span>
                </div>
              </div>
              
              <!-- Tournament Icon -->
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {{ t.name.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Tournament Info -->
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>{{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</span>
              </div>
              
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>{{ t.district || 'No district' }}</span>
              </div>

              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span>Max {{ t.maxTeams }} teams</span>
              </div>
            </div>

            <!-- Description -->
            <p v-if="t.description" class="mt-4 text-sm text-gray-600 line-clamp-2">
              {{ t.description }}
            </p>
          </div>

          <!-- Tournament Stats -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div class="text-lg font-bold text-gray-900">{{ t.participants?.length || 0 }}</div>
                <div class="text-xs text-gray-500">Teams</div>
              </div>
            <div>
                <div class="text-lg font-bold text-gray-900">₹{{ t.entryFee || 0 }}</div>
                <div class="text-xs text-gray-500">Entry Fee</div>
            </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="p-6 pt-4">
            <div class="flex flex-wrap gap-2">
              <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" 
                         class="flex-1 min-w-0 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium text-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                View Details
              </RouterLink>
              
              <button @click="openRegistrations(t)" 
                      class="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Teams
              </button>
              
              <button v-if="t.format === 'groups+knockouts' && t.status !== 'cancelled' && t.status !== 'completed'" 
                      @click="seedKnockout(t)" 
                      class="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Seed
              </button>
              
              <!-- Delete Tournament Button -->
              <button @click="deleteTournament(t)" 
                      class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Create Dialog -->
      <div v-if="openCreate" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Create New Tournament</h2>
                <p class="text-red-100 text-sm">Fill in the details to launch your cricket tournament</p>
              </div>
            </div>
            <button @click="closeDialog" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Form Content -->
          <div class="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form class="p-6 space-y-8" @submit.prevent="saveTournament">
              <!-- Basic Information Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 flex items-center gap-1">
                      Tournament Name <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input v-model="form.name" type="text" required
                             class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                             placeholder="Enter tournament name"/>
                      <svg class="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m0 0l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z"/>
                      </svg>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Tournament Format</label>
                    <select v-model="form.format"
                            class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 appearance-none">
                      <option value="knockout">🏆 Knockout</option>
                      <option value="league">📊 League</option>
                      <option value="round-robin">🔄 Round-robin</option>
                      <option value="league+playoff">🏅 League + Playoff</option>
                      <option value="groups+knockouts">🗂️ Groups + Knockouts</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">District</label>
                    <select v-model="form.district"
                            class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 appearance-none">
                      <option v-for="d in districts" :key="d" :value="d">📍 {{ d }}</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Max Teams</label>
                    <input v-model.number="form.maxTeams" type="number" min="2" max="128"
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                           placeholder="16"/>
                  </div>
                  
                  <!-- Match Format Field -->
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Match Format</label>
                    <select v-model="form.matchFormat"
                            class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 appearance-none">
                      <option value="T20">T20 (20 overs)</option>
                      <option value="ODI">ODI (50 overs)</option>
                      <option value="Test">Test (90 overs)</option>
                      <option value="T10">T10 (10 overs)</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  
                  <!-- Overs Limit Field -->
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Overs Limit</label>
                    <input v-model.number="form.oversLimit" type="number" min="1" max="100"
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                           :placeholder="getOversPlaceholder()"/>
                  </div>
                </div>
              </div>

              <!-- Dates & Fees Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Dates & Financial Details</h3>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Start Date <span class="text-red-500">*</span></label>
                    <input v-model="form.startDate" type="date" :min="today" required
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"/>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">End Date <span class="text-red-500">*</span></label>
                    <input v-model="form.endDate" type="date" :min="form.startDate || today" required
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"/>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Registration Deadline</label>
                    <input v-model="form.registrationDeadline" type="date" :min="today"
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"/>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Entry Fee (INR)</label>
                    <div class="relative">
                      <input v-model.number="form.entryFee" type="number" min="0" step="1"
                             class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                             placeholder="0"/>
                      <span class="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                    </div>
                  </div>
                  
                  <!-- Prize Pool Field -->
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Prize Pool (INR)</label>
                    <div class="relative">
                      <input v-model.number="form.prizePool" type="number" min="0" step="1"
                             class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                             placeholder="0"/>
                      <span class="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                    </div>
                  </div>
                  
                  <!-- Minimum Rest Days Field -->
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Minimum Rest Days</label>
                    <input v-model.number="form.restDaysMin" type="number" min="0" max="7"
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                           placeholder="1"/>
                  </div>
                  
                  <!-- Sponsor Information Field -->
                  <div class="space-y-2 md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700">Sponsor Information</label>
                    <input v-model="form.sponsorInfo" type="text"
                           class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                           placeholder="Enter sponsor details"/>
                  </div>
                </div>
              </div>

              <!-- Venue & Description Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Venue & Description</h3>
                </div>

                <div class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Grounds/Venues</label>
                    <textarea v-model="venuesText" rows="2"
                              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                              placeholder="Ground A, Ground B, Ground C (comma separated)"></textarea>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Tournament Description</label>
                    <textarea v-model="form.description" rows="3"
                              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                              placeholder="Provide a brief overview of the tournament, its significance, and what participants can expect..."></textarea>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Rules & Regulations <span class="text-red-500">*</span></label>
                    <textarea v-model="form.rules" required rows="4"
                              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none"
                              placeholder="Key rules including eligibility criteria, overs per match, player limits, dress code, fees, conduct rules, etc."></textarea>
                  </div>
                </div>
              </div>

              <!-- Match Time Slots Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Match Scheduling Configuration</h3>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="text-sm text-blue-800">
                      <p class="font-semibold mb-1">Smart Scheduling</p>
                      <p>Configure available match times to control fixture scheduling. By default, only one match will be scheduled per time slot unless tournament days are limited.</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <!-- Time Slots Configuration -->
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">Available Match Time Slots</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div v-for="(slot, idx) in timeSlots" :key="idx" class="flex items-center gap-2">
                        <input 
                          v-model="slot.time" 
                          type="time" 
                          class="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        />
                        <button 
                          v-if="timeSlots.length > 1"
                          @click="removeTimeSlot(idx)" 
                          type="button"
                          class="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button 
                      @click="addTimeSlot" 
                      type="button"
                      class="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Add Time Slot
                    </button>
                  </div>

                  <!-- Parallel Match Settings -->
                  <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div class="flex items-center gap-3">
                      <input 
                        id="allowParallel" 
                        v-model="form.allowParallelMatches" 
                        type="checkbox" 
                        class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label for="allowParallel" class="text-sm font-medium text-gray-700">
                        Allow multiple matches at the same time (when necessary)
                      </label>
                    </div>
                    
                    <div v-if="form.allowParallelMatches" class="space-y-2 pl-7">
                      <label class="block text-sm font-semibold text-gray-700">Maximum Parallel Matches</label>
                      <div class="flex items-center gap-3">
                        <input 
                          v-model.number="form.maxParallelMatches" 
                          type="number" 
                          min="1" 
                          max="10"
                          class="w-24 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        />
                        <span class="text-sm text-gray-600">matches can run simultaneously</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Parallel matches will only be scheduled if tournament duration is insufficient for sequential scheduling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Banner Section -->
              <div class="space-y-6">
                <div class="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">Tournament Banner</h3>
                </div>

                <div class="space-y-4">
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors">
                    <div class="flex items-center gap-4">
                      <div class="w-24 h-16 bg-gray-100 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <img v-if="bannerPreview" :src="bannerPreview" alt="Banner preview" class="w-full h-full object-cover"/>
                        <div v-else class="text-center">
                          <svg class="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span class="text-xs text-gray-400">Preview</span>
                        </div>
                      </div>
                      <div class="flex-1">
                        <label class="block">
                          <span class="sr-only">Choose banner image</span>
                          <input type="file" accept="image/*" @change="onBannerSelected"
                                 class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                        </label>
                        <p class="text-xs text-gray-500 mt-1">JPEG, PNG, WebP up to 2MB recommended</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMsg" class="bg-red-50 border border-red-200 rounded-xl p-4">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-red-700 font-medium">{{ errorMsg }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" @click="closeDialog"
                        class="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200">
                  Cancel
                </button>
                <button type="submit"
                        class="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Generate Fixtures Modal -->
      <div v-if="genOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
          <div class="px-4 py-3 border-b flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Generate Fixtures</h3>
            <button @click="closeGen" class="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tournament</label>
              <input class="w-full px-3 py-2 border rounded bg-gray-50" :value="currentTournament?.name" disabled />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <input class="w-full px-3 py-2 border rounded bg-gray-50" :value="currentTournament?.format" disabled />
            </div>
            <div v-if="currentTournament?.format === 'round-robin' || currentTournament?.format === 'league'" class="flex items-center gap-2">
              <input id="doubleRR2" type="checkbox" v-model="gen.doubleRoundRobin" />
              <label for="doubleRR2" class="text-sm">Double round robin</label>
            </div>
            <div v-if="currentTournament?.format === 'groups+knockouts' || currentTournament?.format === 'league+playoff'" class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm mb-1">Groups</label>
                <input v-model.number="gen.groups" type="number" min="2" class="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label class="block text-sm mb-1">Qualify / group</label>
                <input v-model.number="gen.qualifyPerGroup" type="number" min="1" class="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input id="respectRounds2" type="checkbox" v-model="gen.respectRoundOrder" />
              <label for="respectRounds2" class="text-sm">Respect round order (strict)</label>
            </div>
            <p v-if="genError" class="text-sm text-red-600">{{ genError }}</p>
            <div v-if="genDiag" class="text-xs text-gray-600 bg-gray-50 border rounded p-2">
              <div>Required matches: {{ genDiag.required }}</div>
              <div>Capacity (slots): {{ genDiag.capacity }}</div>
            </div>
          </div>
          <div class="px-4 py-3 border-t flex items-center justify-end gap-2">
            <button class="px-3 py-2 border rounded" @click="closeGen">Cancel</button>
            <button class="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50" :disabled="genLoading" @click="generateNow">
              {{ genLoading ? 'Generating...' : 'Generate' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Registrations Management Modal -->
      <div v-if="openRegistrationsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Manage Registrations</h2>
                <p class="text-blue-100 text-sm">{{ currentTournament?.name }}</p>
              </div>
            </div>
            <button @click="closeRegistrationsModal" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 overflow-y-auto flex-1">
            <div v-if="registrations.length === 0" class="text-center py-12">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No Registrations Yet</h3>
              <p class="text-gray-600">Teams haven't registered for this tournament yet.</p>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                <span class="text-sm text-gray-500">{{ registrations.filter(r => r.status === 'pending').length }} pending</span>
              </div>

              <div class="grid gap-4">
                <div v-for="reg in registrations" :key="reg._id"
                     class="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <img v-if="reg.club?.logoUrl" :src="reg.club.logoUrl" class="w-12 h-12 rounded-full object-cover" />
                      <div v-else class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ reg.club?.clubName || reg.club?.name }}</h4>
                        <p class="text-sm text-gray-600">{{ reg.club?.district || 'Kerala' }}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                :class="reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                                       reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                       'bg-yellow-100 text-yellow-800'">
                            {{ reg.status }}
                          </span>
                          <span v-if="reg.paymentStatus" class="text-xs text-gray-500">
                            Payment: {{ reg.paymentStatus }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button v-if="reg.status === 'pending'"
                              @click="updateRegistration(reg._id, 'approve')"
                              class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        Approve
                      </button>
                      <button v-if="reg.status === 'pending'"
                              @click="updateRegistration(reg._id, 'reject')"
                              class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                      <span v-if="reg.status === 'approved'" class="text-sm text-green-600 font-medium">✓ Approved</span>
                      <span v-if="reg.status === 'rejected'" class="text-sm text-red-600 font-medium">✗ Rejected</span>
                    </div>
                  </div>

                  <div v-if="reg.registeredAt" class="mt-3 pt-3 border-t border-gray-100">
                    <div class="text-xs text-gray-500">
                      Registered on {{ new Date(reg.registeredAt).toLocaleDateString() }}
                      <span v-if="reg.paymentAmount" class="ml-2">• Entry Fee: ₹{{ reg.paymentAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t flex items-center justify-end">
            <button @click="closeRegistrationsModal" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/api';
// FixtureDraw import removed

const openCreate = ref(false);
const activeFilter = ref('');
const tournaments = ref([]);
const loading = ref(false);
const editing = ref(false);
const openRegistrationsModal = ref(false);
const registrations = ref([]);
const currentTournament = ref(null);

const current = ref(null); // kept for creation workflow only

const errorMsg = ref('');

// Fixture generation state
const genOpen = ref(false);
const genLoading = ref(false);
const genError = ref('');
const genDiag = ref(null);
const gen = ref({ doubleRoundRobin: false, respectRoundOrder: true, groups: 2, qualifyPerGroup: 2 });

const router = useRouter();

const filters = [
  { key: '', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const districts = [
  'Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'
];

const form = reactive({
  name: '', format: 'league', district: districts[0], maxTeams: 16,
  entryFee: 0, prizePool: 0, sponsorInfo: '',
  startDate: '', endDate: '', registrationDeadline: '', description: '', rules: '', bannerUrl: '', venues: [],
  matchFormat: 'T20', oversLimit: 20, restDaysMin: 1,
  allowParallelMatches: false,
  maxParallelMatches: 1
});
const bannerPreview = ref('');
const timeSlots = ref([
  { time: '09:00' },
  { time: '14:00' },
  { time: '18:00' }
]);

const today = new Date().toISOString().split('T')[0];

// Watch for match format changes to set default overs limit
watch(() => form.matchFormat, (newFormat) => {
  switch (newFormat) {
    case 'T20': form.oversLimit = 20; break;
    case 'ODI': form.oversLimit = 50; break;
    case 'Test': form.oversLimit = 90; break;
    case 'T10': form.oversLimit = 10; break;
    default: form.oversLimit = 20;
  }
});

function getOversPlaceholder() {
  switch (form.matchFormat) {
    case 'T20': return '20 (default for T20)';
    case 'ODI': return '50 (default for ODI)';
    case 'Test': return '90 (default for Test)';
    case 'T10': return '10 (default for T10)';
    default: return 'Enter overs limit';
  }
}

async function onBannerSelected(e){
  const file = e.target.files?.[0];
  if (!file) return;
  const okType = ['image/jpeg','image/png','image/webp'];
  if (!okType.includes(file.type)) { errorMsg.value = 'Please select a JPEG/PNG/WebP image'; return; }
  if (file.size > 2 * 1024 * 1024) { errorMsg.value = 'Banner too large (max 2MB)'; return; }
  bannerPreview.value = URL.createObjectURL(file);
  // Minimal approach: embed as data URL (replace with real upload later)
  const reader = new FileReader();
  const dataUrl = await new Promise((res, rej) => { reader.onload = () => res(reader.result); reader.onerror = rej; reader.readAsDataURL(file); });
  form.bannerUrl = String(dataUrl);
}
const venuesText = ref('');

function fmtDate(d){
  return new Date(d).toLocaleDateString();
}
function statusClass(status){
  // Supports both tournament statuses and registration statuses
  if (status === 'approved') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
  return status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
         status === 'open' ? 'bg-rose-50 text-rose-700 border-rose-200' :
         status === 'ongoing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
         status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
         'bg-gray-50 text-gray-700 border-gray-200';
}

function statusDotClass(status){
  return status === 'cancelled' ? 'bg-red-400' :
         status === 'open' ? 'bg-rose-400' :
         status === 'ongoing' ? 'bg-orange-400' :
         status === 'completed' ? 'bg-green-400' :
         'bg-gray-400';
}

async function openRegistrations(tournament){
  currentTournament.value = tournament;
  openRegistrationsModal.value = true;
  await fetchRegistrations(tournament._id);
}

async function fetchRegistrations(tournamentId){
  try {
    const { data } = await api.get(`/admin/tournaments/${tournamentId}/registrations`);
    registrations.value = data;
  } catch (e) {
    console.error('Failed to fetch registrations:', e);
    registrations.value = [];
  }
}

async function seedKnockout(t){
  if (!confirm('Seed knockout bracket from current group standings?')) return;
  try{
    await api.post(`/admin/tournaments/${t._id}/fixtures/seed-knockout`, { qualifyPerGroup: 2 });
    await fetchTournaments();
    alert('Knockout seeded');
  } catch(e){
    alert(e?.response?.data?.message || 'Failed to seed knockout');
  }
}

async function deleteTournament(tournament) {
  // Use the global confirm dialog instead of native confirm
  const confirmed = await window.$confirm({
    title: 'Delete Tournament',
    message: `Are you sure you want to permanently delete the tournament "${tournament.name}"? This action cannot be undone and will also delete all associated matches.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    isDangerous: true
  });
  
  if (!confirmed) return;
  
  try {
    // Add more detailed logging
    console.log('Deleting tournament with ID:', tournament._id);
    
    // Check if tournament ID is valid
    if (!tournament._id) {
      throw new Error('Invalid tournament ID');
    }
    
    await api.delete(`/admin/tournaments/${tournament._id}`);
    await fetchTournaments();
    // Use the global notification instead of native alert
    window.$notify.success('Tournament Deleted', 'Tournament deleted successfully');
  } catch (e) {
    console.error('Failed to delete tournament:', e);
    console.error('Error details:', {
      message: e.message,
      code: e.code,
      response: e.response?.data,
      status: e.response?.status,
      tournamentId: tournament._id
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to delete tournament';
    if (e.response) {
      if (e.response.status === 404) {
        errorMessage = 'Tournament not found';
      } else if (e.response.status === 403) {
        errorMessage = 'Access denied. You may not have permission to delete this tournament.';
      } else if (e.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = e.response.data?.message || errorMessage;
      }
    } else if (e.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please check your connection and try again.';
    } else if (!e.response) {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    window.$notify.error('Delete Failed', errorMessage);
  }
}

function openGenerate(t){
  currentTournament.value = t;
  gen.value = { doubleRoundRobin: false, respectRoundOrder: true, groups: 2, qualifyPerGroup: 2 };
  genError.value = '';
  genDiag.value = null;
  genOpen.value = true;
}
function closeGen(){ genOpen.value = false; currentTournament.value = null; }
async function generateNow(){
  if (!currentTournament.value) return;
  genLoading.value = true; genError.value = ''; genDiag.value = null;
  try{
    // Use V2 endpoint with time slot support
    const { data } = await api.post(`/admin/tournaments/${currentTournament.value._id}/fixtures/generate-v2`, { ...gen.value });
    genOpen.value = false;
    await fetchTournaments();
  } catch(e){
    genError.value = e?.response?.data?.message || 'Failed to generate fixtures';
    const diag = e?.response?.data?.diagnostics; if (diag) genDiag.value = diag;
  } finally { genLoading.value = false; }
}

async function updateRegistration(registrationId, action){
  if (!currentTournament.value) return;

  try {
    await api.put(`/admin/tournaments/${currentTournament.value._id}/registrations/${registrationId}/${action}`);
    await fetchRegistrations(currentTournament.value._id);
  } catch (e) {
    console.error('Failed to update registration:', e);
  }
}

function closeRegistrationsModal(){
  openRegistrationsModal.value = false;
  currentTournament.value = null;
  registrations.value = [];
}

async function fetchTournaments(){
  loading.value = true; errorMsg.value = '';
  try{
    const { data } = await api.get('/admin/tournaments', { params: { status: activeFilter.value || undefined } });
    tournaments.value = data;
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e.message || 'Failed to load tournaments';
  } finally { loading.value = false; }
}

function closeDialog(){
  openCreate.value = false; editing.value = false; current.value = null; errorMsg.value = '';
  Object.assign(form, { name: '', format: 'league', district: districts[0], maxTeams: 16,
    entryFee: 0, prizePool: 0, sponsorInfo: '',
    startDate: '', endDate: '', registrationDeadline: '', description: '', rules: '', bannerUrl: '', venues: [],
    matchFormat: 'T20', oversLimit: 20, restDaysMin: 1,
    allowParallelMatches: false,
    maxParallelMatches: 1
  });
  venuesText.value = '';
  timeSlots.value = [
    { time: '09:00' },
    { time: '14:00' },
    { time: '18:00' }
  ];
  if (bannerPreview.value) { URL.revokeObjectURL(bannerPreview.value); }
  bannerPreview.value = '';
}

function addTimeSlot() {
  timeSlots.value.push({ time: '12:00' });
}

function removeTimeSlot(index) {
  if (timeSlots.value.length > 1) {
    timeSlots.value.splice(index, 1);
  }
}

// Editing moved to Tournament Details page; retain placeholder for code compatibility
function onEdit(t){
  router.push({ name: 'tournament-details', params: { id: t._id } });
}

function isValidDateStr(v){ return /^\d{4}-\d{2}-\d{2}$/.test(v); }

async function saveTournament(){
  errorMsg.value = '';
  // Basic validation matching backend required fields
  if (!form.name?.trim()) { errorMsg.value = 'Name is required'; return; }
  if (!form.rules?.trim()) { errorMsg.value = 'Rules are required'; return; }
  if (!isValidDateStr(form.startDate) || !isValidDateStr(form.endDate)) { errorMsg.value = 'Start and End dates are required (YYYY-MM-DD)'; return; }
  if (new Date(form.endDate) < new Date(form.startDate)) { errorMsg.value = 'End date cannot be before start date'; return; }
  if (form.maxTeams < 2 || form.maxTeams > 128) { errorMsg.value = 'Max teams must be between 2 and 128'; return; }
  if (form.entryFee < 0) { errorMsg.value = 'Entry fee cannot be negative'; return; }
  if (form.prizePool < 0) { errorMsg.value = 'Prize pool cannot be negative'; return; }
  if (form.restDaysMin < 0) { errorMsg.value = 'Minimum rest days cannot be negative'; return; }
  if (form.oversLimit <= 0) { errorMsg.value = 'Overs limit must be greater than 0'; return; }
  
  // Validate dates are not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(form.startDate);
  const endDate = new Date(form.endDate);
  
  if (startDate < today) { errorMsg.value = 'Start date cannot be in the past'; return; }
  if (endDate < today) { errorMsg.value = 'End date cannot be in the past'; return; }
  
  if (form.registrationDeadline) {
    if (!isValidDateStr(form.registrationDeadline) || new Date(form.registrationDeadline) > new Date(form.startDate)) {
      errorMsg.value = 'Registration deadline must be a valid date on/before the start date';
      return;
    }
    const regDeadline = new Date(form.registrationDeadline);
    if (regDeadline < today) { errorMsg.value = 'Registration deadline cannot be in the past'; return; }
  }

  const payload = { 
    ...form, 
    venues: venuesText.value.split(',').map(s=>s.trim()).filter(Boolean),
    matchTimeSlots: timeSlots.value.map(slot => slot.time).filter(Boolean)
  };
  
  try {
    if (editing.value && current.value){
      await api.put(`/admin/tournaments/${current.value._id}`, payload);
    } else {
      await api.post('/admin/tournaments', payload);
    }
    closeDialog();
    await fetchTournaments();
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || e.message || 'Failed to save tournament';
  }
}

async function onCancel(t){
  if (!confirm('Cancel this tournament?')) return;
  await api.put(`/admin/tournaments/${t._id}/cancel`);
  await fetchTournaments();
}

function goRegistrations(t){
  router.push({ name: 'tournament-details', params: { id: t._id } });
}

async function updateReg(r, action){
  await api.put(`/admin/tournaments/${current.value._id}/registrations/${r._id}/${action}`);
  await viewRegistrations(current.value);
}

async function openRegs(t){
  await api.put(`/admin/tournaments/${t._id}/open-registrations`);
  await fetchTournaments();
}
async function closeRegs(t){
  await api.put(`/admin/tournaments/${t._id}/close-registrations`);
  await fetchTournaments();
}
// generateFixtures function removed

onMounted(fetchTournaments);
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>