<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Edit Player Profile</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <form @submit.prevent="updateProfile" class="p-6 space-y-6">
        <!-- Profile Photo Upload -->
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-4 relative">
            <img
              v-if="photoUrl"
              :src="photoUrl"
              alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              @error="photoUrl = null; hasProfilePhoto = false"
            />
            <div v-else class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <label class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                type="file"
                accept="image/*"
                @change="uploadPhoto"
                class="hidden"
              />
            </label>
          </div>
          <p class="text-sm text-gray-600">Click the camera icon to upload a profile photo</p>
        </div>

        <!-- Basic Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                v-model="form.gender"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Cricket Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Cricket Information</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Batting Style *</label>
              <select
                v-model="form.battingStyle"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="right-handed">Right-handed</option>
                <option value="left-handed">Left-handed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bowling Style *</label>
              <select
                v-model="form.bowlingStyle"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="right-arm-fast">Right-arm Fast</option>
                <option value="left-arm-fast">Left-arm Fast</option>
                <option value="right-arm-medium">Right-arm Medium</option>
                <option value="left-arm-medium">Left-arm Medium</option>
                <option value="right-arm-spin">Right-arm Spin</option>
                <option value="left-arm-spin">Left-arm Spin</option>
                <option value="wicket-keeper">Wicket-keeper</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Position *</label>
              <select
                v-model="form.preferredPosition"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all-rounder">All-rounder</option>
                <option value="wicket-keeper">Wicket-keeper</option>
                <option value="fielder">Fielder</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Playing Experience *</label>
              <select
                v-model="form.playingExperience"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
              <input
                v-model="form.address.street"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                v-model="form.address.city"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <select
                v-model="form.address.district"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="district in keralaDistricts" :key="district" :value="district">{{ district }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <input
                v-model="form.address.state"
                type="text"
                required
                readonly
                class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
              <input
                v-model="form.address.pincode"
                type="text"
                required
                pattern="^\d{6}$"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Career History -->
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Career History</h3>
            <button
              type="button"
              @click="addCareerEntry"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Add Entry
            </button>
          </div>
          
          <div v-if="form.careerHistory.length === 0" class="text-gray-500 text-center py-4">
            No career history added yet.
          </div>
          
          <div v-for="(entry, index) in form.careerHistory" :key="index" class="bg-white rounded-lg p-4 mb-4 border">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900">Career Entry {{ index + 1 }}</h4>
              <button
                type="button"
                @click="removeCareerEntry(index)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                <input
                  v-model="entry.teamName"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  v-model="entry.position"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Years Played *</label>
                <input
                  v-model="entry.yearsPlayed"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <input
                  v-model="entry.achievements"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="entry.description"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Updating...</span>
            <span v-else>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const props = defineProps({
  player: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'updated']);

const auth = useAuthStore();
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const loading = ref(false);
const hasProfilePhoto = ref(false);
const photoUrl = ref(null);

const keralaDistricts = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
  'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
  'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

const form = ref({
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  address: {
    street: '',
    city: '',
    district: '',
    state: 'Kerala',
    pincode: ''
  },
  battingStyle: '',
  bowlingStyle: '',
  preferredPosition: '',
  playingExperience: '',
  careerHistory: []
});

const initializeForm = () => {
  if (props.player) {
    form.value = {
      fullName: props.player.fullName || '',
      dateOfBirth: props.player.dateOfBirth ? props.player.dateOfBirth.split('T')[0] : '',
      gender: props.player.gender || '',
      phone: props.player.phone || '',
      address: {
        street: props.player.address?.street || '',
        city: props.player.address?.city || '',
        district: props.player.address?.district || '',
        state: props.player.address?.state || 'Kerala',
        pincode: props.player.address?.pincode || ''
      },
      battingStyle: props.player.battingStyle || '',
      bowlingStyle: props.player.bowlingStyle || '',
      preferredPosition: props.player.preferredPosition || '',
      playingExperience: props.player.playingExperience || '',
      careerHistory: props.player.careerHistory ? [...props.player.careerHistory] : []
    };
    hasProfilePhoto.value = props.player.hasProfilePhoto || false;
  }
};

const addCareerEntry = () => {
  form.value.careerHistory.push({
    teamName: '',
    position: '',
    yearsPlayed: '',
    achievements: '',
    description: ''
  });
};

const removeCareerEntry = (index) => {
  form.value.careerHistory.splice(index, 1);
};

const fetchPhoto = async () => {
  if (!hasProfilePhoto.value) {
    photoUrl.value = null;
    return;
  }

  try {
    // Clean up previous blob URL to prevent memory leaks
    if (photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value);
    }

    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    // Add cache-busting parameter to prevent browser caching issues
    const cacheBuster = Date.now();
    const response = await axios.get(`${API}/players/photo?t=${cacheBuster}`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {}),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      responseType: 'blob',
      withCredentials: true
    });

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    photoUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    // Handle expected 404 errors (no photo uploaded) differently from other errors
    if (error.response?.status === 404) {
      console.log('No profile photo found for this user');
      photoUrl.value = null;
      hasProfilePhoto.value = false;
    } else {
      console.error('Error fetching photo:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
      photoUrl.value = null;
      hasProfilePhoto.value = false;
    }
  }
};

const uploadPhoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB');
    event.target.value = '';
    return;
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    await axios.post(`${API}/players/upload-photo`, formData, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {}),
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    hasProfilePhoto.value = true;
    await fetchPhoto(); // Fetch the photo immediately after upload
    alert('Profile photo uploaded successfully');
    // Emit updated event to refresh dashboard data after a brief delay
    setTimeout(() => emit('updated'), 500);
  } catch (error) {
    console.error('Error uploading photo:', error);
    alert('Failed to upload photo');
  }
};

const updateProfile = async () => {
  loading.value = true;
  try {
    await axios.put(`${API}/players/profile`, form.value);
    alert('Profile updated successfully');
    emit('updated');
    emit('close');
  } catch (error) {
    console.error('Error updating profile:', error);
    const message = error.response?.data?.message || 'Failed to update profile';
    alert(message);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  initializeForm();
  await fetchPhoto();
});
</script>

<style scoped>
.grid {
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>