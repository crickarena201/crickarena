<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Live Update Indicator -->
    <div v-if="match && !loading" class="fixed top-4 right-4 z-50">
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-600">Live Updates</span>
        <button @click="loadMatch" 
                :disabled="loading"
                class="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Update Notification -->
    <div v-if="showUpdateNotification" class="fixed top-20 right-4 z-50 animate-fade-in-up">
      <div class="bg-green-500 text-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span class="text-sm">Match updated!</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading match details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Match</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="loadMatch" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Match Details -->
    <div v-else-if="match" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <!-- Tournament Info -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold">{{ tournamentName || 'Tournament' }}</h1>
              <p class="text-blue-100">{{ match.round || match.stage || 'Match' }} • {{ match.venue || 'Venue TBD' }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-blue-100">{{ formatDate(match.date) }}</div>
              <div class="text-lg font-semibold">{{ formatTime(match.time) }}</div>
            </div>
          </div>
        </div>

        <!-- Live Score Display -->
        <div v-if="match.status === 'Live' || match.status === 'Completed'" class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-center flex-1">
              <div class="text-sm text-gray-600 mb-1">{{ match.teams?.home?.name }}</div>
              <div class="text-4xl font-bold text-gray-900">{{ getTeamScore(match, 'home') }}</div>
              <div class="text-sm text-gray-500">{{ getTeamOvers(match, 'home') }} overs</div>
            </div>
          <div class="text-center mx-8">
            <div class="text-lg font-bold text-gray-400">VS</div>
            <div v-if="match.status === 'Live'" class="text-xs text-green-600 animate-pulse font-semibold">LIVE</div>
            <div v-else class="text-xs text-gray-500">COMPLETED</div>
          </div>
            <div class="text-center flex-1">
              <div class="text-sm text-gray-600 mb-1">{{ match.teams?.away?.name }}</div>
              <div class="text-4xl font-bold text-gray-900">{{ getTeamScore(match, 'away') }}</div>
              <div class="text-sm text-gray-500">{{ getTeamOvers(match, 'away') }} overs</div>
            </div>
          </div>
          
          <!-- Match Result -->
          <div v-if="match.status === 'Completed' && match.result" class="mt-4 text-center">
            <div class="bg-white/80 rounded-lg p-4">
              <div class="text-lg font-bold text-gray-900 mb-1">{{ match.result.summary || 'Match Completed' }}</div>
              <div v-if="match.result.winner" class="text-sm text-gray-600">
                Winner: {{ getTeamNameById(match.result.winner) }}
              </div>
              <div v-if="match.result.margin" class="text-sm text-gray-500">
                {{ match.result.margin }}
              </div>
              <div v-if="!match.result.winner && match.result.isNoResult" class="text-sm text-gray-600 mt-1">
                Reason: {{ (match.result.summary || '').replace(/^No result:?\s*/i, '') || '—' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Match Status -->
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="match.teams?.home?.logoUrl" :src="match.teams.home.logoUrl" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-semibold text-gray-600">{{ match.teams?.home?.name?.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-semibold text-gray-900">{{ match.teams?.home?.name }}</div>
                <div class="text-sm text-gray-500">Home</div>
              </div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-400">VS</div>
              <div class="text-xs text-gray-500">{{ match.matchType || 'League' }}</div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="font-semibold text-gray-900">{{ match.teams?.away?.name }}</div>
                <div class="text-sm text-gray-500">Away</div>
              </div>
              <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="match.teams?.away?.logoUrl" :src="match.teams.away.logoUrl" class="w-full h-full object-cover" />
                <span v-else class="text-sm font-semibold text-gray-600">{{ match.teams?.away?.name?.charAt(0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Match Tabs -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button v-for="tab in tabs" :key="tab.key" 
                    @click="activeTab = tab.key"
                    :class="[
                      'px-6 py-4 text-sm font-medium transition-colors',
                      activeTab === tab.key 
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    ]">
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <!-- Match Summary -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  {{ match.teams?.home?.name }} - Batting
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Score:</span>
                    <span class="font-semibold">{{ getTeamScore(match, 'home') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Overs:</span>
                    <span class="font-semibold">{{ getTeamOvers(match, 'home') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Run Rate:</span>
                    <span class="font-semibold">{{ getTeamRunRate(match, 'home') }}</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  {{ match.teams?.away?.name }} - Batting
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total Score:</span>
                    <span class="font-semibold">{{ getTeamScore(match, 'away') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Overs:</span>
                    <span class="font-semibold">{{ getTeamOvers(match, 'away') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Run Rate:</span>
                    <span class="font-semibold">{{ getTeamRunRate(match, 'away') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toss Information -->
            <div v-if="match.toss?.wonBy" class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Toss Information
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <div class="text-sm text-gray-600">Toss Won By:</div>
                  <div class="font-semibold text-gray-900">{{ getTossWinnerName(match) }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Decision:</div>
                  <div class="font-semibold text-gray-900 capitalize">{{ match.toss.decision || 'Not decided' }}</div>
                </div>
              </div>
            </div>

            <!-- Match Summary -->
            <div v-if="match.summary && Object.keys(match.summary).length > 0" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Match Summary
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div v-if="match.summary.topScorer">
                  <div class="text-sm text-gray-600">Top Scorer:</div>
                  <div class="font-semibold text-gray-900">{{ match.summary.topScorer }}</div>
                </div>
                <div v-if="match.summary.topWicketTaker">
                  <div class="text-sm text-gray-600">Top Wicket Taker:</div>
                  <div class="font-semibold text-gray-900">{{ match.summary.topWicketTaker }}</div>
                </div>
                <div v-if="match.summary.playerOfTheMatch">
                  <div class="text-sm text-gray-600">Player of the Match:</div>
                  <div class="font-semibold text-gray-900">{{ match.summary.playerOfTheMatch }}</div>
                </div>
                <div v-if="match.summary.bestContribution">
                  <div class="text-sm text-gray-600">Best Contribution:</div>
                  <div class="font-semibold text-gray-900">{{ match.summary.bestContribution }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lineups Tab -->
          <div v-if="activeTab === 'lineups'" class="space-y-6">
            <!-- Loading State -->
            <div v-if="rostersLoading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p class="text-gray-600 mt-4">Loading lineups...</p>
            </div>

            <!-- Lineups Display -->
            <div v-else class="grid md:grid-cols-2 gap-6">
              <!-- Home Team Lineup -->
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ rosters?.homeTeam?.club?.name || 'Home Team' }}
                  </h3>
                </div>
                
                <div class="p-6">
                  <div v-if="rosters?.homeTeam?.roster" class="space-y-4">
                    <div class="text-sm text-gray-600 mb-4">
                      Submitted: {{ formatRosterDate(rosters.homeTeam.roster.submittedAt) }}
                    </div>
                    <div class="space-y-3">
                      <div v-for="(player, index) in rosters.homeTeam.roster.players" :key="player.playerId" 
                           class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {{ index + 1 }}
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">{{ player.playerName }}</div>
                            <div class="text-sm text-gray-600">{{ player.position }}</div>
                          </div>
                        </div>
                        <div v-if="player.jerseyNumber" class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          #{{ player.jerseyNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="text-gray-500 font-medium">Lineup Not Submitted</p>
                    <p class="text-sm text-gray-400">Team lineup will appear here once submitted</p>
                  </div>
                </div>
              </div>

              <!-- Away Team Lineup -->
              <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4">
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ rosters?.awayTeam?.club?.name || 'Away Team' }}
                  </h3>
                </div>
                
                <div class="p-6">
                  <div v-if="rosters?.awayTeam?.roster" class="space-y-4">
                    <div class="text-sm text-gray-600 mb-4">
                      Submitted: {{ formatRosterDate(rosters.awayTeam.roster.submittedAt) }}
                    </div>
                    <div class="space-y-3">
                      <div v-for="(player, index) in rosters.awayTeam.roster.players" :key="player.playerId" 
                           class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {{ index + 1 }}
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">{{ player.playerName }}</div>
                            <div class="text-sm text-gray-600">{{ player.position }}</div>
                          </div>
                        </div>
                        <div v-if="player.jerseyNumber" class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                          #{{ player.jerseyNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-else class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <p class="text-gray-500 font-medium">Lineup Not Submitted</p>
                    <p class="text-sm text-gray-400">Team lineup will appear here once submitted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Scorecard Tab -->
          <div v-if="activeTab === 'scorecard'" class="space-y-6">
            <!-- Innings Display -->
            <div v-for="(innings, index) in match.innings" :key="index" class="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4">
                <h3 class="text-lg font-semibold">
                  {{ getInningsTitle(innings, index) }}
                </h3>
              </div>
              
              <div class="p-6">
                <!-- Innings Summary -->
                <div class="grid md:grid-cols-4 gap-4 mb-6">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ innings.totalRuns || innings.runs || 0 }}</div>
                    <div class="text-sm text-gray-600">Total Runs</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ innings.totalWickets || innings.wickets || 0 }}</div>
                    <div class="text-sm text-gray-600">Wickets</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ (innings.overs && typeof innings.overs === 'string') ? innings.overs : (innings.oversString || toOvers(innings.totalBalls || innings.balls || 0)) }}</div>
                    <div class="text-sm text-gray-600">Overs</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">{{ innings.runRate ? innings.runRate.toFixed(2) : getInningsRunRate(innings) }}</div>
                    <div class="text-sm text-gray-600">Run Rate</div>
                  </div>
                </div>

                <!-- Batting Scorecard -->
                <div v-if="innings.battingCard && innings.battingCard.length > 0" class="mb-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Batting Scorecard</h4>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batsman</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Balls</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">4s</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">6s</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(batsman, bi) in innings.battingCard" :key="bi">
                          <td class="px-4 py-3">
                            <div class="flex items-center gap-2">
                              <span class="font-medium">{{ batsman.playerName }}</span>
                            </div>
                          </td>
                          <td class="px-4 py-3 text-center">{{ batsman.runs || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ batsman.balls || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ batsman.fours || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ batsman.sixes || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ getStrikeRate(batsman.runs, batsman.balls) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Bowling Scorecard -->
                <div v-if="innings.bowlingCard && innings.bowlingCard.length > 0">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Bowling Scorecard</h4>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bowler</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Overs</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Maidens</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Wickets</th>
                          <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Economy</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(bowler, wi) in innings.bowlingCard" :key="wi">
                          <td class="px-4 py-3">
                            <span class="font-medium">{{ bowler.bowlerName }}</span>
                          </td>
                          <td class="px-4 py-3 text-center">{{ toOvers(bowler.balls) }}</td>
                          <td class="px-4 py-3 text-center">{{ bowler.maidens || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ bowler.runs || 0 }}</td>
                          <td class="px-4 py-3 text-center font-medium text-red-600">{{ bowler.wickets || 0 }}</td>
                          <td class="px-4 py-3 text-center">{{ getEconomy(bowler.runs, bowler.balls) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Tab -->
          <div v-if="activeTab === 'timeline'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Match Timeline</h3>
              </div>
              <div class="p-6">
                <div class="text-center text-gray-500 py-8">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-lg font-medium">Timeline Coming Soon</p>
                  <p class="text-sm">Match events and timeline will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" class="space-y-6">
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h4 class="font-semibold text-gray-900 mb-3">Boundaries</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">4s:</span>
                    <span class="font-semibold">{{ getTotalBoundaries(match, 4) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">6s:</span>
                    <span class="font-semibold">{{ getTotalBoundaries(match, 6) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                <h4 class="font-semibold text-gray-900 mb-3">Wickets</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Total:</span>
                    <span class="font-semibold">{{ getTotalWickets(match) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Bowled:</span>
                    <span class="font-semibold">{{ getBowledWickets(match) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h4 class="font-semibold text-gray-900 mb-3">Extras</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Wides:</span>
                    <span class="font-semibold">{{ getTotalExtras(match, 'wides') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">No Balls:</span>
                    <span class="font-semibold">{{ getTotalExtras(match, 'noBalls') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../utils/api';

const route = useRoute();
const router = useRouter();

// Reactive data
const loading = ref(true);
const error = ref('');
const match = ref(null);
const tournamentName = computed(() => match.value?.tournament?.name || match.value?.tournament?.title || '');
const activeTab = ref('overview');
const lastUpdate = ref(null);
const showUpdateNotification = ref(false);

// Roster data
const rosters = ref(null);
const rostersLoading = ref(false);

// Live update interval
let updateInterval = null;

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'lineups', label: 'Lineups' },
  { key: 'scorecard', label: 'Scorecard' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'analytics', label: 'Analytics' }
];

// Helper functions
function formatDate(dateString) {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  if (!timeString) return 'TBD';
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Get team score from innings data
function getTeamScore(match, teamType) {
  if (!match.innings || !Array.isArray(match.innings)) return '0/0';
  
  const teamId = match.teams?.[teamType]?.id;
  if (!teamId) return '0/0';
  
  const battingInnings = match.innings.find(inn => String(inn.battingClub) === String(teamId));
  if (!battingInnings) return '0/0';
  
  // Use standardized fields with fallbacks
  const runs = battingInnings.totalRuns || battingInnings.runs || 0;
  const wickets = battingInnings.totalWickets || battingInnings.wickets || 0;
  return `${runs}/${wickets}`;
}

// Get team overs from innings data
function getTeamOvers(match, teamType) {
  if (!match.innings || !Array.isArray(match.innings)) return '0.0';
  
  const teamId = match.teams?.[teamType]?.id;
  if (!teamId) return '0.0';
  
  const battingInnings = match.innings.find(inn => String(inn.battingClub) === String(teamId));
  if (!battingInnings) return '0.0';
  
  // Use standardized overs field with fallback calculation
  if (battingInnings.overs && typeof battingInnings.overs === 'string') return battingInnings.overs;
  if (battingInnings.oversString) return battingInnings.oversString;
  
  // Fallback: calculate from balls
  const balls = battingInnings.totalBalls || battingInnings.balls || 0;
  return toOvers(balls);
}

// Get team run rate from innings data
function getTeamRunRate(match, teamType) {
  if (!match.innings || !Array.isArray(match.innings)) return '0.00';
  
  const teamId = match.teams?.[teamType]?.id;
  if (!teamId) return '0.00';
  
  const battingInnings = match.innings.find(inn => String(inn.battingClub) === String(teamId));
  if (!battingInnings) return '0.00';
  
  // Use pre-calculated run rate if available
  if (battingInnings.runRate !== undefined) {
    return battingInnings.runRate.toFixed(2);
  }
  
  // Fallback calculation
  const runs = battingInnings.totalRuns || battingInnings.runs || 0;
  const balls = battingInnings.totalBalls || battingInnings.balls || 0;
  const overs = balls / 6;
  
  return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
}

// Get toss winner name
function getTossWinnerName(match) {
  if (!match.toss?.wonBy) return 'Not decided';
  
  const tossWinnerId = String(match.toss.wonBy);
  const homeTeamId = String(match.teams?.home?.id);
  const awayTeamId = String(match.teams?.away?.id);
  
  if (tossWinnerId === homeTeamId) {
    return match.teams?.home?.name || 'Home Team';
  } else if (tossWinnerId === awayTeamId) {
    return match.teams?.away?.name || 'Away Team';
  }
  
  return 'Unknown Team';
}

// Get innings title
function getInningsTitle(innings, index) {
  const teamName = getTeamNameById(innings.battingClub);
  return `Innings ${index + 1} - ${teamName} Batting`;
}

// Get team name by ID
function getTeamNameById(teamId) {
  if (!match.value?.teams) return 'Unknown Team';
  
  if (String(match.value.teams.home?.id) === String(teamId)) {
    return match.value.teams.home.name;
  } else if (String(match.value.teams.away?.id) === String(teamId)) {
    return match.value.teams.away.name;
  }
  
  return 'Unknown Team';
}

// Get innings run rate
function toOvers(balls) {
  const b = Number(balls) || 0;
  if (b <= 0) return '0.0';
  const ov = Math.floor(b / 6) + (b % 6) / 10;
  return ov.toFixed(1);
}

function getInningsRunRate(innings) {
  const runs = Number(innings.runs || innings.totalRuns || 0);
  const balls = Number(innings.balls || 0);
  const overs = balls > 0 ? (balls / 6) : 0;
  return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
}

// Get strike rate
function getStrikeRate(runs, balls) {
  if (!runs || !balls || balls === 0) return '0.00';
  return ((runs / balls) * 100).toFixed(2);
}

// Get economy rate
function getEconomy(runs, balls) {
  const r = Number(runs) || 0;
  const b = Number(balls) || 0;
  const overs = b / 6;
  return overs > 0 ? (r / overs).toFixed(2) : '0.00';
}

// Get total boundaries
function getTotalBoundaries(match, type) {
  if (!match.innings || !Array.isArray(match.innings)) return 0;
  
  return match.innings.reduce((total, innings) => {
    if (!innings.battingCard || !Array.isArray(innings.battingCard)) return total;
    
    return total + innings.battingCard.reduce((sum, batsman) => {
      return sum + (type === 4 ? (batsman.fours || 0) : (batsman.sixes || 0));
    }, 0);
  }, 0);
}

// Get total wickets
function getTotalWickets(match) {
  if (!match.innings || !Array.isArray(match.innings)) return 0;
  
  return match.innings.reduce((total, innings) => {
    return total + (innings.wickets || 0);
  }, 0);
}

// Get bowled wickets
function getBowledWickets(match) {
  if (!match.innings || !Array.isArray(match.innings)) return 0;
  
  return match.innings.reduce((total, innings) => {
    if (!innings.bowlingCard || !Array.isArray(innings.bowlingCard)) return total;
    
    return total + innings.bowlingCard.reduce((sum, bowler) => {
      return sum + (bowler.wickets || 0);
    }, 0);
  }, 0);
}

// Get total extras
function getTotalExtras(match, type) {
  if (!match.innings || !Array.isArray(match.innings)) return 0;
  
  return match.innings.reduce((total, innings) => {
    if (!innings.extras) return total;
    
    switch (type) {
      case 'wides': return total + (innings.extras.wides || 0);
      case 'noBalls': return total + (innings.extras.noBalls || 0);
      case 'byes': return total + (innings.extras.byes || 0);
      case 'legByes': return total + (innings.extras.legByes || 0);
      default: return total;
    }
  }, 0);
}

// Load roster data
async function loadRosters() {
  if (!match.value?._id) return;
  
  try {
    rostersLoading.value = true;
    const { data } = await api.get(`/matches/${match.value._id}/roster`);
    rosters.value = data;
  } catch (err) {
    console.error('Error loading rosters:', err);
    // Don't show error for rosters as it's not critical
    rosters.value = null;
  } finally {
    rostersLoading.value = false;
  }
}

// Format roster submission date
function formatRosterDate(dateString) {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Load match data
async function loadMatch() {
  try {
    loading.value = true;
    error.value = '';
    
    const tournamentId = route.params.id;
    const matchId = route.params.matchId;
    
    const { data } = await api.get(`/tournaments/${tournamentId}/matches/${matchId}`);
    
    // Transform backend data to match frontend expectations
    // Backend provides homeClub and awayClub, but frontend expects teams.home and teams.away
    const transformedData = {
      ...data,
      teams: {
        home: {
          id: data.homeClub?._id || data.homeClub?.id,
          name: data.homeClub?.clubName || data.homeClub?.name || 'Home Team',
          logoUrl: data.homeClub?.logoUrl
        },
        away: {
          id: data.awayClub?._id || data.awayClub?.id,
          name: data.awayClub?.clubName || data.awayClub?.name || 'Away Team',
          logoUrl: data.awayClub?.logoUrl
        }
      }
    };
    
    // Check if this is an update (not initial load)
    if (match.value && lastUpdate.value) {
      const hasChanges = JSON.stringify(match.value) !== JSON.stringify(transformedData);
      if (hasChanges) {
        showUpdateNotification.value = true;
        setTimeout(() => {
          showUpdateNotification.value = false;
        }, 3000);
      }
    }
    
    match.value = transformedData;
    lastUpdate.value = new Date();
    
    // Load rosters after match is loaded
    await loadRosters();
  } catch (err) {
    console.error('Error loading match:', err);
    error.value = err?.response?.data?.message || 'Failed to load match details';
  } finally {
    loading.value = false;
  }
}

// Start live updates
function startLiveUpdates() {
  // Update every 15 seconds for live matches, 60 seconds for other matches
  const interval = match.value?.status === 'Live' ? 15000 : 60000;
  updateInterval = setInterval(loadMatch, interval);
}

// Stop live updates
function stopLiveUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

// Lifecycle hooks
onMounted(async () => {
  await loadMatch();
  startLiveUpdates();
});

onUnmounted(() => {
  stopLiveUpdates();
});
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
</style>