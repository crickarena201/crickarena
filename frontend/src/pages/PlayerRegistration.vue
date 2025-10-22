<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Player Registration</h1>
        <p class="text-gray-600 mt-2">Complete your player profile to start applying to clubs</p>
      </div>

      <form @submit.prevent="submitRegistration" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                required
                :max="maxDate"
                :min="minDate"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                v-model="form.phone"
                type="tel"
                required
                @input="validatePhoneNumber"
                @blur="validatePhoneNumber"
                :class="[
                  'w-full border rounded-lg px-4 py-2 focus:ring-2 focus:border-transparent transition',
                  phoneValidation.error && phoneValidation.touched
                    ? 'border-red-500 focus:ring-red-500'
                    : phoneValidation.isValid && form.phone
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-green-500'
                ]"
                placeholder="+91 9876543210"
              />
              <div class="mt-1 min-h-[20px]">
                <p v-if="phoneValidation.error && phoneValidation.touched" class="text-sm text-red-600">
                  {{ phoneValidation.error }}
                </p>
                <p v-else-if="phoneValidation.isValid && form.phone" class="text-sm text-green-600">
                  ✓ Valid phone number
                </p>
                <p v-else class="text-sm text-gray-500">
                  Enter a 10-digit Indian mobile number
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                v-model="form.address.street"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your street address"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                v-model="form.address.city"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <select
                v-model="form.address.district"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select District</option>
                <option v-for="district in keralaDistricts" :key="district" :value="district">{{ district }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <input
                v-model="form.address.state"
                type="text"
                required
                value="Kerala"
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
                maxlength="6"
                @input="validatePincodeField"
                @blur="validatePincodeField"
                :class="[
                  'w-full border rounded-lg px-4 py-2 focus:ring-2 focus:border-transparent transition',
                  pincodeValidation.error && pincodeValidation.touched
                    ? 'border-red-500 focus:ring-red-500'
                    : pincodeValidation.isValid && form.address.pincode
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-green-500'
                ]"
                placeholder="Enter 6-digit pincode"
              />
              <div class="mt-1 min-h-[20px]">
                <p v-if="pincodeValidation.error && pincodeValidation.touched" class="text-sm text-red-600">
                  {{ pincodeValidation.error }}
                </p>
                <p v-else-if="pincodeValidation.isValid && form.address.pincode" class="text-sm text-green-600">
                  ✓ Valid pincode
                </p>
                <p v-else class="text-sm text-gray-500">
                  Enter a 6-digit pincode
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Cricket Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Cricket Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Playing Role *</label>
              <select
                v-model="form.preferredPosition"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Playing Role</option>
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all-rounder">All-rounder</option>
                <option value="wicket-keeper">Wicketkeeper</option>
                <option value="fielder">Fielder</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Batting Style *</label>
              <select
                v-model="form.battingStyle"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Batting Style</option>
                <option value="right-handed">Right-handed</option>
                <option value="left-handed">Left-handed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bowling Style *</label>
              <select
                v-model="form.bowlingStyle"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Bowling Style</option>
                <option value="right-arm-fast">Right-arm Fast</option>
                <option value="left-arm-fast">Left-arm Fast</option>
                <option value="right-arm-medium">Right-arm Medium</option>
                <option value="left-arm-medium">Left-arm Medium</option>
                <option value="right-arm-spin">Right-arm Spin</option>
                <option value="left-arm-spin">Left-arm Spin</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Jersey Number</label>
              <input
                v-model.number="form.jerseyNumber"
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 7"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Playing Experience *</label>
              <select
                v-model="form.playingExperience"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Experience</option>
                <option value="beginner">Beginner</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Career History -->
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Career History</h2>
            <button
              type="button"
              @click="addCareerEntry"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
            >
              Add Entry
            </button>
          </div>
          
          <div v-if="form.careerHistory.length === 0" class="text-gray-500 text-center py-4">
            No career history added yet. Click "Add Entry" to add your cricket experience.
          </div>
          
          <div v-for="(entry, index) in form.careerHistory" :key="index" class="bg-white rounded-lg p-4 mb-4 border">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">Career Entry {{ index + 1 }}</h3>
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
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Team/Club name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  v-model="entry.position"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your position in the team"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Years Played *</label>
                <input
                  v-model="entry.yearsPlayed"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 2018-2020"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <input
                  v-model="entry.achievements"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Notable achievements"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="entry.description"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of your experience"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Photo (Optional) -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Photo</h2>
          <div class="flex items-center gap-4">
            <input ref="photoInput" type="file" accept="image/*" @change="onPhotoSelected" />
            <span class="text-sm text-gray-500">PNG/JPG up to 5MB</span>
          </div>
          <div v-if="photoPreview" class="mt-4">
            <img :src="photoPreview" alt="Preview" class="w-24 h-24 rounded-full object-cover border" />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-center">
          <button
            type="submit"
            :disabled="loading"
            class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating Profile...</span>
            <span v-else>Create Player Profile</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { validatePhone, validatePincode } from '../utils/validation';
import { notify } from '../utils/notifications';
import axios from 'axios';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const keralaDistricts = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
  'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
  'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

const form = ref({
  fullName: '',
  dateOfBirth: '',
  gender: 'male',
  phone: '',
  email: auth.user?.email || '',
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
  jerseyNumber: '',
  careerHistory: []
});

// Phone validation state
const phoneValidation = ref({
  isValid: false,
  error: '',
  touched: false
});

// Pincode validation state
const pincodeValidation = ref({
  isValid: false,
  error: '',
  touched: false
});

// Validate phone number in real-time
const validatePhoneNumber = () => {
  phoneValidation.value.touched = true;
  const result = validatePhone(form.value.phone);
  phoneValidation.value.isValid = result.isValid;
  phoneValidation.value.error = result.error;
};

// Validate pincode in real-time
const validatePincodeField = () => {
  pincodeValidation.value.touched = true;
  const result = validatePincode(form.value.address.pincode);
  pincodeValidation.value.isValid = result.isValid;
  pincodeValidation.value.error = result.error;
};

// Calculate min and max dates (16-50 years old)
const today = new Date();
const maxDate = computed(() => {
  const date = new Date(today);
  date.setFullYear(date.getFullYear() - 16);
  return date.toISOString().split('T')[0];
});

const minDate = computed(() => {
  const date = new Date(today);
  date.setFullYear(date.getFullYear() - 50);
  return date.toISOString().split('T')[0];
});

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

const photoInput = ref(null);
const photoPreview = ref('');
let selectedPhotoFile = null;

const fetchExistingPhoto = async () => {
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    const response = await axios.get(`${API}/players/photo`, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {})
      },
      responseType: 'blob',
      withCredentials: true
    });

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    photoPreview.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching existing photo:', error);
    photoPreview.value = '';
  }
};

const onPhotoSelected = (e) => {
  const file = e.target.files?.[0];
  if (!file) { selectedPhotoFile = null; photoPreview.value = ''; return; }
  if (file.size > 2 * 1024 * 1024) {
    notify.warning('File size must be less than 2MB');
    e.target.value = '';
    return;
  }
  selectedPhotoFile = file;
  const reader = new FileReader();
  reader.onload = () => { photoPreview.value = reader.result; };
  reader.readAsDataURL(file);
};

const loadExistingProfile = async () => {
  try {
    const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
    const player = response.data.player;
    if (player) {
      // Pre-fill form with existing data
      form.value = {
        fullName: player.fullName || '',
        dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth).toISOString().split('T')[0] : '',
        gender: 'male',
        phone: player.phone || '',
        email: player.email || auth.user?.email || '',
        address: {
          street: player.address?.street || '',
          city: player.address?.city || '',
          district: player.address?.district || '',
          state: player.address?.state || 'Kerala',
          pincode: player.address?.pincode || ''
        },
        battingStyle: player.battingStyle || '',
        bowlingStyle: player.bowlingStyle || '',
        preferredPosition: player.preferredPosition || '',
        playingExperience: player.playingExperience || '',
        jerseyNumber: player.jerseyNumber || '',
        careerHistory: player.careerHistory || []
      };

      // Load profile photo if exists
      if (player.hasProfilePhoto) {
        await fetchExistingPhoto();
      }
    }
  } catch (e) {
    // If no profile exists, that's fine - form stays empty
    if (e?.response?.status !== 404) {
      console.warn('Error loading existing profile:', e);
    }
  }
};

onMounted(() => {
  loadExistingProfile();
});

const submitRegistration = async () => {
  // Validate phone before submission
  validatePhoneNumber();
  
  if (!phoneValidation.value.isValid) {
    notify.error('Please enter a valid phone number');
    return;
  }
  
  // Validate pincode before submission
  validatePincodeField();
  
  if (!pincodeValidation.value.isValid) {
    notify.error('Please enter a valid 6-digit pincode');
    return;
  }
  
  loading.value = true;
  try {
    // Ensure backend has a User doc first (if not already created during auth/register step)
    const idTok = auth.user ? await auth.user.getIdToken(true) : null;
    if (idTok) {
      try { await axios.post(`${API}/auth/session/login`, { idToken: idTok }); } catch {}
      let userDocExists = false;
      try {
        const prof = await axios.get(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${idTok}` }, withCredentials: true });
        userDocExists = !!prof?.data?.user?._id;
      } catch (e) {
        userDocExists = false;
      }
      if (!userDocExists) {
        try {
          await axios.post(`${API}/auth/register`, {
            firebaseUid: auth.user.uid,
            name: auth.user.displayName || (auth.user.email?.split('@')[0] || 'Player'),
            email: auth.user.email,
            role: 'player'
          }, { headers: { Authorization: `Bearer ${idTok}` }, withCredentials: true });
        } catch (e) {
          // If backend says already registered with different email, surface that
          throw e;
        }
      }
    }
    // Check if player profile already exists
    let existingProfile = null;
    try {
      const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
      existingProfile = response.data.player;
    } catch (e) {
      // 404 means no profile exists, which is fine
      if (e?.response?.status !== 404) {
        console.warn('Error checking existing profile:', e);
      }
    }

    // Ensure auth header is sent (session cookie may not be present in some environments)
    let idToken = auth.idToken;
    try { if (auth.user) { idToken = await auth.user.getIdToken(true); } } catch {}
    const config = idToken ? { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true } : { withCredentials: true };

    if (existingProfile) {
      // Update existing profile
      await axios.put(`${API}/players/profile`, form.value, config);
    } else {
      // Create new profile
      await axios.post(`${API}/players/register`, form.value, config);
    }

    if (selectedPhotoFile) {
      const idTok2 = auth.user ? await auth.user.getIdToken(true) : null;
      const fd = new FormData();
      fd.append('photo', selectedPhotoFile);
      await axios.post(`${API}/players/upload-photo`, fd, {
        headers: { ...(idTok2 ? { Authorization: `Bearer ${idTok2}` } : {}), 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
    }
    
    notify.success('Player profile created successfully! You can now apply to clubs.', 6000);
    
    // Navigate after a short delay to let user see the success message
    setTimeout(() => {
      router.push('/player-panel');
    }, 1500);
  } catch (error) {
    console.error('Registration error:', error);
    const firstValidation = Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length
      ? (error.response.data.errors[0].msg || error.response.data.errors[0].message || '')
      : '';
    const message = firstValidation || error.response?.data?.message || 'Failed to create player profile';
    notify.error(message, 6000);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Custom styles for better form appearance */
input:focus, select:focus, textarea:focus {
  outline: none;
}

.grid {
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>