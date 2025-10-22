<template>
  <div class="advanced-fixture-generator bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">
      Advanced Fixture Generation
    </h2>

    <!-- Tournament Info -->
    <div v-if="tournament" class="mb-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-lg mb-2">{{ tournament.name }}</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><span class="font-medium">Format:</span> {{ tournament.format }}</div>
        <div><span class="font-medium">Teams:</span> {{ tournament.participants?.length || 0 }}</div>
        <div><span class="font-medium">Start Date:</span> {{ formatDate(tournament.startDate) }}</div>
        <div><span class="font-medium">End Date:</span> {{ formatDate(tournament.endDate) }}</div>
        <div><span class="font-medium">Match Format:</span> {{ tournament.matchFormat || 'T20' }}</div>
        <div><span class="font-medium">Overs:</span> {{ tournament.oversLimit || 20 }}</div>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in steps" :key="index" class="flex-1">
          <div class="flex items-center">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                currentStep >= index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div v-if="index < steps.length - 1" class="flex-1 h-1 bg-gray-300 mx-2"></div>
          </div>
          <div class="text-xs mt-2 text-center">{{ step }}</div>
        </div>
      </div>
    </div>

    <!-- Step 1: Configuration -->
    <div v-show="currentStep === 1" class="space-y-6">
      <h3 class="text-xl font-semibold mb-4">Fixture Configuration</h3>

      <!-- Format-specific options -->
      <div v-if="tournament?.format === 'round-robin' || tournament?.format === 'league'" class="space-y-4">
        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="doubleRR" 
            v-model="config.doubleRoundRobin"
            class="w-4 h-4 text-blue-600"
          />
          <label for="doubleRR" class="text-sm font-medium">Double Round Robin (Home & Away)</label>
        </div>
      </div>

      <div v-if="tournament?.format === 'groups+knockouts' || tournament?.format === 'league+playoff'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Number of Groups</label>
          <select v-model.number="config.groups" class="w-full px-3 py-2 border rounded-md">
            <option :value="2">2 Groups</option>
            <option :value="3">3 Groups</option>
            <option :value="4">4 Groups</option>
            <option :value="6">6 Groups</option>
            <option :value="8">8 Groups</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Teams Qualifying Per Group</label>
          <select v-model.number="config.qualifyPerGroup" class="w-full px-3 py-2 border rounded-md">
            <option :value="1">1 Team</option>
            <option :value="2">2 Teams</option>
            <option :value="3">3 Teams</option>
            <option :value="4">4 Teams</option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="doubleRRGroup" 
            v-model="config.doubleRoundRobin"
            class="w-4 h-4 text-blue-600"
          />
          <label for="doubleRRGroup" class="text-sm font-medium">Double Round Robin in Groups</label>
        </div>
      </div>

      <!-- Venue & Time Slot Configuration -->
      <div class="space-y-4">
        <h4 class="font-semibold">Venue Time Slots</h4>
        <div 
          v-for="(venue, index) in config.venueSlots" 
          :key="index"
          class="p-4 border rounded-md space-y-3"
        >
          <div>
            <label class="block text-sm font-medium mb-2">Venue Name</label>
            <input 
              type="text" 
              v-model="venue.name"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Main Stadium"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Time Slots (comma-separated)</label>
            <input 
              type="text" 
              v-model="venue.slotsText"
              @input="updateVenueSlots(index)"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="09:00, 14:00, 18:00"
            />
            <p class="text-xs text-gray-500 mt-1">Enter times in HH:MM format</p>
          </div>
          <button 
            v-if="config.venueSlots.length > 1"
            @click="removeVenue(index)"
            class="text-red-600 text-sm hover:underline"
          >
            Remove Venue
          </button>
        </div>
        <button 
          @click="addVenue"
          class="text-blue-600 text-sm hover:underline"
        >
          + Add Venue
        </button>
      </div>

      <!-- Scheduling Options -->
      <div class="space-y-4">
        <h4 class="font-semibold">Scheduling Preferences</h4>
        
        <div>
          <label class="block text-sm font-medium mb-2">Minimum Rest Days Between Matches</label>
          <select v-model.number="config.restDaysMin" class="w-full px-3 py-2 border rounded-md">
            <option :value="0">No rest (back-to-back possible)</option>
            <option :value="1">1 Day</option>
            <option :value="2">2 Days</option>
            <option :value="3">3 Days</option>
            <option :value="4">4 Days</option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="respectOrder" 
            v-model="config.respectRoundOrder"
            class="w-4 h-4 text-blue-600"
          />
          <label for="respectOrder" class="text-sm font-medium">Respect Round Order (Complete rounds sequentially)</label>
        </div>

        <div class="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="prioritizeWeekends" 
            v-model="config.prioritizeWeekends"
            class="w-4 h-4 text-blue-600"
          />
          <label for="prioritizeWeekends" class="text-sm font-medium">Prioritize Weekend Slots</label>
        </div>
      </div>

      <div class="flex space-x-4">
        <button 
          @click="previewCapacity"
          :disabled="loading"
          class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Loading...' : 'Preview Capacity' }}
        </button>
        <button 
          @click="currentStep = 2"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next: Review
        </button>
      </div>
    </div>

    <!-- Step 2: Preview & Validation -->
    <div v-show="currentStep === 2" class="space-y-6">
      <h3 class="text-xl font-semibold mb-4">Capacity Preview & Validation</h3>

      <div v-if="preview" class="space-y-4">
        <!-- Capacity Overview -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-gray-600">Total Time Slots</div>
            <div class="text-2xl font-bold">{{ preview.capacity.totalSlots }}</div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-gray-600">Available Slots</div>
            <div class="text-2xl font-bold">{{ preview.capacity.availableSlots }}</div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-sm text-gray-600">Effective Capacity</div>
            <div class="text-2xl font-bold">{{ preview.capacity.effectiveCapacity }}</div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <div class="text-sm text-gray-600">Required Matches</div>
            <div class="text-2xl font-bold">{{ preview.requiredMatches }}</div>
          </div>
        </div>

        <!-- Validation Status -->
        <div 
          v-if="preview.validation"
          :class="[
            'p-4 rounded-lg border-2',
            preview.validation.valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          ]"
        >
          <div class="flex items-center space-x-3 mb-2">
            <span 
              :class="[
                'text-2xl',
                preview.validation.valid ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ preview.validation.valid ? '✓' : '✗' }}
            </span>
            <span class="font-semibold">
              {{ preview.validation.valid ? 'Fixture Generation Feasible' : 'Fixture Generation Not Feasible' }}
            </span>
          </div>

          <!-- Issues -->
          <div v-if="preview.validation.issues?.length" class="mt-4 space-y-2">
            <h5 class="font-semibold text-red-700">Issues:</h5>
            <div 
              v-for="(issue, index) in preview.validation.issues" 
              :key="index"
              class="text-sm bg-white p-3 rounded border border-red-300"
            >
              <div class="font-medium">{{ issue.type }}</div>
              <div class="text-gray-700">{{ issue.message }}</div>
              <div v-if="issue.suggestion" class="text-xs text-gray-500 mt-1">
                💡 {{ issue.suggestion }}
              </div>
            </div>
          </div>

          <!-- Warnings -->
          <div v-if="preview.validation.warnings?.length" class="mt-4 space-y-2">
            <h5 class="font-semibold text-yellow-700">Warnings:</h5>
            <div 
              v-for="(warning, index) in preview.validation.warnings" 
              :key="index"
              class="text-sm bg-white p-3 rounded border border-yellow-300"
            >
              <div class="font-medium">{{ warning.type }}</div>
              <div class="text-gray-700">{{ warning.message }}</div>
            </div>
          </div>
        </div>

        <!-- Tournament Details -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h5 class="font-semibold mb-3">Tournament Details</h5>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><span class="font-medium">Format:</span> {{ preview.tournament.format }}</div>
            <div><span class="font-medium">Teams:</span> {{ preview.tournament.teamCount }}</div>
            <div><span class="font-medium">Duration:</span> {{ preview.capacity.days }} days</div>
            <div><span class="font-medium">Venues:</span> {{ preview.capacity.venues }}</div>
          </div>
        </div>
      </div>

      <div v-else class="p-8 text-center text-gray-500">
        <p>Click "Preview Capacity" to see validation results</p>
      </div>

      <div class="flex space-x-4">
        <button 
          @click="currentStep = 1"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Back
        </button>
        <button 
          @click="currentStep = 3"
          :disabled="!preview || !preview.validation?.valid"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Next: Generate
        </button>
      </div>
    </div>

    <!-- Step 3: Generate -->
    <div v-show="currentStep === 3" class="space-y-6">
      <h3 class="text-xl font-semibold mb-4">Generate Fixtures</h3>

      <div v-if="!generationResult" class="text-center space-y-4">
        <p class="text-gray-600">Ready to generate {{ preview?.requiredMatches }} matches</p>
        <div class="flex justify-center space-x-4">
          <button 
            @click="currentStep = 2"
            class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Back
          </button>
          <button 
            @click="generateFixtures"
            :disabled="loading"
            class="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg font-semibold disabled:bg-gray-400"
          >
            {{ loading ? 'Generating...' : '🚀 Generate Fixtures' }}
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div 
          :class="[
            'p-6 rounded-lg text-center',
            generationResult.success ? 'bg-green-50' : 'bg-red-50'
          ]"
        >
          <div 
            :class="[
              'text-5xl mb-4',
              generationResult.success ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ generationResult.success ? '✓' : '✗' }}
          </div>
          <h4 class="text-xl font-bold mb-2">
            {{ generationResult.message }}
          </h4>
          
          <div v-if="generationResult.success && generationResult.data" class="mt-6 space-y-3">
            <div class="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div class="p-3 bg-white rounded">
                <div class="text-sm text-gray-600">Matches Created</div>
                <div class="text-2xl font-bold">{{ generationResult.data.matchesCount }}</div>
              </div>
              <div class="p-3 bg-white rounded">
                <div class="text-sm text-gray-600">Groups</div>
                <div class="text-2xl font-bold">{{ generationResult.data.groupsCount || 'N/A' }}</div>
              </div>
            </div>

            <div v-if="generationResult.data.stats" class="text-sm text-gray-700 mt-4">
              <div>Weekend Matches: {{ generationResult.data.stats.weekendMatches }}</div>
            </div>

            <div v-if="generationResult.data.warnings?.length" class="mt-4">
              <div class="text-sm text-yellow-700 font-medium mb-2">Warnings:</div>
              <div 
                v-for="(warning, index) in generationResult.data.warnings" 
                :key="index"
                class="text-xs bg-yellow-50 p-2 rounded mb-1"
              >
                {{ warning.message }}
              </div>
            </div>
          </div>

          <div v-else-if="!generationResult.success" class="mt-4 text-left max-w-md mx-auto">
            <div class="bg-white p-4 rounded text-sm">
              <div v-if="generationResult.failed" class="space-y-2">
                <div><span class="font-medium">Failed Match:</span> {{ generationResult.failed.match?.home }} vs {{ generationResult.failed.match?.away }}</div>
                <div><span class="font-medium">Reason:</span> {{ generationResult.failed.reason }}</div>
              </div>
              <div v-if="generationResult.issues" class="space-y-2 mt-3">
                <div 
                  v-for="(issue, index) in generationResult.issues" 
                  :key="index"
                  class="border-t pt-2"
                >
                  {{ issue.message }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button 
            @click="resetGenerator"
            class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Generate Again
          </button>
          <button 
            @click="$emit('close')"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import api from '@/utils/api';

export default {
  name: 'AdvancedFixtureGenerator',
  props: {
    tournament: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const currentStep = ref(1);
    const loading = ref(false);
    const preview = ref(null);
    const generationResult = ref(null);

    const steps = ['Configure', 'Validate', 'Generate'];

    const config = reactive({
      doubleRoundRobin: false,
      groups: 2,
      qualifyPerGroup: 2,
      venueSlots: [
        { name: 'Main Ground', slotsText: '09:00, 14:00, 18:00', slotTimes: ['09:00', '14:00', '18:00'] }
      ],
      restDaysMin: 1,
      respectRoundOrder: true,
      prioritizeWeekends: false
    });

    // Initialize venue slots from tournament if available
    if (props.tournament.venueSlots?.length) {
      config.venueSlots = props.tournament.venueSlots.map(v => ({
        name: v.name,
        slotsText: v.slotTimes.join(', '),
        slotTimes: v.slotTimes
      }));
    } else if (props.tournament.venues?.length) {
      config.venueSlots = props.tournament.venues.map(v => ({
        name: v,
        slotsText: '09:00, 14:00, 18:00',
        slotTimes: ['09:00', '14:00', '18:00']
      }));
    }

    const updateVenueSlots = (index) => {
      const venue = config.venueSlots[index];
      venue.slotTimes = venue.slotsText
        .split(',')
        .map(t => t.trim())
        .filter(t => t.match(/^\d{2}:\d{2}$/));
    };

    const addVenue = () => {
      config.venueSlots.push({
        name: `Venue ${config.venueSlots.length + 1}`,
        slotsText: '09:00, 14:00',
        slotTimes: ['09:00', '14:00']
      });
    };

    const removeVenue = (index) => {
      config.venueSlots.splice(index, 1);
    };

    const previewCapacity = async () => {
      loading.value = true;
      try {
        const payload = {
          doubleRoundRobin: config.doubleRoundRobin,
          groups: config.groups,
          qualifyPerGroup: config.qualifyPerGroup,
          slotTimes: config.venueSlots[0]?.slotTimes || ['09:00', '14:00']
        };

        const response = await api.post(`/admin/tournaments/${props.tournament._id}/fixtures/preview`, payload);
        preview.value = response.data;
      } catch (error) {
        console.error('Error previewing capacity:', error);
        alert(error.response?.data?.message || 'Failed to preview capacity');
      } finally {
        loading.value = false;
      }
    };

    const generateFixtures = async () => {
      loading.value = true;
      try {
        const payload = {
          doubleRoundRobin: config.doubleRoundRobin,
          groups: config.groups,
          qualifyPerGroup: config.qualifyPerGroup,
          slotTimes: config.venueSlots[0]?.slotTimes || ['09:00', '14:00'],
          respectRoundOrder: config.respectRoundOrder,
          prioritizeWeekends: config.prioritizeWeekends
        };

        const response = await api.post(`/admin/tournaments/${props.tournament._id}/fixtures/generate-v2`, payload);
        generationResult.value = response.data;
        
        if (response.data.success) {
          emit('success', response.data);
        }
      } catch (error) {
        console.error('Error generating fixtures:', error);
        generationResult.value = {
          success: false,
          message: error.response?.data?.message || 'Failed to generate fixtures',
          issues: error.response?.data?.issues,
          failed: error.response?.data?.failed
        };
      } finally {
        loading.value = false;
      }
    };

    const resetGenerator = () => {
      currentStep.value = 1;
      preview.value = null;
      generationResult.value = null;
    };

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    return {
      currentStep,
      loading,
      preview,
      generationResult,
      steps,
      config,
      updateVenueSlots,
      addVenue,
      removeVenue,
      previewCapacity,
      generateFixtures,
      resetGenerator,
      formatDate
    };
  }
};
</script>

<style scoped>
.advanced-fixture-generator {
  max-width: 900px;
  margin: 0 auto;
}
</style>
