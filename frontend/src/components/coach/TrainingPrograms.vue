<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Training Programs</h2>
      <button
        @click="showCreateModal = true"
        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
      >
        Create Program
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading training programs...</p>
    </div>

    <!-- No Programs -->
    <div v-else-if="!trainingPrograms || trainingPrograms.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500">No training programs created yet</p>
      <p class="text-sm text-gray-400 mt-1">Create your first training program to get started</p>
    </div>

    <!-- Programs List -->
    <div v-else class="space-y-4">
      <div
        v-for="program in trainingPrograms"
        :key="program._id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-gray-900">{{ program.title }}</h3>
            <p class="text-sm text-gray-600">{{ program.description }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="editProgram(program)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              @click="deleteProgram(program._id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Duration</p>
            <p class="font-medium">{{ program.duration }}</p>
          </div>
          <div>
            <p class="text-gray-500">Participants</p>
            <p class="font-medium">{{ program.currentParticipants }} / {{ program.maxParticipants }}</p>
          </div>
          <div>
            <p class="text-gray-500">Level</p>
            <p class="font-medium capitalize">{{ program.difficultyLevel }}</p>
          </div>
          <div>
            <p class="text-gray-500">Status</p>
            <span
              :class="{
                'bg-green-100 text-green-800': program.isActive,
                'bg-gray-100 text-gray-800': !program.isActive
              }"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ program.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="skill in program.skillFocus"
            :key="skill"
            class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            {{ skill }}
          </span>
        </div>

        <div class="mt-3 text-sm text-gray-600">
          {{ formatDate(program.startDate) }} - {{ formatDate(program.endDate) }}
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-900">
              {{ showEditModal ? 'Edit Training Program' : 'Create Training Program' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProgram" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Program Title *</label>
            <input
              v-model="programForm.title"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Advanced Batting Techniques"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="programForm.description"
              rows="3"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the training program..."
            ></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                v-model="programForm.startDate"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                v-model="programForm.endDate"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
              <input
                v-model="programForm.duration"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 6 weeks, 3 months"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Participants *</label>
              <input
                v-model.number="programForm.maxParticipants"
                type="number"
                min="1"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
            <select
              v-model="programForm.difficultyLevel"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Skill Focus *</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <label
                v-for="skill in skillOptions"
                :key="skill.value"
                class="flex items-center"
              >
                <input
                  v-model="programForm.skillFocus"
                  :value="skill.value"
                  type="checkbox"
                  class="mr-2 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm">{{ skill.label }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>{{ showEditModal ? 'Update Program' : 'Create Program' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';

const auth = useAuthStore();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(false);
const saving = ref(false);
const trainingPrograms = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingProgramId = ref(null);

const skillOptions = [
  { value: 'batting', label: 'Batting' },
  { value: 'bowling', label: 'Bowling' },
  { value: 'fielding', label: 'Fielding' },
  { value: 'wicket-keeping', label: 'Wicket-keeping' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-coaching', label: 'Mental Coaching' },
  { value: 'strategy', label: 'Strategy' }
];

const programForm = ref({
  title: '',
  description: '',
  duration: '',
  startDate: '',
  endDate: '',
  skillFocus: [],
  difficultyLevel: '',
  maxParticipants: 10
});

const loadTrainingPrograms = async () => {
  loading.value = true;
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const response = await axios.get(`${API}/coaches/training-programs`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    });
    trainingPrograms.value = response.data.trainingPrograms;
  } catch (error) {
    console.error('Error loading training programs:', error);
    alert('Failed to load training programs');
  } finally {
    loading.value = false;
  }
};

const saveProgram = async () => {
  saving.value = true;
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const config = {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    };

    if (showEditModal.value) {
      // Update existing program
      await axios.put(`${API}/coaches/training-programs/${editingProgramId.value}`, programForm.value, config);
      alert('Training program updated successfully');
    } else {
      // Create new program
      await axios.post(`${API}/coaches/training-programs`, programForm.value, config);
      alert('Training program created successfully');
    }

    closeModal();
    await loadTrainingPrograms();
  } catch (error) {
    console.error('Error saving training program:', error);
    const message = error.response?.data?.message || 'Failed to save training program';
    alert(message);
  } finally {
    saving.value = false;
  }
};

const editProgram = (program) => {
  programForm.value = { ...program };
  editingProgramId.value = program._id;
  showEditModal.value = true;
};

const deleteProgram = async (programId) => {
  if (!confirm('Are you sure you want to delete this training program?')) return;

  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    await axios.delete(`${API}/coaches/training-programs/${programId}`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      withCredentials: true
    });
    alert('Training program deleted successfully');
    await loadTrainingPrograms();
  } catch (error) {
    console.error('Error deleting training program:', error);
    const message = error.response?.data?.message || 'Failed to delete training program';
    alert(message);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingProgramId.value = null;
  programForm.value = {
    title: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    skillFocus: [],
    difficultyLevel: '',
    maxParticipants: 10
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  loadTrainingPrograms();
});
</script>

<style scoped>
/* Custom styles */
</style>