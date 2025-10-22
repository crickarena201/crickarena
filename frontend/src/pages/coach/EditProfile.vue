<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p class="text-gray-600 mt-2">Update your coaching profile information</p>
        </div>
        <button 
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Profile
        </button>
      </div>

      <form @submit.prevent="submitProfile" class="space-y-8">
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
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <option value="">Select Gender</option>
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
                pattern="^(\+91[\s-]?)?[6-9]\d{9}$"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                disabled
                class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
                placeholder="Your email address"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Street Address (Optional)</label>
              <input
                v-model="form.address.street"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your street address"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                v-model="form.address.city"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District *</label>
              <select
                v-model="form.address.district"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                pattern="^\d{6}$"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit pincode"
              />
            </div>
          </div>
        </div>

        <!-- Cricket Coaching Information -->
        <div class="bg-gray-50 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Cricket Coaching Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Coaching Experience *</label>
              <select
                v-model="form.coachingExperience"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Coaching Experience</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Coaching Specializations *</label>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <label v-for="spec in specializations" :key="spec.value" class="flex items-center">
                  <input
                    v-model="form.specializations"
                    :value="spec.value"
                    type="checkbox"
                    class="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm">{{ spec.label }}</span>
                </label>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Coaching Philosophy</label>
              <textarea
                v-model="form.coachingPhilosophy"
                rows="3"
                maxlength="1000"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your coaching philosophy and approach to developing players..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.coachingPhilosophy.length }}/1000 characters</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Coaching Methodology</label>
              <textarea
                v-model="form.methodology"
                rows="3"
                maxlength="1000"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your training methods, techniques, and approach to coaching..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ form.methodology.length }}/1000 characters</p>
            </div>
          </div>
        </div>

        <!-- Coaching History -->
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Coaching History</h2>
            <button
              type="button"
              @click="addCoachingEntry"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Add Entry
            </button>
          </div>
          
          <div v-if="form.coachingHistory.length === 0" class="text-gray-500 text-center py-4">
            No coaching history added yet. Click "Add Entry" to add your coaching experience.
          </div>
          
          <div v-for="(entry, index) in form.coachingHistory" :key="index" class="bg-white rounded-lg p-4 mb-4 border">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">Coaching Entry {{ index + 1 }}</h3>
              <button
                type="button"
                @click="removeCoachingEntry(index)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Team/Club Name *</label>
                <input
                  v-model="entry.teamName"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team or club name"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Position *</label>
                <input
                  v-model="entry.position"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Head Coach, Assistant Coach"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Years Coached *</label>
                <input
                  v-model="entry.yearsCoached"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2018-2021"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Achievements (Optional)</label>
                <input
                  v-model="entry.achievements"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Won State Championship"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  v-model="entry.description"
                  rows="2"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional details about your coaching role..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Certifications</h2>
            <button
              type="button"
              @click="addCertification"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Add Certification
            </button>
          </div>
          
          <div v-if="form.certifications.length === 0" class="text-gray-500 text-center py-4">
            No certifications added yet. Click "Add Certification" to add your coaching certifications.
          </div>
          
          <div v-for="(cert, index) in form.certifications" :key="index" class="bg-white rounded-lg p-4 mb-4 border">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">Certification {{ index + 1 }}</h3>
              <button
                type="button"
                @click="removeCertification(index)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Certification Name *</label>
                <input
                  v-model="cert.name"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Level 2 Coaching Certificate"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Issuing Body *</label>
                <input
                  v-model="cert.issuingBody"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., BCCI, ICC"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Level *</label>
                <select
                  v-model="cert.level"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                  <option value="Level 4">Level 4</option>
                  <option value="Master">Master</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Year Obtained *</label>
                <input
                  v-model="cert.yearObtained"
                  type="number"
                  required
                  :min="1950"
                  :max="currentYear"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-6">
          <button
            type="button"
            @click="goBack"
            class="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../../store/auth';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
const router = useRouter();
const auth = useAuthStore();

const isSubmitting = ref(false);

// Form data
const form = reactive({
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: {
    street: '',
    city: '',
    district: '',
    state: 'Kerala',
    pincode: ''
  },
  coachingExperience: '',
  specializations: [],
  coachingPhilosophy: '',
  methodology: '',
  coachingHistory: [],
  certifications: []
});

// Kerala districts
const keralaDistricts = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

// Specializations
const specializations = [
  { value: 'batting', label: 'Batting' },
  { value: 'bowling', label: 'Bowling' },
  { value: 'fielding', label: 'Fielding' },
  { value: 'wicket-keeping', label: 'Wicket Keeping' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental-coaching', label: 'Mental Coaching' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'youth-development', label: 'Youth Development' }
];

// Computed properties for date validation
const currentYear = new Date().getFullYear();
const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18); // Minimum 18 years old
  return date.toISOString().split('T')[0];
});

const minDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 70); // Maximum 70 years old
  return date.toISOString().split('T')[0];
});

// Load current coach profile data
onMounted(async () => {
  try {
    const response = await axios.get(`${API}/coaches/profile`, { withCredentials: true });
    const coach = response.data.coach;
    
    // Populate form with existing data
    form.fullName = coach.fullName || '';
    form.dateOfBirth = coach.dateOfBirth ? new Date(coach.dateOfBirth).toISOString().split('T')[0] : '';
    form.gender = coach.gender || '';
    form.phone = coach.phone || '';
    form.email = coach.email || '';
    form.address = {
      street: coach.address?.street || '',
      city: coach.address?.city || '',
      district: coach.address?.district || '',
      state: coach.address?.state || 'Kerala',
      pincode: coach.address?.pincode || ''
    };
    form.coachingExperience = coach.coachingExperience || '';
    form.specializations = coach.specializations || [];
    form.coachingPhilosophy = coach.coachingPhilosophy || '';
    form.methodology = coach.methodology || '';
    form.coachingHistory = coach.coachingHistory || [];
    form.certifications = coach.certifications || [];
  } catch (error) {
    console.error('Error loading coach profile:', error);
    alert('Failed to load profile data. Please try again.');
  }
});

// Coaching history functions
function addCoachingEntry() {
  form.coachingHistory.push({
    teamName: '',
    position: '',
    yearsCoached: '',
    achievements: '',
    description: ''
  });
}

function removeCoachingEntry(index) {
  form.coachingHistory.splice(index, 1);
}

// Certification functions
function addCertification() {
  form.certifications.push({
    name: '',
    issuingBody: '',
    level: '',
    yearObtained: ''
  });
}

function removeCertification(index) {
  form.certifications.splice(index, 1);
}

// Form submission
async function submitProfile() {
  isSubmitting.value = true;
  try {
    const response = await axios.put(`${API}/coaches/profile`, form, { withCredentials: true });
    
    // Update auth store with new profile data
    if (auth.userProfile) {
      auth.userProfile = { ...auth.userProfile, ...response.data.coach };
    }
    
    alert('Profile updated successfully!');
    router.push({ name: 'coach-panel-profile' });
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile. Please check your information and try again.');
  } finally {
    isSubmitting.value = false;
  }
}

// Navigation
function goBack() {
  router.push({ name: 'coach-panel-profile' });
}
</script>