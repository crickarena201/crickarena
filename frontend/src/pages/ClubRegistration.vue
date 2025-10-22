<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Club Manager Portal
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Register Your Cricket Club</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Join Kerala's premier cricket platform. Register your club and connect with the grassroots cricket community across God's Own Country.
        </p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <h2 class="text-2xl font-bold text-white">Club Registration Form</h2>
          <p class="text-green-100 mt-2">Fill in the details below to register your cricket club</p>
        </div>

        <form @submit.prevent="submitRegistration" class="p-8 space-y-6">
          <!-- Club Basic Information -->
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Club Name *</label>
              <input 
                v-model="form.clubName" 
                @blur="validateClubName"
                type="text" 
                required 
                placeholder="e.g., Kochi Cricket Club"
                :class="[
                  'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                  errors.clubName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                ]"
              />
              <p v-if="errors.clubName" class="text-red-600 text-sm mt-1">{{ errors.clubName }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">District *</label>
              <select 
                v-model="form.district" 
                required 
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                <option value="">Select District</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                <option value="Kollam">Kollam</option>
                <option value="Pathanamthitta">Pathanamthitta</option>
                <option value="Alappuzha">Alappuzha</option>
                <option value="Kottayam">Kottayam</option>
                <option value="Idukki">Idukki</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Palakkad">Palakkad</option>
                <option value="Malappuram">Malappuram</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Wayanad">Wayanad</option>
                <option value="Kannur">Kannur</option>
                <option value="Kasaragod">Kasaragod</option>
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">City/Town *</label>
              <input 
                v-model="form.city" 
                type="text" 
                required 
                placeholder="e.g., Kochi"
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Founded Year</label>
              <input 
                v-model="form.foundedYear" 
                @blur="validateFoundedYear"
                type="number" 
                min="1850" 
                :max="new Date().getFullYear()"
                placeholder="e.g., 2010"
                :class="[
                  'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                  errors.foundedYear ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                ]"
              />
              <p v-if="errors.foundedYear" class="text-red-600 text-sm mt-1">{{ errors.foundedYear }}</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Manager Name *</label>
                <input 
                  v-model="form.managerName" 
                  @blur="validateManagerName"
                  type="text" 
                  required 
                  placeholder="Your full name"
                  :class="[
                    'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                    errors.managerName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  ]"
                />
                <p v-if="errors.managerName" class="text-red-600 text-sm mt-1">{{ errors.managerName }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Contact Phone *</label>
                <input 
                  v-model="form.phone" 
                  @blur="validatePhone"
                  type="tel" 
                  required 
                  placeholder="e.g., +91 9876543210"
                  :class="[
                    'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                    errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  ]"
                />
                <p v-if="errors.phone" class="text-red-600 text-sm mt-1">{{ errors.phone }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input 
                v-model="form.email" 
                @blur="validateEmailField"
                type="email" 
                required 
                placeholder="club@example.com"
                :class="[
                  'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                  errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                ]"
              />
              <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <!-- Club Details -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Club Details</h3>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Club Description</label>
              <textarea 
                v-model="form.description" 
                rows="4" 
                placeholder="Tell us about your club, its history, achievements, and goals..."
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              ></textarea>
            </div>
            <div class="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Ground/Venue Name</label>
                <input 
                  v-model="form.groundName" 
                  type="text" 
                  placeholder="e.g., Kochi Cricket Stadium"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Estimated Members</label>
                <input 
                  v-model="form.memberCount" 
                  type="number" 
                  min="1" 
                  placeholder="e.g., 25"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <!-- Club Logo Upload -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Club Logo</label>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img v-if="form.logoPreview" :src="form.logoPreview" alt="Logo preview" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-400 text-xs">No logo</span>
                </div>
                <div class="flex flex-col gap-2">
                  <input type="file" accept="image/*" @change="onLogoSelected" />
                  <p class="text-xs text-gray-500">PNG/JPG up to ~1MB recommended</p>
                </div>
              </div>
            </div>

            <!-- Club Proof Document Upload -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Proof of Registration/Documents *</label>
              <div class="flex items-center gap-4">
                <div class="flex flex-col gap-2">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" @change="onProofSelected" />
                  <p class="text-xs text-gray-500">PDF/JPG/PNG up to ~2MB recommended</p>
                  <p v-if="form.proofPreview" class="text-xs text-green-600">Document selected: {{ proofFileName }}</p>
                </div>
              </div>
            </div>

            <!-- Club Banner Upload removed -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Club Website/Social Media</label>
              <input 
                v-model="form.website" 
                @blur="validateWebsite"
                type="url" 
                placeholder="https://www.yourclub.com or social media link"
                :class="[
                  'w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all',
                  errors.website ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                ]"
              />
              <p v-if="errors.website" class="text-red-600 text-sm mt-1">{{ errors.website }}</p>
            </div>
            <div class="mt-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Special Achievements/Notes</label>
              <textarea 
                v-model="form.achievements" 
                rows="3" 
                placeholder="Any special achievements, tournaments won, or additional information..."
                class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Terms and Submit -->
          <div class="border-t pt-6">
            <div class="flex items-start gap-3 mb-6">
              <input 
                v-model="form.agreeTerms" 
                type="checkbox" 
                required 
                class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label class="text-sm text-gray-700">
                I agree to the <a href="#" class="text-green-600 hover:underline">Terms and Conditions</a> and confirm that all information provided is accurate. I understand that my club registration will be reviewed by the CrickArena admin team.
              </label>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit" 
                :disabled="isSubmitting || !isFormValid"
                :class="[
                  'flex-1 py-4 px-8 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300',
                  (isSubmitting || !isFormValid)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-1'
                ]"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
                  </svg>
                  Submitting...
                </span>
                <span v-else>Submit Registration</span>
              </button>
              <RouterLink 
                to="/crickhub" 
                class="flex-1 py-4 px-8 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 text-center"
              >
                Cancel
              </RouterLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { validateEmail, validateName } from '../utils/validation';
import { notify } from '../utils/notifications';

const router = useRouter();
const isSubmitting = ref(false);

const form = ref({
  clubName: '',
  district: '',
  city: '',
  foundedYear: '',
  managerName: '',
  phone: '',
  email: '',
  description: '',
  groundName: '',
  memberCount: '',
  website: '',
  achievements: '',
  logoUrl: '', // final URL to send to backend
  logoPreview: '', // local preview of selected file
  proofPreview: '', // local preview of selected proof file

  agreeTerms: false
});

// Validation errors
const errors = ref({
  clubName: '',
  district: '',
  city: '',
  foundedYear: '',
  managerName: '',
  phone: '',
  email: '',
  website: ''
});

// Form validation
const isFormValid = computed(() => {
  return form.value.clubName.trim() !== '' &&
         form.value.district !== '' &&
         form.value.city.trim() !== '' &&
         form.value.managerName.trim() !== '' &&
         form.value.phone.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.agreeTerms &&
         selectedProofFile.value !== null && // Proof document is required
         !Object.values(errors.value).some(error => error !== '');
});

// Computed property for proof file name
const proofFileName = computed(() => {
  if (selectedProofFile.value) {
    return selectedProofFile.value.name;
  }
  return '';
});

// Validation functions
function validateClubName() {
  if (!form.value.clubName.trim()) {
    errors.value.clubName = 'Club name is required';
  } else if (form.value.clubName.trim().length < 3) {
    errors.value.clubName = 'Club name must be at least 3 characters';
  } else if (form.value.clubName.trim().length > 100) {
    errors.value.clubName = 'Club name must be less than 100 characters';
  } else {
    errors.value.clubName = '';
  }
}

function validateManagerName() {
  const result = validateName(form.value.managerName);
  errors.value.managerName = result.error;
  if (result.cleanName) {
    form.value.managerName = result.cleanName;
  }
}

function validateEmailField() {
  const result = validateEmail(form.value.email);
  errors.value.email = result.error;
  if (result.cleanEmail) {
    form.value.email = result.cleanEmail;
  }
}

function validatePhone() {
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone number is required';
  } else {
    // Indian phone number validation
    const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
    const cleanPhone = form.value.phone.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.value.phone = 'Please enter a valid Indian phone number';
    } else {
      errors.value.phone = '';
    }
  }
}

function validateFoundedYear() {
  if (form.value.foundedYear) {
    const year = parseInt(form.value.foundedYear);
    const currentYear = new Date().getFullYear();
    if (year < 1850 || year > currentYear) {
      errors.value.foundedYear = `Founded year must be between 1850 and ${currentYear}`;
    } else {
      errors.value.foundedYear = '';
    }
  } else {
    errors.value.foundedYear = '';
  }
}

function validateWebsite() {
  if (form.value.website.trim()) {
    try {
      new URL(form.value.website);
      errors.value.website = '';
    } catch {
      errors.value.website = 'Please enter a valid URL';
    }
  } else {
    errors.value.website = '';
  }
}

const selectedLogoFile = ref(null);
const selectedProofFile = ref(null);
const selectedBannerFile = ref(null);

// Handle logo file selection
async function onLogoSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedLogoFile.value = file;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    notify.error('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
    return;
  }

  // Size guard ~1.5MB
  if (file.size > 1.5 * 1024 * 1024) {
    notify.error('Logo too large. Please choose an image under 1.5MB.');
    return;
  }

  // Additional security: Check file header (magic bytes)
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const validHeaders = {
    'ffd8ff': 'image/jpeg',
    '89504e47': 'image/png',
    '47494638': 'image/gif',
    '52494646': 'image/webp'
  };
  
  const isValidImage = Object.keys(validHeaders).some(header => hex.startsWith(header));
  if (!isValidImage) {
    notify.error('Invalid image file. Please select a valid image.');
    return;
  }

  // Clean up previous preview URL to prevent memory leaks
  if (form.value.logoPreview) {
    URL.revokeObjectURL(form.value.logoPreview);
  }

  // Show preview immediately
  form.value.logoPreview = URL.createObjectURL(file);

  try {
    // No data URL. Preview only; the actual file is sent as multipart/form-data.
    // Keep logoUrl empty; backend will serve at /api/clubs/:id/logo after approval.
    form.value.logoUrl = '';
  } catch (e) {
    console.error('Logo processing failed', e);
    notify.error('Failed to process logo. Please try a different image.');
  }
}

// Handle proof document selection
async function onProofSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedProofFile.value = file;

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    notify.error('Please select a valid document (PDF, JPEG, or PNG).');
    return;
  }

  // Size guard ~2MB
  if (file.size > 2 * 1024 * 1024) {
    notify.error('Document too large. Please choose a file under 2MB.');
    return;
  }

  // Additional security: Check file header (magic bytes)
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const validHeaders = {
    '25504446': 'application/pdf', // PDF
    'ffd8ff': 'image/jpeg', // JPEG
    '89504e47': 'image/png' // PNG
  };
  
  const isValidDocument = Object.keys(validHeaders).some(header => hex.startsWith(header));
  if (!isValidDocument) {
    notify.error('Invalid document file. Please select a valid PDF, JPEG, or PNG file.');
    return;
  }

  // Show preview indicator
  form.value.proofPreview = 'selected';

  try {
    // Document is valid
    notify.success('Document selected successfully.');
  } catch (e) {
    console.error('Document processing failed', e);
    notify.error('Failed to process document. Please try a different file.');
  }
}

// Handle banner file selection
async function onBannerSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedBannerFile.value = file;

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    notify.error('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    notify.error('Banner too large. Please choose an image under 2MB.');
    return;
  }

  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const validHeaders = {
    'ffd8ff': 'image/jpeg',
    '89504e47': 'image/png',
    '47494638': 'image/gif',
    '52494646': 'image/webp'
  };
  const isValidImage = Object.keys(validHeaders).some(header => hex.startsWith(header));
  if (!isValidImage) {
    notify.error('Invalid image file. Please select a valid image.');
    return;
  }

  if (form.value.bannerPreview) {
    URL.revokeObjectURL(form.value.bannerPreview);
  }
  form.value.bannerPreview = URL.createObjectURL(file);

  try {
    // Banner support removed
  } catch (e) {
    console.error('Banner processing failed', e);
    notify.error('Failed to process banner. Please try a different image.');
  }
}

async function submitRegistration() {
  // Validate all fields before submission
  validateClubName();
  validateManagerName();
  validateEmailField();
  validatePhone();
  validateFoundedYear();
  validateWebsite();
  
  if (!isFormValid.value) {
    notify.warning('Please fix all validation errors before submitting. Proof document is required.');
    return;
  }

  if (!form.value.agreeTerms) {
    notify.warning('Please agree to the terms and conditions');
    return;
  }

  isSubmitting.value = true;
  
  try {
    // Build clean payload: remove empty strings and coerce numbers
    const payload = { ...form.value };
    // Remove UI-only fields rejected by backend validation
    delete payload.logoPreview;
    delete payload.proofPreview;
    delete payload.bannerPreview;

    // Coerce numeric fields and drop if empty
    ['foundedYear', 'memberCount'].forEach((k) => {
      if (payload[k] === '' || payload[k] === null || payload[k] === undefined) {
        delete payload[k];
      } else {
        payload[k] = Number(payload[k]);
      }
    });

    // Remove optional fields if empty string
    ['description', 'groundName', 'website', 'achievements', 'logoUrl'].forEach((k) => {
      if (payload[k] === '' || payload[k] === null) delete payload[k];
    });

    // API call to submit club registration as multipart/form-data
    const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') formData.append(k, String(v));
    });
    // attach files if present
    if (selectedLogoFile.value) formData.append('logo', selectedLogoFile.value);
    if (selectedProofFile.value) formData.append('proof', selectedProofFile.value);
    if (selectedBannerFile.value) formData.append('banner', selectedBannerFile.value);

    await axios.post(`${API}/clubs/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    notify.success('Club registration submitted successfully! You will receive an email once your registration is reviewed by our admin team.');
    router.push('/crickhub');
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    notify.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  if (form.value.logoPreview) {
    URL.revokeObjectURL(form.value.logoPreview);
  }
  if (form.value.bannerPreview) {
    URL.revokeObjectURL(form.value.bannerPreview);
  }
});
</script>