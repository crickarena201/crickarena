<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tournament Management</h1>
        <p class="text-gray-600 mt-1">Create, manage and oversee cricket tournaments</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="showCreateModal = true" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create Tournament
        </button>
        <button @click="refreshTournaments" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Tournaments</p>
            <p class="text-2xl font-bold text-gray-900">{{ tournaments.length }}</p>
          </div>
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active</p>
            <p class="text-2xl font-bold text-green-600">{{ activeTournaments }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Upcoming</p>
            <p class="text-2xl font-bold text-blue-600">{{ upcomingTournaments }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-purple-600">{{ completedTournaments }}</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Status:</label>
          <select v-model="selectedStatus" @change="filterTournaments" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Format:</label>
          <select v-model="selectedFormat" @change="filterTournaments" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">All Formats</option>
            <option value="league">League</option>
            <option value="knockout">Knockout</option>
            <option value="league+playoff">League + Playoff</option>
            <option value="round-robin">Round Robin</option>
          </select>
        </div>

        <div class="flex-1 min-w-64">
          <input v-model="searchQuery" @input="debounceSearch" type="text" placeholder="Search tournaments..."
                 class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        </div>
      </div>
    </div>

    <!-- Tournaments List -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Tournaments
          <span class="text-sm font-normal text-gray-500 ml-2">({{ filteredTournaments.length }} tournaments)</span>
        </h3>
      </div>

      <div class="divide-y divide-gray-200">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading tournaments...</p>
        </div>

        <div v-else-if="filteredTournaments.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">No tournaments found</p>
        </div>

        <div v-else v-for="tournament in filteredTournaments" :key="tournament._id" class="p-6 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ tournament.name }}</h4>
                  <p class="text-sm text-gray-600">{{ tournament.district }} • {{ tournament.format }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-500">Duration</p>
                  <p class="text-sm font-medium">{{ formatDate(tournament.startDate) }} - {{ formatDate(tournament.endDate) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Teams</p>
                  <p class="text-sm font-medium">{{ tournament.participants?.length || 0 }} / {{ tournament.maxTeams }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Entry Fee</p>
                  <p class="text-sm font-medium">₹{{ tournament.entryFee || 0 }}</p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <span class="px-3 py-1 text-xs rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': tournament.status === 'open',
                        'bg-blue-100 text-blue-800': tournament.status === 'ongoing',
                        'bg-yellow-100 text-yellow-800': tournament.status === 'upcoming',
                        'bg-purple-100 text-purple-800': tournament.status === 'completed',
                        'bg-red-100 text-red-800': tournament.status === 'cancelled'
                      }">
                  {{ tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1) }}
                </span>

                <div class="flex items-center gap-2">
                  <button @click="viewTournamentDetails(tournament)"
                          class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    View Details
                  </button>

                  <button v-if="tournament.status === 'open'" @click="closeRegistrations(tournament)"
                          class="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                    Close Reg
                  </button>

                  <button v-if="tournament.status === 'upcoming'" @click="openRegistrations(tournament)"
                          class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                    Open Reg
                  </button>


                  <button v-if="tournament.status !== 'cancelled' && tournament.status !== 'completed' && tournament.format === 'groups+knockouts'"
                          @click="seedKnockout(tournament)"
                          class="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                    Seed Knockout
                  </button>

                  <button v-if="tournament.status !== 'completed' && tournament.status !== 'cancelled'" @click="cancelTournament(tournament)"
                          class="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Tournament Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">Create New Tournament</h3>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="createTournament" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tournament Name *</label>
              <input v-model="newTournament.name" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Format *</label>
              <select v-model="newTournament.format" required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
                <option value="league">League</option>
                <option value="knockout">Knockout</option>
                <option value="league+playoff">League + Playoff</option>
                <option value="round-robin">Round Robin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <input v-model="newTournament.district" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Teams *</label>
              <input v-model.number="newTournament.maxTeams" type="number" min="2" max="128" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input v-model="newTournament.startDate" type="date" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input v-model="newTournament.endDate" type="date" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
              <input v-model="newTournament.registrationDeadline" type="date"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Entry Fee (₹)</label>
              <input v-model.number="newTournament.entryFee" type="number" min="0"
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea v-model="newTournament.description" rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rules *</label>
            <textarea v-model="newTournament.rules" rows="4" required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="showCreateModal = false"
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="creating"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {{ creating ? 'Creating...' : 'Create Tournament' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Generate Fixtures Modal -->
    <div v-if="showGenerateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Advanced Fixture Generation</h3>
          <button @click="closeGenerateModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <AdvancedFixtureGenerator 
            v-if="currentTournament"
            :tournament="currentTournament"
            @close="closeGenerateModal"
            @success="handleFixtureSuccess"
          />
        </div>
      </div>
    </div>

    <!-- Seed Knockout Modal -->
    <SeedKnockoutModal
      v-if="showSeedKnockoutModal"
      :tournament="currentTournament"
      @close="closeSeedKnockoutModal"
      @success="handleSeedKnockoutSuccess"
    />

    <!-- Tournament Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">{{ selectedTournament?.name }}</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="selectedTournament" class="p-6">
          <!-- Tournament Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-lg font-semibold mb-4">Tournament Information</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-500">Format</p>
                  <p class="font-medium">{{ selectedTournament.format }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">District</p>
                  <p class="font-medium">{{ selectedTournament.district }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Duration</p>
                  <p class="font-medium">{{ formatDate(selectedTournament.startDate) }} - {{ formatDate(selectedTournament.endDate) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Max Teams</p>
                  <p class="font-medium">{{ selectedTournament.maxTeams }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Entry Fee</p>
                  <p class="font-medium">₹{{ selectedTournament.entryFee || 0 }}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold mb-4">Status & Rules</h4>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span class="px-2 py-1 text-xs rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': selectedTournament.status === 'open',
                          'bg-blue-100 text-blue-800': selectedTournament.status === 'ongoing',
                          'bg-yellow-100 text-yellow-800': selectedTournament.status === 'upcoming',
                          'bg-purple-100 text-purple-800': selectedTournament.status === 'completed',
                          'bg-red-100 text-red-800': selectedTournament.status === 'cancelled'
                        }">
                    {{ selectedTournament.status }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Registration Deadline</p>
                  <p class="font-medium">{{ selectedTournament.registrationDeadline ? formatDate(selectedTournament.registrationDeadline) : 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold mb-4">Description</h4>
            <p class="text-gray-700">{{ selectedTournament.description || 'No description provided' }}</p>
          </div>

          <!-- Rules -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold mb-4">Rules</h4>
            <p class="text-gray-700">{{ selectedTournament.rules }}</p>
          </div>

          <!-- Registrations -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold">Registrations ({{ selectedTournament.participants?.length || 0 }}/{{ selectedTournament.maxTeams }})</h4>
              <button @click="fetchRegistrations" class="text-sm text-red-600 hover:text-red-700">
                Refresh
              </button>
            </div>

            <div v-if="registrations.length === 0" class="text-center py-8">
              <p class="text-gray-500">No registrations yet</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="reg in registrations" :key="reg._id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span class="text-red-600 font-semibold text-sm">{{ reg.club?.name?.charAt(0)?.toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ reg.club?.name }}</p>
                    <p class="text-sm text-gray-500">{{ reg.club?.district }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="px-2 py-1 text-xs rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': reg.status === 'approved',
                          'bg-yellow-100 text-yellow-800': reg.status === 'pending',
                          'bg-red-100 text-red-800': reg.status === 'rejected'
                        }">
                    {{ reg.status }}
                  </span>

                  <div v-if="reg.status === 'pending'" class="flex gap-2">
                    <button @click="approveRegistration(selectedTournament, reg)"
                            class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                      Approve
                    </button>
                    <button @click="rejectRegistration(selectedTournament, reg)"
                            class="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button v-if="selectedTournament.status === 'open'" @click="closeRegistrations(selectedTournament)"
                    class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Close Registrations
            </button>
            <button v-if="selectedTournament.status === 'upcoming' && !selectedTournament.fixturesGenerated" @click="openRegistrations(selectedTournament)"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Open Registrations
            </button>
            <button v-if="selectedTournament.status === 'upcoming' && !selectedTournament.fixturesGenerated" @click="openGenerateModal(selectedTournament)"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Generate Fixtures
            </button>
            <button v-if="selectedTournament.format === 'groups+knockouts' && selectedTournament.status !== 'cancelled' && selectedTournament.status !== 'completed'"
                    @click="seedKnockout(selectedTournament)"
                    :disabled="pendingGroupCount > 0"
                    class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
              Seed Knockout<span v-if="pendingGroupCount>0"> (wait: {{ pendingGroupCount }} pending)</span>
            </button>
            <!-- Generate Fixtures button removed -->
            <button v-if="selectedTournament.status !== 'completed' && selectedTournament.status !== 'cancelled'" @click="cancelTournament(selectedTournament)"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Cancel Tournament
            </button>
          </div>

          <div v-if="selectedTournament.format === 'groups+knockouts'" class="mt-3 text-xs text-gray-600">
            <p>Seeding uses current group standings (Points → NRR → Wins). Ensure standings are up to date.</p>
            <p v-if="pendingGroupCount>0" class="text-red-600">There are {{ pendingGroupCount }} group matches not completed yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../utils/api.js'
import AdvancedFixtureGenerator from './AdvancedFixtureGenerator.vue'
import SeedKnockoutModal from './SeedKnockoutModal.vue'

const tournaments = ref([])
const filteredTournaments = ref([])
const loading = ref(false)
const selectedStatus = ref('')
const selectedFormat = ref('')
const searchQuery = ref('')
const showCreateModal = ref(false)
const creating = ref(false)
const selectedTournament = ref(null)
const showDetailsModal = ref(false)
const registrations = ref([])

// Generate Fixtures state
const showGenerateModal = ref(false)
const showSeedKnockoutModal = ref(false)
const currentTournament = ref(null)
const gen = ref({ doubleRoundRobin: false, respectRoundOrder: true, groups: 2, qualifyPerGroup: 2 })
const genLoading = ref(false)
const genError = ref('')
const genDiag = ref(null)
const pendingGroupCount = ref(0)

const newTournament = ref({
  name: '',
  format: 'league',
  district: '',
  maxTeams: 16,
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  entryFee: 0,
  description: '',
  rules: ''
})

let searchTimeout = null

const activeTournaments = computed(() => {
  return tournaments.value.filter(t => t.status === 'ongoing').length
})

const upcomingTournaments = computed(() => {
  return tournaments.value.filter(t => t.status === 'upcoming' || t.status === 'open').length
})

const completedTournaments = computed(() => {
  return tournaments.value.filter(t => t.status === 'completed').length
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filterTournaments()
  }, 500)
}

const filterTournaments = () => {
  let filtered = [...tournaments.value]

  if (selectedStatus.value) {
    filtered = filtered.filter(t => t.status === selectedStatus.value)
  }

  if (selectedFormat.value) {
    filtered = filtered.filter(t => t.format === selectedFormat.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.district.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    )
  }

  filteredTournaments.value = filtered
}

const fetchTournaments = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/tournaments')
    tournaments.value = response.data
    filterTournaments()
  } catch (error) {
    console.error('Error fetching tournaments:', error)
  } finally {
    loading.value = false
  }
}

const refreshTournaments = () => {
  fetchTournaments()
}

const createTournament = async () => {
  creating.value = true
  try {
    await api.post('/admin/tournaments', newTournament.value)
    showCreateModal.value = false
    // Reset form
    newTournament.value = {
      name: '',
      format: 'league',
      district: '',
      maxTeams: 16,
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      entryFee: 0,
      description: '',
      rules: ''
    }
    fetchTournaments()
  } catch (error) {
    console.error('Error creating tournament:', error)
  } finally {
    creating.value = false
  }
}

const openGenerateModal = (t) => {
  currentTournament.value = t
  gen.value = { doubleRoundRobin: false, respectRoundOrder: true, groups: 2, qualifyPerGroup: 2 }
  genError.value = ''
  genDiag.value = null
  showGenerateModal.value = true
}

const closeGenerateModal = () => { 
  showGenerateModal.value = false
  currentTournament.value = null 
}

const handleFixtureSuccess = async (result) => {
  console.log('Fixture generation successful:', result)
  showGenerateModal.value = false
  currentTournament.value = null
  await fetchTournaments()
  if (selectedTournament.value) {
    // Refresh details if we're viewing the tournament
    const updated = tournaments.value.find(t => t._id === selectedTournament.value._id)
    if (updated) selectedTournament.value = updated
  }
}
const generateNow = async () => {
  if (!currentTournament.value) return
  genLoading.value = true; genError.value = ''; genDiag.value = null
  try {
    const body = { ...gen.value }
    // Use V2 endpoint with time slot support
    const { data } = await api.post(`/admin/tournaments/${currentTournament.value._id}/fixtures/generate-v2`, body)
    showGenerateModal.value = false
    await fetchTournaments()
  } catch (e) {
    genError.value = e?.response?.data?.message || 'Failed to generate fixtures'
    const diag = e?.response?.data?.diagnostics
    if (diag) genDiag.value = diag
  } finally {
    genLoading.value = false
  }
}

async function seedKnockout(t){
  currentTournament.value = t
  showSeedKnockoutModal.value = true
}

const closeSeedKnockoutModal = () => {
  showSeedKnockoutModal.value = false
  currentTournament.value = null
}

const handleSeedKnockoutSuccess = async (result) => {
  console.log('Knockout seeded successfully:', result)
  showSeedKnockoutModal.value = false
  currentTournament.value = null
  await fetchTournaments()
  if (selectedTournament.value) {
    // Refresh details if we're viewing the tournament
    const updated = tournaments.value.find(t => t._id === selectedTournament.value._id)
    if (updated) selectedTournament.value = updated
  }
}

async function fetchPendingGroups(){
  try{
    const { data } = await api.get(`/admin/tournaments/${selectedTournament.value._id}/group-matches/pending`)
    pendingGroupCount.value = Number(data?.pending)||0
  } catch(e){
    pendingGroupCount.value = 0
  }
}

const viewTournamentDetails = async (tournament) => {
  selectedTournament.value = tournament
  await fetchRegistrations()
  await fetchPendingGroups()
  showDetailsModal.value = true
}

const fetchRegistrations = async () => {
  if (!selectedTournament.value) return

  try {
    const response = await api.get(`/admin/tournaments/${selectedTournament.value._id}/registrations`)
    registrations.value = response.data || []
  } catch (error) {
    console.error('Error fetching registrations:', error)
    registrations.value = []
  }
}

const approveRegistration = async (tournament, registration) => {
  try {
    await api.put(`/admin/tournaments/${tournament._id}/registrations/${registration._id}/approve`)
    registration.status = 'approved'
    await fetchTournaments() // Refresh tournament list to update participant count
  } catch (error) {
    console.error('Error approving registration:', error)
  }
}

const rejectRegistration = async (tournament, registration) => {
  try {
    await api.put(`/admin/tournaments/${tournament._id}/registrations/${registration._id}/reject`)
    registration.status = 'rejected'
    await fetchTournaments() // Refresh tournament list to update participant count
  } catch (error) {
    console.error('Error rejecting registration:', error)
  }
}

// Fixture generation functions removed

const openRegistrations = async (tournament) => {
  try {
    await api.put(`/admin/tournaments/${tournament._id}/open-registrations`)
    tournament.status = 'open'
  } catch (error) {
    console.error('Error opening registrations:', error)
  }
}

const closeRegistrations = async (tournament) => {
  try {
    await api.put(`/admin/tournaments/${tournament._id}/close-registrations`)
    tournament.status = 'upcoming'
  } catch (error) {
    console.error('Error closing registrations:', error)
  }
}

const cancelTournament = async (tournament) => {
  if (!confirm('Are you sure you want to cancel this tournament?')) return

  try {
    await api.put(`/admin/tournaments/${tournament._id}/cancel`)
    tournament.status = 'cancelled'
  } catch (error) {
    console.error('Error cancelling tournament:', error)
  }
}

onMounted(() => {
  fetchTournaments()
})
</script>