<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Seed Knockout Stage</h3>
            <p class="text-sm text-gray-600 mt-1">{{ tournament.name }}</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p class="text-gray-500 mt-4">Loading group standings...</p>
        </div>

        <div v-else>
          <!-- Validation Warnings -->
          <div v-if="validationIssues.length > 0" class="space-y-3">
            <div 
              v-for="(issue, index) in validationIssues" 
              :key="index"
              :class="[
                'p-4 rounded-lg border-2',
                issue.severity === 'error' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
              ]"
            >
              <div class="flex items-start space-x-3">
                <span :class="issue.severity === 'error' ? 'text-red-600' : 'text-yellow-600'" class="text-xl">
                  {{ issue.severity === 'error' ? '⚠️' : '⚡' }}
                </span>
                <div class="flex-1">
                  <div class="font-semibold" :class="issue.severity === 'error' ? 'text-red-800' : 'text-yellow-800'">
                    {{ issue.title }}
                  </div>
                  <div class="text-sm mt-1" :class="issue.severity === 'error' ? 'text-red-700' : 'text-yellow-700'">
                    {{ issue.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configuration -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-3">Knockout Configuration</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Teams Qualifying Per Group</label>
                <select v-model.number="qualifyPerGroup" class="w-full px-3 py-2 border rounded-md">
                  <option :value="1">Top 1 team</option>
                  <option :value="2">Top 2 teams</option>
                  <option :value="3">Top 3 teams</option>
                  <option :value="4">Top 4 teams</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Total Knockout Teams</label>
                <div class="w-full px-3 py-2 bg-white border rounded-md font-semibold text-purple-600">
                  {{ totalQualifiers }} teams
                </div>
              </div>
            </div>
          </div>

          <!-- Group Standings -->
          <div class="space-y-4">
            <h4 class="font-semibold text-lg">Current Group Standings</h4>
            
            <div v-for="group in groupedStandings" :key="group.name" class="border rounded-lg overflow-hidden">
              <div class="bg-gray-100 px-4 py-3 font-semibold border-b">
                {{ group.name }}
                <span class="text-sm font-normal text-gray-600 ml-2">
                  ({{ group.completedMatches }}/{{ group.totalMatches }} matches completed)
                </span>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 border-b">
                    <tr>
                      <th class="px-4 py-2 text-left">Pos</th>
                      <th class="px-4 py-2 text-left">Team</th>
                      <th class="px-4 py-2 text-center">P</th>
                      <th class="px-4 py-2 text-center">W</th>
                      <th class="px-4 py-2 text-center">L</th>
                      <th class="px-4 py-2 text-center">D</th>
                      <th class="px-4 py-2 text-center">Pts</th>
                      <th class="px-4 py-2 text-center">NRR</th>
                      <th class="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    <tr 
                      v-for="(team, index) in group.standings" 
                      :key="team.club._id"
                      :class="index < qualifyPerGroup ? 'bg-green-50' : ''"
                    >
                      <td class="px-4 py-3 font-semibold">{{ index + 1 }}</td>
                      <td class="px-4 py-3">
                        <div class="font-medium">{{ team.club.clubName || team.club.name }}</div>
                        <div class="text-xs text-gray-500">{{ team.club.district }}</div>
                      </td>
                      <td class="px-4 py-3 text-center">{{ team.played }}</td>
                      <td class="px-4 py-3 text-center">{{ team.won }}</td>
                      <td class="px-4 py-3 text-center">{{ team.lost }}</td>
                      <td class="px-4 py-3 text-center">{{ team.drawn }}</td>
                      <td class="px-4 py-3 text-center font-semibold">{{ team.points }}</td>
                      <td class="px-4 py-3 text-center">{{ team.nrr.toFixed(3) }}</td>
                      <td class="px-4 py-3 text-center">
                        <span 
                          v-if="index < qualifyPerGroup"
                          class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                        >
                          ✓ Qualifies
                        </span>
                        <span v-else class="text-gray-400 text-xs">Eliminated</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Qualified Teams Preview -->
          <div v-if="qualifiedTeams.length > 0" class="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <h4 class="font-semibold text-purple-900 mb-3">
              🏆 Qualified Teams ({{ qualifiedTeams.length }})
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                v-for="(team, index) in qualifiedTeams" 
                :key="team.club._id"
                class="bg-white p-3 rounded-lg border border-purple-200"
              >
                <div class="text-xs text-purple-600 font-semibold mb-1">Seed #{{ index + 1 }}</div>
                <div class="font-medium text-sm">{{ team.club.clubName || team.club.name }}</div>
                <div class="text-xs text-gray-500">{{ team.group }}</div>
                <div class="text-xs text-purple-600 mt-1">{{ team.points }} pts | {{ team.nrr.toFixed(2) }} NRR</div>
              </div>
            </div>
          </div>

          <!-- Knockout Bracket Preview -->
          <div v-if="bracketPreview.length > 0" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-3">Knockout Bracket Preview</h4>
            <div class="space-y-2">
              <div 
                v-for="(match, index) in bracketPreview" 
                :key="index"
                class="flex items-center justify-between bg-white p-3 rounded-lg border"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <span class="text-sm font-semibold text-purple-600">Match {{ index + 1 }}</span>
                  <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{{ match.round }}</span>
                </div>
                <div class="flex items-center space-x-4 flex-1 justify-center">
                  <div class="text-sm font-medium text-right">
                    <div>{{ match.team1.clubName || match.team1.name }}</div>
                    <div class="text-xs text-gray-500">Seed #{{ match.seed1 }}</div>
                  </div>
                  <span class="text-gray-400 font-bold">VS</span>
                  <div class="text-sm font-medium">
                    <div>{{ match.team2.clubName || match.team2.name }}</div>
                    <div class="text-xs text-gray-500">Seed #{{ match.seed2 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span v-if="canProceed" class="text-green-600 font-medium">✓ Ready to generate knockout fixtures</span>
            <span v-else class="text-red-600 font-medium">⚠ Cannot proceed - resolve issues above</span>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="seedKnockout"
              :disabled="!canProceed || seeding"
              class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ seeding ? 'Generating...' : '🚀 Generate Knockout Fixtures' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/utils/api';

const props = defineProps({
  tournament: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'success']);

const loading = ref(true);
const seeding = ref(false);
const qualifyPerGroup = ref(2);
const standings = ref([]);
const matches = ref([]);

const groupedStandings = computed(() => {
  const groups = {};
  
  standings.value.forEach(standing => {
    if (!groups[standing.group]) {
      groups[standing.group] = {
        name: standing.group,
        standings: [],
        totalMatches: 0,
        completedMatches: 0
      };
    }
    groups[standing.group].standings.push(standing);
  });

  // Calculate match statistics per group
  matches.value.forEach(match => {
    if (match.stage === 'Group' && match.group && groups[match.group]) {
      groups[match.group].totalMatches++;
      if (match.status === 'Completed') {
        groups[match.group].completedMatches++;
      }
    }
  });

  // Sort standings within each group
  Object.values(groups).forEach(group => {
    group.standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.nrr !== a.nrr) return b.nrr - a.nrr;
      return b.won - a.won;
    });
  });

  return Object.values(groups);
});

const qualifiedTeams = computed(() => {
  const qualified = [];
  
  groupedStandings.value.forEach(group => {
    const groupQualifiers = group.standings.slice(0, qualifyPerGroup.value);
    qualified.push(...groupQualifiers);
  });

  // Assign seeds based on group position
  const seeded = [];
  for (let position = 0; position < qualifyPerGroup.value; position++) {
    groupedStandings.value.forEach(group => {
      if (group.standings[position]) {
        seeded.push(group.standings[position]);
      }
    });
  }

  return seeded;
});

const totalQualifiers = computed(() => {
  return groupedStandings.value.length * qualifyPerGroup.value;
});

const validationIssues = computed(() => {
  const issues = [];

  // Check if all group matches are completed
  groupedStandings.value.forEach(group => {
    if (group.completedMatches < group.totalMatches) {
      const pending = group.totalMatches - group.completedMatches;
      issues.push({
        severity: 'warning',
        title: `${group.name} - ${pending} match${pending > 1 ? 'es' : ''} pending`,
        message: `${group.completedMatches} of ${group.totalMatches} matches completed. Seeding now will use current standings.`
      });
    }
  });

  // Check if we have enough qualifiers
  if (qualifiedTeams.value.length < 2) {
    issues.push({
      severity: 'error',
      title: 'Insufficient qualifiers',
      message: `Need at least 2 teams for knockout stage. Currently: ${qualifiedTeams.value.length}`
    });
  }

  // Check if knockout fixtures already exist
  const knockoutMatches = matches.value.filter(m => m.stage === 'Knockout');
  if (knockoutMatches.length > 0) {
    issues.push({
      severity: 'error',
      title: 'Knockout fixtures already exist',
      message: `Found ${knockoutMatches.length} existing knockout matches. Delete them first to re-seed.`
    });
  }

  return issues;
});

const canProceed = computed(() => {
  return validationIssues.value.every(issue => issue.severity !== 'error');
});

const bracketPreview = computed(() => {
  if (qualifiedTeams.value.length < 2) return [];

  const teams = [...qualifiedTeams.value];
  const bracket = [];
  
  // Standard tournament seeding: 1v8, 4v5, 2v7, 3v6
  for (let i = 0; i < teams.length / 2; i++) {
    const seed1 = i;
    const seed2 = teams.length - 1 - i;
    
    if (teams[seed1] && teams[seed2]) {
      bracket.push({
        team1: teams[seed1].club,
        team2: teams[seed2].club,
        seed1: seed1 + 1,
        seed2: seed2 + 1,
        round: getRoundLabel(Math.ceil(teams.length / 2))
      });
    }
  }

  return bracket;
});

const getRoundLabel = (matchCount) => {
  if (matchCount === 1) return 'Final';
  if (matchCount === 2) return 'Semi-Final';
  if (matchCount === 4) return 'Quarter-Final';
  if (matchCount === 8) return 'Round of 16';
  return `Round of ${matchCount * 2}`;
};

const loadData = async () => {
  loading.value = true;
  try {
    // Fetch standings
    const standingsResponse = await api.get(`/admin/tournaments/${props.tournament._id}`);
    const tournamentData = standingsResponse.data;
    
    // Populate standings with club details
    standings.value = await Promise.all(
      (tournamentData.standings || []).map(async (standing) => {
        try {
          const clubResponse = await api.get(`/clubs/${standing.club}`);
          return {
            ...standing,
            club: clubResponse.data
          };
        } catch (error) {
          return {
            ...standing,
            club: { _id: standing.club, name: 'Unknown Club' }
          };
        }
      })
    );

    // Fetch matches
    const matchesResponse = await api.get(`/admin/tournaments/${props.tournament._id}/matches`);
    matches.value = matchesResponse.data || [];

  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

const seedKnockout = async () => {
  if (!confirm(`Generate knockout fixtures for ${qualifiedTeams.value.length} qualified teams?`)) {
    return;
  }

  seeding.value = true;
  try {
    const response = await api.post(`/admin/tournaments/${props.tournament._id}/fixtures/seed-knockout`, {
      qualifyPerGroup: qualifyPerGroup.value
    });

    emit('success', response.data);
  } catch (error) {
    console.error('Error seeding knockout:', error);
    alert(error.response?.data?.message || 'Failed to seed knockout');
  } finally {
    seeding.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
