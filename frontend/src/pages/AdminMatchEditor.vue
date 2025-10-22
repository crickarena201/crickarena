<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="goBack" 
                    class="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6"/>
              </svg>
              Back
            </button>
        <div>
              <h1 class="text-2xl font-bold text-gray-900">Match Editor</h1>
              <p v-if="match" class="text-sm text-gray-600 mt-1">
                <span class="font-medium text-blue-600">{{ displayTeamName(form.homeClub) }}</span>
                <span class="mx-2 text-gray-400">vs</span>
                <span class="font-medium text-purple-600">{{ displayTeamName(form.awayClub) }}</span>
                <span v-if="form.round || match.round" class="ml-3 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {{ form.round || match.round }}
                </span>
          </p>
        </div>
      </div>
          <div class="flex items-center gap-3">
            <button @click="load" 
                    :disabled="loading"
                    class="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Reload
            </button>
            <button @click="openReschedule" 
                    :disabled="saving || finalized"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Reschedule
            </button>
            <button v-if="!finalized" @click="confirmFinalize" 
                    :disabled="saving"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Finalize Match
            </button>
            <button v-else @click="unlockForEdit" 
                    :disabled="saving"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V3m0 8l-3-3m3 3l3-3M5 21h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z"/>
              </svg>
              Unlock for Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p class="text-gray-600 font-medium">Loading match details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-red-900">Error Loading Match</h3>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>
          </div>
        </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-8">
        <!-- Match Status Banner -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
          </div>
          <div>
                  <h2 class="text-xl font-bold text-white">Match Information</h2>
                  <p class="text-blue-100">{{ displayTeamName(form.homeClub) }} vs {{ displayTeamName(form.awayClub) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
                  <div class="w-2 h-2 rounded-full"
                       :class="{
                         'bg-yellow-400': currentStatus === 'Live',
                         'bg-blue-400': currentStatus === 'Scheduled',
                         'bg-green-400': currentStatus === 'Completed',
                         'bg-gray-400': currentStatus === 'Cancelled'
                       }"></div>
                  {{ currentStatus }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Match Details -->
          <div class="p-6">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 font-medium">Date</div>
                <div class="text-lg font-semibold text-gray-900">{{ form.date || 'TBD' }}</div>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 font-medium">Time</div>
                <div class="text-lg font-semibold text-gray-900">{{ form.time || 'TBD' }}</div>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                </div>
                <div class="text-sm text-gray-600 font-medium">Venue</div>
                <div class="text-lg font-semibold text-gray-900">{{ form.venue || 'TBD' }}</div>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
          </div>
                <div class="text-sm text-gray-600 font-medium">Round</div>
                <div class="text-lg font-semibold text-gray-900">{{ form.round || 'League' }}</div>
          </div>
          </div>
        </div>
      </div>

        <!-- Toss Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Toss Information</h2>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid md:grid-cols-2 gap-6">
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Toss Won By</label>
                <select v-model="form.toss.wonBy" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        :disabled="finalized">
              <option value="">Select team</option>
              <option v-for="t in tossTeamOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Decision</label>
                <select v-model="form.toss.decision" 
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        :disabled="finalized">
                  <option value="bat">Bat First</option>
                  <option value="bowl">Bowl First</option>
            </select>
          </div>
        </div>
            
            <div v-if="tossHint" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-amber-800 font-medium">{{ tossHint }}</span>
              </div>
            </div>
            
            <div v-if="tossHint && form.toss.wonBy && form.toss.decision" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-green-800 text-sm font-medium">Innings will be automatically set based on toss decision</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Innings Section -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-white">Innings Details</h2>
              </div>
              <button @click="addInnings" 
                      :disabled="finalized || form.innings.length >= 2"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add Innings
              </button>
            </div>
      </div>

      <!-- Innings Tabs -->
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button v-for="(inn, idx) in form.innings" :key="idx" 
                      @click="activeInnings = idx"
                      :class="[
                        'px-6 py-4 text-sm font-medium transition-all duration-200',
                        activeInnings === idx 
                          ? 'text-green-600 bg-white border-b-2 border-green-600' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      ]">
                <div class="flex items-center gap-2">
                  <span>Innings {{ idx + 1 }}</span>
                  <div v-if="totals(idx).runs > 0" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {{ totals(idx).runs }}/{{ totals(idx).wickets }}
          </div>
        </div>
          </button>
            </nav>
        </div>

        <!-- Innings Content -->
          <div v-for="(inn, idx) in form.innings" :key="idx" v-show="activeInnings === idx" class="p-6">
            <!-- Team Selection -->
            <div class="bg-gray-50 rounded-xl p-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Team Selection</h3>
                <button v-if="form.innings.length > 1" 
                        @click="removeInnings(idx)" 
                        :disabled="finalized"
                        class="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Remove Innings
                </button>
              </div>
              <div class="grid md:grid-cols-2 gap-6">
              <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Batting Club</label>
                  <select v-model="inn.battingClub" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          :disabled="finalized">
                    <option value="">Select batting team</option>
                    <option v-for="t in matchTeamOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>
              <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Bowling Club</label>
                  <select v-model="inn.bowlingClub" 
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          :disabled="finalized">
                    <option value="">Select bowling team</option>
                    <option v-for="t in matchTeamOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>
            </div>
            </div>

            <!-- Innings Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-blue-600 font-medium">Runs</div>
                    <div class="text-2xl font-bold text-blue-900">{{ totals(idx).runs }}</div>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-red-600 font-medium">Wickets</div>
                    <div class="text-2xl font-bold text-red-900">{{ totals(idx).wickets }}</div>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm text-green-600 font-medium">Balls</div>
                    <div class="text-2xl font-bold text-green-900">{{ totals(idx).balls }}</div>
                  </div>
                </div>
          </div>

              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4"/>
                    </svg>
            </div>
                  <div>
                    <div class="text-sm text-purple-600 font-medium">Run Rate</div>
                    <div class="text-2xl font-bold text-purple-900">{{ totals(idx).rr }}</div>
            </div>
            </div>
            </div>
          </div>

          <!-- Batting Table -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Batting</h3>
              <button class="btn" @click="addBatter(idx)" :disabled="finalized">+ Batter</button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-600 border-b">
                    <th class="py-2 pr-2">Player</th>
                    <th class="py-2 pr-2 w-16">R</th>
                    <th class="py-2 pr-2 w-16">B</th>
                    <th class="py-2 pr-2 w-16">4s</th>
                    <th class="py-2 pr-2 w-16">6s</th>
                    <th class="py-2 pr-2">Dismissal</th>
                    <th class="py-2 pr-2 w-20 text-right">SR</th>
                    <th class="py-2 pr-2 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(b, bi) in inn.battingCard" :key="bi" class="border-b">
                    <td><input v-model="b.playerName" class="input" placeholder="Name" :disabled="finalized" /></td>
                    <td><input v-model.number="b.runs" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td><input v-model.number="b.balls" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td><input v-model.number="b.fours" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td><input v-model.number="b.sixes" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td>
                      <select v-model="b.dismissalHow" class="input" :disabled="finalized">
                        <option value="">Not out</option>
                        <option>Bowled</option>
                        <option>LBW</option>
                        <option>Caught</option>
                        <option>Run out</option>
                        <option>Stumped</option>
                        <option>Hit wicket</option>
                        <option>Retired hurt</option>
                      </select>
                      <div class="grid grid-cols-2 gap-2 mt-1">
                        <input v-model="b.dismissalFielder" class="input" placeholder="Fielder" :disabled="finalized" />
                        <input v-model="b.dismissalBowler" class="input" placeholder="Bowler" :disabled="finalized" />
                      </div>
                    </td>
                    <td class="text-right text-gray-700">{{ strikeRate(b.runs, b.balls) }}</td>
                    <td class="text-right">
                      <button class="text-red-600 hover:underline" @click="inn.battingCard.splice(bi,1)" :disabled="finalized">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bowling Table -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">Bowling</h3>
              <div class="flex items-center gap-2">
                <button class="btn" @click="addBowler(idx)" :disabled="finalized">+ Bowler</button>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-600 border-b">
                    <th class="py-2 pr-2">Bowler</th>
                    <th class="py-2 pr-2 w-20">Balls</th>
                    <th class="py-2 pr-2 w-16">M</th>
                    <th class="py-2 pr-2 w-16">R</th>
                    <th class="py-2 pr-2 w-16">W</th>
                    <th class="py-2 pr-2 w-20 text-right">Econ</th>
                    <th class="py-2 pr-2 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bw, wi) in inn.bowlingCard" :key="wi" class="border-b">
                    <td><input v-model="bw.bowlerName" class="input" placeholder="Name" :disabled="finalized" /></td>
                    <td>
                      <input v-model.number="bw.balls" type="number" class="input" min="0" :disabled="finalized" />
                      <p class="text-xs text-gray-500 mt-1">{{ toOvers(bw.balls).toFixed(1) }} ov</p>
                    </td>
                    <td><input v-model.number="bw.maidens" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td><input v-model.number="bw.runs" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td><input v-model.number="bw.wickets" type="number" class="input" min="0" :disabled="finalized" /></td>
                    <td class="text-right text-gray-700">{{ economy(bw.runs, bw.balls) }}</td>
                    <td class="text-right">
                      <button class="text-red-600 hover:underline" @click="inn.bowlingCard.splice(wi,1)" :disabled="finalized">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Extras -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label class="label">Wides</label>
              <input v-model.number="inn.extras.wides" type="number" min="0" class="input" :disabled="finalized" />
            </div>
            <div>
              <label class="label">No Balls</label>
              <input v-model.number="inn.extras.noBalls" type="number" min="0" class="input" :disabled="finalized" />
            </div>
            <div>
              <label class="label">Byes</label>
              <input v-model.number="inn.extras.byes" type="number" min="0" class="input" :disabled="finalized" />
            </div>
            <div>
              <label class="label">Leg Byes</label>
              <input v-model.number="inn.extras.legByes" type="number" min="0" class="input" :disabled="finalized" />
            </div>
            <div>
              <label class="label">Penalty</label>
              <input v-model.number="inn.extras.penalty" type="number" min="0" class="input" :disabled="finalized" />
            </div>
          </div>

          <!-- Ball-by-Ball Tracking -->
          <div class="mt-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Ball-by-Ball Tracking</h3>
              <div class="text-sm text-gray-600">
                Over {{ inn.currentOver }}.{{ inn.currentBall }}
              </div>
            </div>

            <!-- Current Ball Entry Form -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 class="font-semibold text-blue-900 mb-3">Add Ball</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Runs</label>
                  <select v-model="newBall.runs" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Extras</label>
                  <select v-model="newBall.extras" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="none">None</option>
                    <option value="wide">Wide</option>
                    <option value="no-ball">No Ball</option>
                    <option value="bye">Bye</option>
                    <option value="leg-bye">Leg Bye</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Batsman</label>
                  <input v-model="newBall.batsman" type="text" placeholder="Batsman name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Bowler</label>
                  <input v-model="newBall.bowler" type="text" placeholder="Bowler name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <!-- Wicket Details -->
              <div v-if="newBall.wicket" class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">How Out</label>
                  <select v-model="newBall.wicketDetails.how" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select</option>
                    <option value="bowled">Bowled</option>
                    <option value="lbw">LBW</option>
                    <option value="caught">Caught</option>
                    <option value="run out">Run Out</option>
                    <option value="stumped">Stumped</option>
                    <option value="hit wicket">Hit Wicket</option>
                    <option value="retired hurt">Retired Hurt</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fielder</label>
                  <input v-model="newBall.wicketDetails.fielder" type="text" placeholder="Fielder name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Bowler (for wicket)</label>
                  <input v-model="newBall.wicketDetails.bowler" type="text" placeholder="Bowler name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              
              <div class="flex items-center gap-3 mt-4">
                <label class="flex items-center gap-2">
                  <input v-model="newBall.wicket" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span class="text-sm text-gray-700">Wicket</span>
                </label>
                <button @click="addBallToInnings(idx)" 
                        :disabled="finalized || !newBall.batsman || !newBall.bowler"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Add Ball
                </button>
                <button @click="resetNewBall" 
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Reset
                </button>
              </div>
            </div>

            <!-- Overs Display -->
            <div class="space-y-4">
              <div v-for="over in inn.overs" :key="over.overNumber" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h5 class="font-semibold text-gray-900">Over {{ over.overNumber }}</h5>
                    <div class="text-sm text-gray-600">
                      Bowler: {{ over.bowler }} | Runs: {{ over.totalRuns }} | Wickets: {{ over.totalWickets }}
                    </div>
                  </div>
                </div>
                
                <div class="p-4">
                  <div class="grid grid-cols-6 gap-2">
                    <div v-for="ball in over.balls" :key="`${over.overNumber}-${ball.ballNumber}`" 
                         class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                      <div class="text-sm font-medium text-gray-900">{{ ball.ballNumber }}</div>
                      <div class="text-lg font-bold" :class="{
                        'text-green-600': ball.runs === 4,
                        'text-purple-600': ball.runs === 6,
                        'text-red-600': ball.wicket && ball.wicket.how,
                        'text-blue-600': ball.extras !== 'none'
                      }">
                        {{ ball.runs }}{{ ball.extras !== 'none' ? '*' : '' }}
                      </div>
                      <div v-if="ball.extras !== 'none'" class="text-xs text-orange-600">
                        {{ ball.extras }}
                      </div>
                      <div v-if="ball.wicket && ball.wicket.how" class="text-xs text-red-600">
                        W
                      </div>
                      <div class="flex items-center justify-center gap-1 mt-1">
                        <button @click="toggleLikeBall(idx, over.overNumber, ball.ballNumber)" 
                                class="text-gray-400 hover:text-red-500 transition-colors">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                          </svg>
                        </button>
                        <span class="text-xs text-gray-500">{{ ball.likes }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Highlights / Summary -->
      <div class="card">
        <h2 class="card-title mb-3">Highlights</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="label">Top Scorer</label>
            <input v-model="form.summary.topScorer" class="input" :disabled="finalized" />
          </div>
          <div>
            <label class="label">Top Wicket-taker</label>
            <input v-model="form.summary.topWicketTaker" class="input" :disabled="finalized" />
          </div>
          <div>
            <label class="label">Best Contribution</label>
            <input v-model="form.summary.bestContribution" class="input" :disabled="finalized" />
          </div>
          <div>
            <label class="label">Player of the Match</label>
            <input v-model="form.summary.playerOfTheMatch" class="input" :disabled="finalized" />
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer Actions -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t p-3 flex items-center justify-end gap-2" v-if="!loading">
      <div class="mr-auto text-xs text-gray-500" v-if="validationMessage">{{ validationMessage }}</div>
      
      
      <button class="btn" @click="load" :disabled="loading">Reload</button>
      <button class="btn-primary" @click="save" :disabled="saving || finalized">Save</button>
      <button class="btn-success" @click="confirmFinalize" :disabled="saving || finalized">Finalize</button>
    </div>

    <!-- Confirm Finalize -->
    <div v-if="showFinalizeConfirm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-5 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-2">Finalize match?</h3>
        <p class="text-sm text-gray-600 mb-4">This will compute the winner and lock further editing. You can optionally mark as No Result or Cancelled, and provide a reason.</p>
        <div class="space-y-2 mb-4">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="finalizeOptions.noResult" />
            Mark as No Result
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="finalizeOptions.cancelled" />
            Mark as Cancelled
          </label>
          <div class="mt-2">
            <label class="block text-sm text-gray-600 mb-1">Reason (optional)</label>
            <select v-model="finalizeOptions.reasonPreset" class="input mb-2">
              <option value="">Select common reason</option>
              <option value="Rain/Weather">Rain/Weather</option>
              <option value="Ground unplayable">Ground unplayable</option>
              <option value="Team no-show">Team no-show</option>
              <option value="Injury/Medical emergency">Injury/Medical emergency</option>
              <option value="Light failure">Light failure</option>
            </select>
            <input v-model="finalizeOptions.reasonCustom" class="input" placeholder="Or enter specific reason" />
          </div>
        </div>
        <div class="flex items-center justify-end gap-2">
          <button class="btn" @click="showFinalizeConfirm = false">Cancel</button>
          <button class="btn-success" @click="finalize">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="reschedOpen" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-5 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-3">Reschedule Match</h3>
        <div class="space-y-3">
          <div>
            <label class="label">Date</label>
            <input v-model="resched.date" type="date" class="input" />
          </div>
          <div>
            <label class="label">Time</label>
            <select v-model="resched.time" class="input">
              <option v-for="t in timeSlotOptions" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div>
            <label class="label">Venue</label>
            <select v-model="resched.venue" class="input">
              <option v-for="v in venueOptions" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
          <div>
            <label class="label">Reason</label>
            <textarea v-model="resched.reason" rows="3" class="input"></textarea>
          </div>
          <div v-if="reschedError" class="text-sm text-red-600">{{ reschedError }}</div>
        </div>
        <div class="mt-4 flex items-center justify-end gap-2">
          <button class="btn" @click="reschedOpen=false">Cancel</button>
          <button class="btn-primary" :disabled="rescheduling" @click="submitReschedule">{{ rescheduling ? 'Saving...' : 'Save' }}</button>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../utils/api';
import { notify } from '../utils/notifications';

const route = useRoute();
const router = useRouter();
const tournamentId = route.params.id;
const matchId = route.params.matchId;

function goBack(){
  if (window.history.length > 1) router.back();
  else router.push({ name: 'tournament-details', params: { id: tournamentId } });
}

const loading = ref(false);
const saving = ref(false);
const error = ref('');
const finalized = ref(false);
const match = ref(null);
const tournament = ref(null);
const activeInnings = ref(0);
const showFinalizeConfirm = ref(false);
const finalizeOptions = reactive({ noResult: false, cancelled: false, reasonPreset: '', reasonCustom: '' });

const participantsOptions = ref([]);
const venueOptions = ref([]);
const timeSlotOptions = ref(['09:00', '13:00', '17:00']);
const reschedOpen = ref(false);
const rescheduling = ref(false);
const reschedError = ref('');
const resched = ref({ date: '', time: '09:00', venue: '', reason: '' });

// Ball-by-ball form data
const newBall = reactive({
  runs: 0,
  extras: 'none',
  wicket: false,
  batsman: '',
  bowler: '',
  wicketDetails: {
    how: '',
    fielder: '',
    bowler: ''
  }
});

function displayTeamName(id) {
  // Prefer names captured from the match payload for this specific fixture
  if (String(id) === String(form.homeClub) && form.homeName) return form.homeName;
  if (String(id) === String(form.awayClub) && form.awayName) return form.awayName;
  const t = participantsOptions.value.find(x => String(x.id) === String(id));
  return t?.name || 'Team';
}

const emptyInnings = () => ({
  battingClub: '',
  bowlingClub: '',
  battingCard: [],
  bowlingCard: [],
  extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
  // Ball-by-ball data
  overs: [],
  currentOver: 1,
  currentBall: 1
});

const form = reactive({
  homeClub: '', awayClub: '',
  date: '', time: '', venue: '', matchType: 'League', round: '',
  toss: { wonBy: '', decision: 'bat' },
  innings: [emptyInnings(), emptyInnings()],
  summary: { topScorer: '', topWicketTaker: '', bestContribution: '', playerOfTheMatch: '' },
  // display-only names from match payload
  homeName: '',
  awayName: ''
});

// Only show toss options for the two fixture teams
const tossTeamOptions = computed(() => {
  const opts = [];
  if (form.homeClub) opts.push({ id: form.homeClub, name: displayTeamName(form.homeClub) });
  if (form.awayClub) opts.push({ id: form.awayClub, name: displayTeamName(form.awayClub) });
  // Remove duplicates by id
  const seen = new Set();
  return opts.filter(o => (seen.has(String(o.id)) ? false : (seen.add(String(o.id)), true)));
});

// Only show teams that are actually playing in this match
const matchTeamOptions = computed(() => {
  const opts = [];
  if (form.homeClub) opts.push({ id: form.homeClub, name: displayTeamName(form.homeClub) });
  if (form.awayClub) opts.push({ id: form.awayClub, name: displayTeamName(form.awayClub) });
  // Remove duplicates by id
  const seen = new Set();
  return opts.filter(o => (seen.has(String(o.id)) ? false : (seen.add(String(o.id)), true)));
});

const currentStatus = computed(() => match.value?.status || 'Scheduled');

const tossHint = computed(() => {
  if (!form.toss.wonBy) return '';
  const name = displayTeamName(form.toss.wonBy);
  if (form.toss.decision === 'bat') return `${name} bats first`;
  if (form.toss.decision === 'bowl') return `${name} bowls first`;
  return '';
});

// Derived helpers
function toNum(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function toOvers(balls) { const b = Math.max(0, Number(balls) || 0); return Math.floor(b / 6) + (b % 6) / 10; }
function strikeRate(r, b) { r = Number(r)||0; b = Number(b)||0; return b > 0 ? ((r / b) * 100).toFixed(2) : '0.00'; }
function economy(r, b) { r = Number(r)||0; b = Number(b)||0; const ov = b/6; return ov > 0 ? (r / ov).toFixed(2) : '0.00'; }

function totals(idx) {
  const inn = form.innings[idx];
  if (!inn) return { runs: 0, wickets: 0, balls: 0, rr: '0.00' };
  
  // Use pre-calculated totals if available
  if (inn.totalRuns !== undefined && inn.totalWickets !== undefined && inn.totalBalls !== undefined) {
    const rr = inn.runRate ? inn.runRate.toFixed(2) : (inn.totalBalls > 0 ? (inn.totalRuns / (inn.totalBalls / 6)).toFixed(2) : '0.00');
    return {
      runs: inn.totalRuns,
      wickets: inn.totalWickets,
      balls: inn.totalBalls,
      rr
    };
  }
  
  // Fallback: calculate from individual entries
  let runs = 0, balls = 0, wickets = 0;
  for (const b of inn.battingCard) {
    runs += toNum(b.runs);
    balls += toNum(b.balls);
    const how = (b.dismissalHow || '').toLowerCase();
    if (how && how !== 'not out' && how !== 'retired hurt') wickets += 1;
  }
  const ex = inn.extras || {};
  runs += toNum(ex.wides) + toNum(ex.noBalls) + toNum(ex.byes) + toNum(ex.legByes) + toNum(ex.penalty);
  const rr = balls > 0 ? (runs / (balls / 6)).toFixed(2) : '0.00';
  
  // Update the innings with calculated values for consistency
  inn.totalRuns = runs;
  inn.totalWickets = wickets;
  inn.totalBalls = balls;
  inn.runRate = parseFloat(rr);
  
  return { runs, wickets, balls, rr };
}

function parseDismissalFromFields(b) {
  const how = (b.dismissalHow || '').trim();
  const f = (b.dismissalFielder || '').trim();
  const w = (b.dismissalBowler || '').trim();
  if (!how || how.toLowerCase() === 'not out') return null;
  const out = { how };
  if (f) out.fielder = f;
  if (w) out.bowler = w;
  return out;
}

function mapInningsFromAPI(inn) {
  return {
    battingClub: inn?.battingClub?._id || inn?.battingClub || '',
    bowlingClub: inn?.bowlingClub?._id || inn?.bowlingClub || '',
    battingCard: (inn?.battingCard || []).map(e => ({
      playerName: e.playerName || '',
      runs: e.runs ?? 0,
      balls: e.balls ?? 0,
      fours: e.fours ?? 0,
      sixes: e.sixes ?? 0,
      dismissalHow: (e.dismissal?.how || '').replace(/^\s+|\s+$/g, ''),
      dismissalFielder: e.dismissal?.fielder || '',
      dismissalBowler: e.dismissal?.bowler || '',
    })),
    bowlingCard: (inn?.bowlingCard || []).map(w => ({
      bowlerName: w.bowlerName || '',
      balls: w.balls ?? 0,
      maidens: w.maidens ?? 0,
      runs: w.runs ?? 0,
      wickets: w.wickets ?? 0,
    })),
    extras: {
      wides: inn?.extras?.wides || 0,
      noBalls: inn?.extras?.noBalls || 0,
      byes: inn?.extras?.byes || 0,
      legByes: inn?.extras?.legByes || 0,
      penalty: inn?.extras?.penalty || 0,
    },
    // Preserve calculated totals from backend
    totalRuns: inn?.totalRuns,
    totalWickets: inn?.totalWickets,
    totalBalls: inn?.totalBalls,
    oversString: typeof inn?.overs === 'string' ? inn.overs : undefined, // Cricket format overs (e.g., "15.3")
    runRate: inn?.runRate,
    // Legacy fields for backward compatibility
    runs: inn?.runs,
    wickets: inn?.wickets,
    balls: inn?.balls,
    // Ball-by-ball data
    overs: Array.isArray(inn?.overs) ? inn.overs : [], // Array of over objects
    currentOver: inn?.currentOver || 1,
    currentBall: inn?.currentBall || 1
  };
}

async function load() {
  loading.value = true; error.value = '';
  try {
    // Load tournament for participants for toss dropdown
    const tResp = await api.get(`/tournaments/${tournamentId}`);
    tournament.value = tResp.data || {};
    const regs = Array.isArray(tournament.value.registrations) ? tournament.value.registrations : [];
    const approvedClubs = regs.filter(r => r.status === 'approved').map(r => r.club).filter(Boolean);
    const baseParticipants = approvedClubs.length ? approvedClubs : (tournament.value.participants || []);
    participantsOptions.value = baseParticipants.map(p => ({ id: p._id || p, name: p.clubName || p.name || String(p) }));

    const { data } = await api.get(`/tournaments/${tournamentId}/matches/${matchId}`);
    match.value = data || {};
    finalized.value = !!data?.finalized || data?.status === 'Completed';

    // Populate read-only fixture fields
    form.homeClub = (data?.teams?.home?.id || data?.homeClub?._id || data?.homeClub) || '';
    form.awayClub = (data?.teams?.away?.id || data?.awayClub?._id || data?.awayClub) || '';
    form.homeName = data?.teams?.home?.name || data?.homeClub?.clubName || data?.homeClub?.name || '';
    form.awayName = data?.teams?.away?.name || data?.awayClub?.clubName || data?.awayClub?.name || '';
    form.date = data?.date ? String(data.date).slice(0, 10) : '';
    form.time = data?.time || '';
    form.venue = data?.venue || '';
    // Reschedule defaults
    resched.value = { date: form.date || '', time: form.time || timeSlotOptions.value[0], venue: form.venue || (venueOptions.value[0]||''), reason: '' };
    form.matchType = data?.matchType || (data?.stage === 'Knockout' && data?.round === 'Final' ? 'Final' : (data?.stage === 'Knockout' ? 'Knockout' : 'League'));
    form.round = data?.round || data?.stage || '';

    form.toss = {
      wonBy: (data?.toss?.wonBy && (data.toss.wonBy._id || data.toss.wonBy)) || '',
      decision: data?.toss?.decision || 'bat'
    };

    form.innings = (Array.isArray(data?.innings) && data.innings.length ? data.innings : [emptyInnings(), emptyInnings()])
      .slice(0, 2)
      .map(mapInningsFromAPI);

    form.summary = {
      topScorer: data?.summary?.topScorer || '',
      topWicketTaker: data?.summary?.topWicketTaker || '',
      bestContribution: data?.summary?.bestContribution || '',
      playerOfTheMatch: data?.summary?.playerOfTheMatch || '',
    };

    activeInnings.value = 0;
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to load match';
  } finally {
    loading.value = false;
  }
}

function validateBeforeSave() {
  // Basic checks for match details (no fixture validation needed)
  if (!form.date) return 'Select a date';
  if (!form.time) return 'Select a time';
  if (!form.venue) return 'Select a venue';
  
  // Validate toss if provided
  if (form.toss?.wonBy && !form.toss?.decision) {
    return 'Select toss decision (bat or bowl)';
  }
  
  return '';
}

const validationMessage = computed(() => validateBeforeSave());

async function save() {
  const msg = validateBeforeSave();
  if (msg) { notify.error(msg); return; }
  saving.value = true; error.value = '';
  try {
    // Ensure all innings have up-to-date calculated totals before saving
    form.innings.forEach((innings, index) => {
      if (innings.battingCard && innings.battingCard.length > 0) {
        // Recalculate totals to ensure consistency
        totals(index);
      }
    });
    
    const payload = {
      // Basic match metadata
      date: form.date,
      time: form.time,
      venue: form.venue,
      matchType: form.matchType,
      
      // Toss information
      toss: form.toss,
      
      // Innings data (now includes calculated totals)
      innings: form.innings,
      
      // Match summary
      summary: form.summary
    };
    
    // Use the match details endpoint instead of fixture endpoint
    await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/details`, payload);
    notify.success('Match details updated');
    await load();
  } catch (e) {
    console.error('Save error:', e);
    console.error('Error response:', e?.response?.data);
    const msg = e?.response?.data?.error || e?.response?.data?.message || e.message || 'Failed to save';
    error.value = msg;
    notify.error(msg);
  } finally {
    saving.value = false;
  }
}

function confirmFinalize() { showFinalizeConfirm.value = true; }
function openReschedule(){ reschedOpen.value = true; reschedError.value=''; }
async function submitReschedule(){
  if (!resched.value.date || !resched.value.time || !resched.value.venue || !resched.value.reason) { reschedError.value = 'All fields are required'; return; }
  rescheduling.value = true; reschedError.value = '';
  try {
    await api.post(`/admin/tournaments/${tournamentId}/matches/${matchId}/reschedule`, { ...resched.value });
    notify.success('Match rescheduled');
    reschedOpen.value = false;
    await load();
  } catch (e) {
    reschedError.value = e?.response?.data?.message || e.message || 'Failed to reschedule';
  } finally { rescheduling.value = false; }
}

async function finalize() {
  saving.value = true; error.value = '';
  try {
    const reason = (finalizeOptions.reasonCustom || finalizeOptions.reasonPreset || '').trim();
    const payload = { noResult: !!finalizeOptions.noResult, cancelled: !!finalizeOptions.cancelled, reason };
    await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/finalize`, payload);
    notify.success('Match finalized');
    showFinalizeConfirm.value = false;
    await load();
  } catch (e) {
    error.value = e?.response?.data?.message || e.message || 'Failed to finalize';
    notify.error(error.value);
  } finally {
    saving.value = false;
  }
}

async function unlockForEdit(){
  saving.value = true; error.value = '';
  try{
    await api.put(`/admin/tournaments/${tournamentId}/matches/${matchId}/unfinalize`);
    notify.success('Match unlocked for editing');
    await load();
  } catch(e){
    const msg = e?.response?.data?.message || e.message || 'Failed to unlock match';
    error.value = msg;
    notify.error(msg);
  } finally { saving.value = false; }
}

function addInnings() { if (form.innings.length < 2) form.innings.push(emptyInnings()); }
function removeInnings(i) { form.innings.splice(i, 1); if (activeInnings.value >= form.innings.length) activeInnings.value = Math.max(0, form.innings.length - 1); }
function addBatter(i) { form.innings[i].battingCard.push({ playerName: '', runs: 0, balls: 0, fours: 0, sixes: 0, dismissalHow: '' }); }
function addBowler(i) { form.innings[i].bowlingCard.push({ bowlerName: '', balls: 0, maidens: 0, runs: 0, wickets: 0 }); }

// Ball-by-ball logic functions
function addBall(inningsIndex, ballData) {
  const innings = form.innings[inningsIndex];
  if (!innings) return;
  
  const { runs, extras, wicket, batsman, bowler } = ballData;
  
  // Find or create current over
  let currentOver = innings.overs.find(o => o.overNumber === innings.currentOver);
  if (!currentOver) {
    currentOver = {
      overNumber: innings.currentOver,
      bowler: bowler,
      balls: [],
      totalRuns: 0,
      totalWickets: 0,
      totalExtras: 0
    };
    innings.overs.push(currentOver);
  }
  
  // Create ball entry
  const ball = {
    overNumber: innings.currentOver,
    ballNumber: innings.currentBall,
    runs: runs || 0,
    extras: extras || 'none',
    wicket: wicket || {},
    batsman: batsman || '',
    bowler: bowler || '',
    likes: 0
  };
  
  // Add ball to current over
  currentOver.balls.push(ball);
  
  // Update over totals
  currentOver.totalRuns += runs || 0;
  if (wicket && wicket.how) {
    currentOver.totalWickets += 1;
  }
  if (extras && extras !== 'none') {
    currentOver.totalExtras += 1;
  }
  
  // Handle ball progression logic
  if (extras === 'wide' || extras === 'no-ball') {
    // Wide/No-ball doesn't count as legal delivery, don't advance ball
    // But add 1 run for the extra
    currentOver.totalRuns += 1;
  } else {
    // Legal delivery, advance ball
    if (innings.currentBall < 6) {
      innings.currentBall += 1;
    } else {
      // Over complete, start new over
      innings.currentOver += 1;
      innings.currentBall = 1;
    }
  }
  
  // Update innings totals
  calculateInningsTotals(inningsIndex);
  
  // Auto-update batsman and bowler stats
  updateBatsmanStats(inningsIndex, batsman, runs, wicket);
  updateBowlerStats(inningsIndex, bowler, runs, wicket);
}

function toggleLikeBall(inningsIndex, overNumber, ballNumber) {
  const innings = form.innings[inningsIndex];
  if (!innings) return;
  
  const over = innings.overs.find(o => o.overNumber === overNumber);
  if (!over) return;
  
  const ball = over.balls.find(b => b.ballNumber === ballNumber);
  if (!ball) return;
  
  ball.likes += 1;
}

function calculateInningsTotals(inningsIndex) {
  const innings = form.innings[inningsIndex];
  if (!innings) return;
  
  let totalRuns = 0;
  let totalWickets = 0;
  let totalBalls = 0;
  let totalExtras = 0;
  
  // Calculate from overs
  innings.overs.forEach(over => {
    over.balls.forEach(ball => {
      totalRuns += ball.runs;
      if (ball.extras === 'wide' || ball.extras === 'no-ball') {
        totalRuns += 1; // Extra run for wide/no-ball
        totalExtras += 1;
      } else if (ball.extras === 'bye' || ball.extras === 'leg-bye') {
        totalExtras += 1;
      }
      
      if (ball.wicket && ball.wicket.how) {
        totalWickets += 1;
      }
      
      // Only count legal deliveries
      if (ball.extras === 'none' || ball.extras === 'bye' || ball.extras === 'leg-bye') {
        totalBalls += 1;
      }
    });
  });
  
  // Update innings totals (both legacy and standardized fields)
  innings.runs = totalRuns;
  innings.wickets = totalWickets;
  innings.balls = totalBalls;
  
  // Update standardized fields
  innings.totalRuns = totalRuns;
  innings.totalWickets = totalWickets;
  innings.totalBalls = totalBalls;
  
  // Calculate and update overs string (e.g., "15.3")
  const completeOvers = Math.floor(totalBalls / 6);
  const remainingBalls = totalBalls % 6;
  innings.oversString = remainingBalls > 0 ? `${completeOvers}.${remainingBalls}` : `${completeOvers}.0`;
  
  // Calculate and update run rate
  innings.runRate = totalBalls > 0 ? parseFloat((totalRuns / (totalBalls / 6)).toFixed(2)) : 0;
  
  // Update extras breakdown
  innings.extras.wides = innings.overs.reduce((sum, over) => 
    sum + over.balls.filter(b => b.extras === 'wide').length, 0);
  innings.extras.noBalls = innings.overs.reduce((sum, over) => 
    sum + over.balls.filter(b => b.extras === 'no-ball').length, 0);
  innings.extras.byes = innings.overs.reduce((sum, over) => 
    sum + over.balls.filter(b => b.extras === 'bye').length, 0);
  innings.extras.legByes = innings.overs.reduce((sum, over) => 
    sum + over.balls.filter(b => b.extras === 'leg-bye').length, 0);
}

function getCurrentOver(inningsIndex) {
  const innings = form.innings[inningsIndex];
  if (!innings) return null;
  
  return innings.overs.find(o => o.overNumber === innings.currentOver) || null;
}

function getCurrentBallNumber(inningsIndex) {
  const innings = form.innings[inningsIndex];
  if (!innings) return 1;
  
  const currentOver = getCurrentOver(inningsIndex);
  if (!currentOver) return 1;
  
  return currentOver.balls.length + 1;
}

// Ball-by-ball UI helper functions
function addBallToInnings(inningsIndex) {
  const ballData = {
    runs: parseInt(newBall.runs) || 0,
    extras: newBall.extras,
    wicket: newBall.wicket ? newBall.wicketDetails : null,
    batsman: newBall.batsman,
    bowler: newBall.bowler
  };
  
  addBall(inningsIndex, ballData);
  resetNewBall();
}

function resetNewBall() {
  newBall.runs = 0;
  newBall.extras = 'none';
  newBall.wicket = false;
  newBall.batsman = '';
  newBall.bowler = '';
  newBall.wicketDetails = {
    how: '',
    fielder: '',
    bowler: ''
  };
}

// Auto-update functions for batsman and bowler stats
function updateBatsmanStats(inningsIndex, batsmanName, runs, wicket) {
  const innings = form.innings[inningsIndex];
  if (!innings || !batsmanName) return;
  
  // Find or create batsman entry
  let batsman = innings.battingCard.find(b => b.playerName === batsmanName);
  if (!batsman) {
    batsman = {
      playerName: batsmanName,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      dismissalHow: ''
    };
    innings.battingCard.push(batsman);
  }
  
  // Update stats
  batsman.runs += runs || 0;
  if (runs === 4) batsman.fours += 1;
  if (runs === 6) batsman.sixes += 1;
  
  // Only count legal deliveries (not wides/no-balls)
  if (runs !== undefined) {
    batsman.balls += 1;
  }
  
  // Update dismissal if wicket
  if (wicket && wicket.how) {
    batsman.dismissalHow = wicket.how;
    batsman.dismissalFielder = wicket.fielder || '';
    batsman.dismissalBowler = wicket.bowler || '';
  }
}

function updateBowlerStats(inningsIndex, bowlerName, runs, wicket) {
  const innings = form.innings[inningsIndex];
  if (!innings || !bowlerName) return;
  
  // Find or create bowler entry
  let bowler = innings.bowlingCard.find(b => b.bowlerName === bowlerName);
  if (!bowler) {
    bowler = {
      bowlerName: bowlerName,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0
    };
    innings.bowlingCard.push(bowler);
  }
  
  // Update stats
  bowler.runs += runs || 0;
  bowler.balls += 1; // Count all deliveries for bowler
  
  // Update wickets
  if (wicket && wicket.how) {
    bowler.wickets += 1;
  }
}

// Auto update innings based on toss decision
watch(() => [form.toss.wonBy, form.toss.decision, form.homeClub, form.awayClub], () => {
  if (form.toss.wonBy && form.toss.decision && form.homeClub && form.awayClub) {
    const tossWinner = form.toss.wonBy;
    const tossLoser = tossWinner === form.homeClub ? form.awayClub : form.homeClub;
    
    // Determine batting and bowling teams based on toss decision
    let firstInningsBatting, firstInningsBowling, secondInningsBatting, secondInningsBowling;
    
    if (form.toss.decision === 'bat') {
      // Toss winner bats first
      firstInningsBatting = tossWinner;
      firstInningsBowling = tossLoser;
      secondInningsBatting = tossLoser;
      secondInningsBowling = tossWinner;
    } else if (form.toss.decision === 'bowl') {
      // Toss winner bowls first
      firstInningsBatting = tossLoser;
      firstInningsBowling = tossWinner;
      secondInningsBatting = tossWinner;
      secondInningsBowling = tossLoser;
    }
    
    // Update innings 1
    if (form.innings[0]) {
      form.innings[0].battingClub = firstInningsBatting;
      form.innings[0].bowlingClub = firstInningsBowling;
    }
    
    // Update innings 2
    if (form.innings[1]) {
      form.innings[1].battingClub = secondInningsBatting;
      form.innings[1].bowlingClub = secondInningsBowling;
    }
  }
}, { deep: true });

// Auto update player of the match suggestion
watch(() => form.innings.map(i => ({ bats: i.battingCard, bowls: i.bowlingCard })), () => {
  try {
    const allBats = form.innings.flatMap(i => i.battingCard);
    const allBowls = form.innings.flatMap(i => i.bowlingCard);
    const topBat = [...allBats].sort((a,b) => (b.runs||0) - (a.runs||0))[0];
    const topBowl = [...allBowls].sort((a,b) => (b.wickets||0) - (a.wickets||0) || (a.runs||0) - (b.runs||0))[0];
    if (!form.summary.playerOfTheMatch) {
      if (topBat && topBat.playerName) form.summary.playerOfTheMatch = `${topBat.playerName}`;
      else if (topBowl && topBowl.bowlerName) form.summary.playerOfTheMatch = `${topBowl.bowlerName}`;
    }
  } catch {}
}, { deep: true });

load();
</script>

<style scoped>
.container { max-width: 1100px; }
.input { @apply w-full border rounded px-3 py-2 bg-white; }
.label { @apply text-sm text-gray-600; }
.card { @apply bg-white p-4 rounded shadow; }
.card-title { @apply text-lg font-semibold; }
.btn { @apply px-3 py-2 bg-gray-200 rounded; }
.btn-primary { @apply px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60; }
.btn-success { @apply px-3 py-2 bg-green-600 text-white rounded disabled:opacity-60; }
.btn-danger { @apply px-3 py-2 bg-red-100 text-red-700 rounded; }
.tab { @apply px-3 py-2 text-sm rounded-t hover:bg-gray-100; }
.tab-active { @apply bg-white border-x border-t -mb-px; }
.kpi { @apply bg-gray-50 border rounded p-3; }
.kpi-label { @apply text-xs text-gray-600; }
.kpi-value { @apply text-xl font-semibold; }
</style>