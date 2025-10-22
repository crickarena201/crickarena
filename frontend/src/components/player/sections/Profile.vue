<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0">
          <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {{ userInitials }}
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ playerData?.fullName || 'Player Profile' }}</h1>
          <p class="text-gray-600 mt-1">{{ playerData?.preferredPosition || 'Cricket Player' }}</p>
          
          <div class="mt-4 flex flex-wrap gap-2">
            <span 
              v-if="playerData?.currentClub"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Member of {{ playerData.currentClub.name || playerData.currentClub.clubName }}
            </span>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ playerData?.battingStyle || 'N/A' }} batting
            </span>
          </div>
          
          <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ playerData?.phone || 'N/A' }}
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {{ playerData?.email || 'N/A' }}
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ playerData?.address?.city }}, {{ playerData?.address?.district }}, {{ playerData?.address?.state }}
            </div>
          </div>
        </div>
        <div class="flex-shrink-0">
          <button 
            @click="editProfile"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Details -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- About Section -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">About</h2>
          <p class="text-gray-700">
            {{ playerData?.bio || 'No bio information provided.' }}
          </p>
        </div>

        <!-- Cricket Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Cricket Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Batting Style</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.battingStyle || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Bowling Style</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.bowlingStyle || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Primary Role</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.primaryRole || 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Secondary Role</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.secondaryRole || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Physical Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Physical Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Height</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.height ? playerData.height + ' cm' : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Weight</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.weight ? playerData.weight + ' kg' : 'N/A' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fitness Level</label>
              <p class="mt-1 text-sm text-gray-900">{{ playerData?.fitnessLevel || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Achievements -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
          <div v-if="playerData?.achievements && playerData.achievements.length > 0" class="space-y-3">
            <div 
              v-for="(achievement, index) in playerData.achievements" 
              :key="index"
              class="border border-gray-200 rounded-lg p-3"
            >
              <h3 class="font-medium text-gray-900">{{ achievement.title }}</h3>
              <p class="text-sm text-gray-600">{{ achievement.tournament }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(achievement.date) }}</p>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            No achievements recorded
          </div>
        </div>

        <!-- Documents -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900">Documents</h2>
            <button 
              @click="showUploadModal = true"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Upload
            </button>
          </div>
          <div v-if="playerData?.documents && playerData.documents.length > 0" class="space-y-3">
            <div 
              v-for="(doc, index) in playerData.documents" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ doc.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(doc.uploadedAt) }}</p>
                </div>
              </div>
              <button 
                @click="viewDocument(doc)"
                class="text-green-600 hover:text-green-900"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            No documents uploaded
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Document Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Upload Document</h3>
            <button 
              @click="closeUploadModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="uploadDocument" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Document Name</label>
              <input 
                v-model="documentForm.name"
                type="text" 
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Document Type</label>
              <select 
                v-model="documentForm.type"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="certificate">Certificate</option>
                <option value="reference">Reference</option>
                <option value="portfolio">Portfolio</option>
                <option value="photo">Photo</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">File</label>
              <input 
                type="file" 
                @change="handleFileChange"
                required
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              >
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                @click="closeUploadModal"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isUploading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {{ isUploading ? 'Uploading...' : 'Upload Document' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../../store/auth';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const auth = useAuthStore();

// Define props
const props = defineProps({
  playerData: {
    type: Object,
    required: true
  }
});

// Reactive data
const showUploadModal = ref(false);
const isUploading = ref(false);
const selectedFile = ref(null);

const documentForm = ref({
  name: '',
  type: 'certificate'
});

// Computed properties
const userInitials = computed(() => {
  const name = props.playerData?.fullName || 'P';
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function editProfile() {
  // In a real implementation, this would navigate to the edit profile page
  alert('Edit profile functionality would be implemented here');
}

function viewDocument(doc) {
  // In a real implementation, this would open the document
  alert(`Viewing document: ${doc.name}`);
}

function closeUploadModal() {
  showUploadModal.value = false;
  documentForm.value = {
    name: '',
    type: 'certificate'
  };
  selectedFile.value = null;
}

function handleFileChange(event) {
  selectedFile.value = event.target.files[0];
}

async function uploadDocument() {
  if (!selectedFile.value) {
    alert('Please select a file to upload');
    return;
  }

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append('document', selectedFile.value);
    formData.append('name', documentForm.value.name);
    formData.append('type', documentForm.value.type);

    // In a real implementation, this would make an API call
    // await axios.post(`${API}/players/upload-document`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   withCredentials: true
    // });

    alert('Document uploaded successfully');
    closeUploadModal();
    // In a real implementation, we would refresh the player data
  } catch (error) {
    console.error('Error uploading document:', error);
    alert('Failed to upload document. Please try again.');
  } finally {
    isUploading.value = false;
  }
}
</script>