<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Training Programs</h2>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Create Program
      </button>
    </div>

    <!-- Programs List -->
    <div v-if="trainingPrograms.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="program in trainingPrograms" 
        :key="program._id"
        class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ program.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ program.description }}</p>
          </div>
          <span 
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              program.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ program.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatDate(program.startDate) }} - {{ formatDate(program.endDate) }}
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {{ program.currentParticipants }}/{{ program.maxParticipants }} players
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ program.sessions?.length || 0 }} sessions
          </div>
          <div class="flex items-center text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ program.difficultyLevel }}
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <span 
            v-for="skill in program.skillFocus" 
            :key="skill"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ formatSkillName(skill) }}
          </span>
        </div>

        <div class="mt-4 flex gap-2">
          <button 
            @click="viewProgram(program)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
          <button 
            @click="editProgram(program)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No training programs</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new training program.</p>
      <div class="mt-6">
        <button 
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Program
        </button>
      </div>
    </div>

    <!-- Create/Edit Program Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">
              {{ showEditModal ? 'Edit Training Program' : 'Create New Training Program' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveProgram" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Program Title</label>
              <input 
                v-model="programForm.title"
                type="text" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                v-model="programForm.description"
                rows="3"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  v-model="programForm.startDate"
                  type="date" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  v-model="programForm.endDate"
                  type="date" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Duration</label>
                <input 
                  v-model="programForm.duration"
                  type="text" 
                  placeholder="e.g., 6 weeks"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Difficulty Level</label>
                <select 
                  v-model="programForm.difficultyLevel"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Max Participants</label>
                <input 
                  v-model.number="programForm.maxParticipants"
                  type="number" 
                  min="1"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Skill Focus</label>
                <div class="mt-1 space-y-2">
                  <div 
                    v-for="skill in skillOptions" 
                    :key="skill.value"
                    class="flex items-center"
                  >
                    <input 
                      :id="`skill-${skill.value}`"
                      :value="skill.value"
                      v-model="programForm.skillFocus"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    >
                    <label 
                      :for="`skill-${skill.value}`"
                      class="ml-3 text-sm text-gray-700"
                    >
                      {{ skill.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isSaving"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : (showEditModal ? 'Update Program' : 'Create Program') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Define props
const props = defineProps({
  coachData: {
    type: Object,
    required: true
  }
});

// Reactive data
const trainingPrograms = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const isSaving = ref(false);
const editingProgramId = ref(null);

const skillOptions = [
  { value: 'batting', label: 'Batting' },
  { value: 'bowling', label: 'Bowling' },
  { value: 'fielding', label: 'Fielding' },
  { value: 'wicket-keeping', label: 'Wicket Keeping' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-coaching', label: 'Mental Coaching' },
  { value: 'strategy', label: 'Strategy' }
];

const programForm = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  duration: '',
  difficultyLevel: 'beginner',
  maxParticipants: 10,
  skillFocus: []
});

// Fetch training programs
onMounted(async () => {
  await fetchTrainingPrograms();
});

async function fetchTrainingPrograms() {
  try {
    // Use the training programs from the coach data
    trainingPrograms.value = props.coachData?.trainingPrograms || [];
  } catch (error) {
    console.error('Error fetching training programs:', error);
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatSkillName(skill) {
  const skillMap = {
    'batting': 'Batting',
    'bowling': 'Bowling',
    'fielding': 'Fielding',
    'wicket-keeping': 'Wicket Keeping',
    'fitness': 'Fitness',
    'mental-coaching': 'Mental Coaching',
    'strategy': 'Strategy'
  };
  return skillMap[skill] || skill;
}

function viewProgram(program) {
  // In a real implementation, this would navigate to the program details page
  alert(`Viewing program: ${program.title}`);
}

function editProgram(program) {
  editingProgramId.value = program._id;
  programForm.value = { ...program };
  showEditModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingProgramId.value = null;
  resetForm();
}

function resetForm() {
  programForm.value = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: '',
    difficultyLevel: 'beginner',
    maxParticipants: 10,
    skillFocus: []
  };
}

async function saveProgram() {
  isSaving.value = true;
  try {
    if (showEditModal.value) {
      // Update existing program
      await axios.put(`${API}/coaches/training-programs/${editingProgramId.value}`, programForm.value, { withCredentials: true });
      alert('Training program updated successfully');
    } else {
      // Create new program
      await axios.post(`${API}/coaches/training-programs`, programForm.value, { withCredentials: true });
      alert('Training program created successfully');
    }
    
    closeModal();
    await fetchTrainingPrograms();
  } catch (error) {
    console.error('Error saving training program:', error);
    alert('Failed to save training program. Please try again.');
  } finally {
    isSaving.value = false;
  }
}
</script>