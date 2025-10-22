<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p class="text-gray-600">Manage your personal information and account settings</p>
      </div>

      <!-- Profile Photo Section -->
      <section class="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Photo
        </h2>
        
        <div class="flex flex-col md:flex-row items-center gap-8">
          <!-- Photo Display -->
          <div class="relative group">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg transition-transform group-hover:scale-105">
              <img
                v-if="photoUrl"
                :src="photoUrl"
                alt="Profile"
                class="w-full h-full object-cover"
                @error="photoUrl = null"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span class="text-white text-4xl font-bold">{{ getUserInitials() }}</span>
              </div>
            </div>
            <label class="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-3 cursor-pointer hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                type="file"
                accept="image/*"
                @change="uploadPhoto"
                class="hidden"
                ref="photoInput"
              />
            </label>
          </div>
          
          <!-- Photo Instructions -->
          <div class="flex-1 text-center md:text-left">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Update Your Photo</h3>
            <p class="text-gray-600 mb-4">Click the camera icon to upload a new profile picture</p>
            <ul class="text-sm text-gray-500 space-y-1">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                JPG, PNG, or GIF format
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Maximum file size: 2MB
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Square images work best
              </li>
            </ul>
            <button
              v-if="photoUrl"
              @click="removePhoto"
              class="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
            >
              Remove Photo
            </button>
          </div>
        </div>
      </section>

      <!-- Personal Information -->
      <section class="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Personal Information
        </h2>
        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                :value="email"
                type="email"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                disabled
              />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                v-model="form.district"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              >
                <option value="">Select district</option>
                <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Change Password -->
      <section class="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Change Password
        </h2>
        <form @submit.prevent="changePassword" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
            <input
              v-model="pw.old"
              type="password"
              required
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Enter current password"
            />
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
              <input
                v-model="pw.new1"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
              <input
                v-model="pw.new2"
                type="password"
                required
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                At least 8 characters long
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Contains uppercase letter
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Contains number
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Contains special character
              </li>
            </ul>
          </div>
          
          <div class="flex items-center justify-between">
            <RouterLink to="/forgot-password" class="text-sm text-emerald-700 hover:text-emerald-800 underline font-medium">
              Forgot your password?
            </RouterLink>
            <button
              type="submit"
              :disabled="changing"
              class="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="!changing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ changing ? 'Updating...' : 'Change Password' }}</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Role & Access -->
      <section class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Role & Access
        </h2>
        <div class="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600 mb-1">Your Current Role</p>
              <p class="text-2xl font-bold text-gray-900 capitalize">{{ currentRole }}</p>
            </div>
            <div class="px-4 py-2 bg-white rounded-lg border border-emerald-300 text-emerald-700 font-medium text-sm">
              Active
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { notify } from '../utils/notifications';
import { auth } from '../firebase/client';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const authStore = useAuthStore();
const saving = ref(false);
const changing = ref(false);
const photoUrl = ref(null);
const photoInput = ref(null);
const form = reactive({ name: '', phone: '', district: '' });
const email = computed(() => authStore.user?.email || '');
const currentRole = computed(() => authStore.userProfile?.role || 'public');

const districts = [
  'Thiruvananthapuram','Kollam','Pathanamthitta','Alappuzha','Kottayam','Idukki','Ernakulam','Thrissur','Palakkad','Malappuram','Kozhikode','Wayanad','Kannur','Kasaragod'
];

function getUserInitials() {
  const name = form.name || authStore.user?.displayName || authStore.user?.email?.split('@')[0] || 'U';
  const words = name.split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

async function loadPhoto() {
  const role = authStore.userProfile?.role;
  if (!role || role === 'public' || role === 'clubManager') {
    // No photo API for public users and club managers yet
    photoUrl.value = null;
    return;
  }
  
  try {
    const idTok = authStore.user ? await authStore.user.getIdToken(true) : null;
    const endpoint = role === 'player' ? '/players/photo' : role === 'coach' ? '/coaches/photo' : null;
    if (!endpoint) return;
    
    const response = await axios.get(`${API}${endpoint}`, {
      headers: { ...(idTok ? { Authorization: `Bearer ${idTok}` } : {}) },
      responseType: 'blob',
      withCredentials: true
    });
    
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    photoUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error loading photo:', error);
    }
    photoUrl.value = null;
  }
}

async function uploadPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    notify.warning('File size must be less than 2MB');
    event.target.value = '';
    return;
  }
  
  if (!file.type.startsWith('image/')) {
    notify.error('Please select a valid image file');
    event.target.value = '';
    return;
  }
  
  const role = authStore.userProfile?.role;
  if (!role || role === 'public' || role === 'clubManager') {
    notify.error('Profile photo upload is only available for players and coaches');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('photo', file);
    
    const idTok = authStore.user ? await authStore.user.getIdToken(true) : null;
    const endpoint = role === 'player' ? '/players/upload-photo' : role === 'coach' ? '/coaches/upload-photo' : null;
    if (!endpoint) return;
    
    await axios.post(`${API}${endpoint}`, formData, {
      headers: {
        ...(idTok ? { Authorization: `Bearer ${idTok}` } : {}),
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    
    await loadPhoto();
    notify.success('Profile photo uploaded successfully!');
    
    // Trigger navbar refresh
    window.dispatchEvent(new CustomEvent('profile-photo-updated'));
  } catch (error) {
    console.error('Error uploading photo:', error);
    notify.error(error.response?.data?.message || 'Failed to upload photo');
  }
}

async function removePhoto() {
  // For now, just clear the preview
  photoUrl.value = null;
  notify.info('To remove your photo permanently, please upload a new one');
}

onMounted(() => {
  // Pre-fill from profile store
  const u = authStore.userProfile || {};
  form.name = u.name || authStore.user?.displayName || '';
  form.phone = u.phone || '';
  form.district = u.district || '';
  
  // Load photo
  loadPhoto();
});

async function saveProfile(){
  try {
    saving.value = true;
    await axios.put(`${API}/users/me`, { name: form.name, phone: form.phone, district: form.district });
    // Refresh store profile
    const { data } = await axios.get(`${API}/auth/profile`);
    authStore.userProfile = data.user;
    notify.success('Profile updated successfully');
    
    // Trigger navbar refresh
    window.dispatchEvent(new CustomEvent('profile-updated'));
  } catch (e) {
    notify.error(e?.response?.data?.message || 'Failed to update profile');
  } finally {
    saving.value = false;
  }
}

function validatePassword(p) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(p);
}

async function changePassword(){
  try {
    if (pw.new1 !== pw.new2) {
      notify.error('Passwords do not match');
      return;
    }
    if (pw.new1 === pw.old) {
      notify.warning('New password must be different from old password');
      return;
    }
    if (!validatePassword(pw.new1)) {
      notify.error('Password must be at least 8 characters with uppercase, number, and special character');
      return;
    }

    changing.value = true;
    // Reauthenticate
    const user = auth?.currentUser;
    if (!user?.email) throw new Error('Not authenticated');
    const cred = EmailAuthProvider.credential(user.email, pw.old);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, pw.new1);
    
    // Reset form
    pw.old = '';
    pw.new1 = '';
    pw.new2 = '';
    
    notify.success('Password updated successfully');
  } catch (e) {
    notify.error(e?.message || 'Failed to change password');
  } finally {
    changing.value = false;
  }
}

const pw = reactive({ old: '', new1: '', new2: '' });
</script>