<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Upload Document</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mt-2">Upload certificates, scorecards, or other cricket-related documents</p>
      </div>

      <form @submit.prevent="uploadDocument" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Cricket Certificate, Match Scorecard"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
          <select
            v-model="form.type"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Document Type</option>
            <option value="certificate">Certificate</option>
            <option value="scorecard">Scorecard</option>
            <option value="photo">Photo</option>
            <option value="reference">Reference Letter</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">File *</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
            <input
              ref="fileInput"
              type="file"
              accept="image/*,.pdf"
              @change="handleFileSelect"
              class="hidden"
            />
            <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-gray-600">Click to upload file</p>
              <p class="text-sm text-gray-500 mt-1">Images and PDF files up to 5MB</p>
            </div>
            <div v-else class="space-y-2">
              <div class="flex items-center justify-center gap-2">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-green-600 font-medium">{{ selectedFile.name }}</span>
              </div>
              <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
              <button
                type="button"
                @click="clearFile"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove file
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!selectedFile || loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Uploading...</span>
            <span v-else>Upload Document</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'uploaded']);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(false);
const selectedFile = ref(null);

const form = ref({
  name: '',
  type: ''
});

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only images (JPEG, PNG, GIF) and PDF files are allowed');
      return;
    }
    
    selectedFile.value = file;
  }
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const uploadDocument = async () => {
  if (!selectedFile.value) {
    alert('Please select a file to upload');
    return;
  }

  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('document', selectedFile.value);
    formData.append('name', form.value.name);
    formData.append('type', form.value.type);

    await axios.post(`${API}/players/upload-document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Document uploaded successfully');
    emit('uploaded');
    emit('close');
  } catch (error) {
    console.error('Error uploading document:', error);
    const message = error.response?.data?.message || 'Failed to upload document';
    alert(message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Custom styles for file upload area */
.border-dashed:hover {
  border-color: #9CA3AF;
}
</style>