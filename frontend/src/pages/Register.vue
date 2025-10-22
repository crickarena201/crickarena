<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background with cricket theme -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <!-- Cricket field pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-emerald-300 rounded-full"></div>
        <div class="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-emerald-300 rounded-full"></div>
        <!-- Cricket stumps -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-1 h-8 bg-emerald-400 mx-auto"></div>
          <div class="w-6 h-1 bg-emerald-400 mt-1"></div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <!-- Logo and branding -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl mb-3 shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Join CrickArena</h1>
          <p class="text-sm text-gray-600">Start your cricket journey</p>
        </div>

        <!-- Registration card -->
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          <div class="text-center mb-5">
            <h2 class="text-xl font-bold text-gray-900 mb-1">Create account</h2>
            <p class="text-sm text-gray-600">Quick and easy setup</p>
          </div>

          <!-- Google registration -->
          <div class="mb-4">
            <button 
              @click="onGoogleRegister" 
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
            >
              <img alt="Google" class="w-4 h-4 mr-2" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"/>
              Continue with Google
            </button>
          </div>

          <div class="relative mb-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or with email</span>
            </div>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-4">
            <!-- Basic Info Row -->
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  v-model.trim="name" 
                  @blur="validateNameField" 
                  type="text" 
                  required 
                  placeholder="Your full name"
                  :class="[
                    'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm',
                    nameErr ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-300'
                  ]" 
                />
                <p v-if="nameErr" class="text-red-600 text-xs mt-1">{{ nameErr }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  v-model.trim="email" 
                  @blur="validateEmailField" 
                  type="email" 
                  required 
                  placeholder="your@email.com"
                  :class="[
                    'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm',
                    emailErr ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-300'
                  ]" 
                />
                <p v-if="emailErr" class="text-red-600 text-xs mt-1">{{ emailErr }}</p>
              </div>
            </div>

            <!-- Password Row -->
            <div class="grid grid-cols-1 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div class="relative">
                  <input 
                    v-model="password" 
                    @input="validatePasswordField" 
                    @blur="validatePasswordField" 
                    :type="showPassword ? 'text' : 'password'" 
                    required 
                    minlength="8" 
                    placeholder="Create password"
                    :class="[
                      'w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm',
                      passwordErr ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-300'
                    ]" 
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword" 
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="!showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.548-4.226M6.223 6.223A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/>
                    </svg>
                  </button>
                </div>
                <p v-if="passwordErr" class="text-red-600 text-xs mt-1">{{ passwordErr }}</p>
                <!-- Simplified password requirements -->
                <div v-else-if="password" class="mt-1">
                  <div class="flex flex-wrap gap-2 text-xs">
                    <span :class="passwordValidation.length ? 'text-emerald-600' : 'text-gray-400'">8+ chars</span>
                    <span :class="passwordValidation.hasUppercase ? 'text-emerald-600' : 'text-gray-400'">A-Z</span>
                    <span :class="passwordValidation.hasLowercase ? 'text-emerald-600' : 'text-gray-400'">a-z</span>
                    <span :class="passwordValidation.hasNumber ? 'text-emerald-600' : 'text-gray-400'">0-9</span>
                    <span :class="passwordValidation.hasSpecial ? 'text-emerald-600' : 'text-gray-400'">!@#$</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div class="relative">
                  <input 
                    v-model="confirmPassword" 
                    @input="validateConfirmField" 
                    @blur="validateConfirmField" 
                    :type="showConfirm ? 'text' : 'password'" 
                    required 
                    minlength="8" 
                    placeholder="Confirm password"
                    :class="[
                      'w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm',
                      confirmErr ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-300'
                    ]" 
                  />
                  <button 
                    type="button" 
                    @click="showConfirm = !showConfirm" 
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg v-if="!showConfirm" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.548-4.226M6.223 6.223A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/>
                    </svg>
                  </button>
                </div>
                <p v-if="confirmErr" class="text-red-600 text-xs mt-1">{{ confirmErr }}</p>
              </div>
            </div>

            <!-- Role Selection - Compact -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">I want to be a</label>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="roleOption in roleOptions" 
                  :key="roleOption.value"
                  @click="role = roleOption.value"
                  :class="[
                    'p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center',
                    role === roleOption.value 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex flex-col items-center space-y-1">
                    <div :class="[
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      role === roleOption.value ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                    ]">
                      <div v-if="role === roleOption.value" class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <span class="text-xs font-medium text-gray-900">{{ roleOption.title }}</span>
                  </div>
                </div>
              </div>
              <p v-if="roleErr" class="text-red-600 text-xs mt-1">{{ roleErr }}</p>
            </div>

            <!-- Submit Button -->
            <button 
              :disabled="!isFormValid || isLoading" 
              :class="[
                'w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200',
                (!isFormValid || isLoading) 
                  ? 'opacity-60 cursor-not-allowed bg-gray-400' 
                  : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              ]"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
              <span v-else>Create Account</span>
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <RouterLink to="/login" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Sign in
                </RouterLink>
              </p>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            © 2024 CrickArena. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { validateEmail, validateName, validatePassword, validatePasswordConfirmation, validateRole } from '../utils/validation';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const role = ref('');
const nameErr = ref('');
const emailErr = ref('');
const passwordErr = ref('');
const confirmErr = ref('');
const roleErr = ref('');
const displayName = ref('');
const isLoading = ref(false);
const router = useRouter();
const auth = useAuthStore();

// Role options for the new UI
const roleOptions = [
  {
    value: 'public',
    title: 'Public',
    description: 'Browse clubs, view tournaments, and explore cricket content.',
    icon: 'svg',
    iconClass: 'text-blue-500'
  },
  {
    value: 'clubManager',
    title: 'Club Manager',
    description: 'Register and manage your cricket club, handle player applications.',
    icon: 'svg',
    iconClass: 'text-green-500'
  },
  {
    value: 'player',
    title: 'Player',
    description: 'Create your cricket profile, apply to clubs, and showcase your skills.',
    icon: 'svg',
    iconClass: 'text-orange-500'
  },
  {
    value: 'coach',
    title: 'Coach',
    description: 'Share your expertise, coach clubs, and develop the next generation.',
    icon: 'svg',
    iconClass: 'text-purple-500'
  }
];

// Password validation criteria - matches utils/validation.js
const passwordValidation = computed(() => ({
  length: password.value.length >= 8,
  hasUppercase: /[A-Z]/.test(password.value),
  hasLowercase: /[a-z]/.test(password.value),
  hasNumber: /\d/.test(password.value),
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
}));

// Form validation
const isFormValid = computed(() => {
  return name.value.trim() !== '' &&
         email.value.trim() !== '' &&
         password.value !== '' &&
         confirmPassword.value !== '' &&
         role.value !== '' &&
         !nameErr.value &&
         !emailErr.value &&
         !passwordErr.value &&
         !confirmErr.value &&
         !roleErr.value &&
         passwordValidation.value.length &&
         passwordValidation.value.hasUppercase &&
         passwordValidation.value.hasLowercase &&
         passwordValidation.value.hasNumber &&
         passwordValidation.value.hasSpecial;
});

function validateNameField() {
  const result = validateName(name.value);
  nameErr.value = result.error;
  if (result.cleanName) {
    name.value = result.cleanName;
  }
}

function validateEmailField() {
  const result = validateEmail(email.value);
  emailErr.value = result.error;
  if (result.cleanEmail) {
    email.value = result.cleanEmail;
  }
}

function validatePasswordField() {
  const result = validatePassword(password.value, name.value);
  passwordErr.value = result.error;
  
  // Re-validate confirm password when password changes
  if (confirmPassword.value) {
    validateConfirmField();
  }
}

function validateConfirmField() {
  const result = validatePasswordConfirmation(password.value, confirmPassword.value);
  confirmErr.value = result.error;
}

function validateRoleField() {
  const result = validateRole(role.value);
  roleErr.value = result.error;
}

async function onSubmit() {
  // Validate all fields before submission
  validateNameField();
  validateEmailField();
  validatePasswordField();
  validateConfirmField();
  validateRoleField();
  
  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;
  try {
    await auth.registerEmail(name.value.trim(), email.value.trim(), password.value, role.value);
    
    // Redirect based on role
    if (role.value === 'clubManager') {
      router.push({ name: 'club-registration' });
    } else if (role.value === 'player') {
      router.push({ name: 'player-registration' });
    } else if (role.value === 'coach') {
      router.push({ name: 'coach-registration' });
    } else {
      router.push({ name: 'crickhub' });
    }
  } catch (e) {
    console.error('Registration failed:', e);
    const msg = e?.message || 'Registration failed. Please try again.';
    alert(msg);
  } finally {
    isLoading.value = false;
  }
}

async function onGoogleRegister() {
  // Require role selection before Google sign-in
  validateRoleField();
  if (!role.value) {
    alert('Please select a role (Public, Club Manager, Player, or Coach) before continuing with Google.');
    return;
  }
  isLoading.value = true;
  try {
    await auth.loginGoogle();
    // After Google sign-in, ensure backend user is registered with selected role
    await auth.registerWithCurrentUser(role.value);
    // Prefill fields from Google profile
    email.value = auth.user?.email || '';
    displayName.value = auth.user?.displayName || '';
    name.value = auth.user?.displayName || '';
    
    // Redirect based on role
    if (role.value === 'clubManager') {
      router.push({ name: 'club-registration' });
    } else if (role.value === 'player') {
      router.push({ name: 'player-registration' });
    } else if (role.value === 'coach') {
      router.push({ name: 'coach-registration' });
    } else {
      router.push({ name: 'crickhub' });
    }
  } catch (e) {
    console.error(e);
    alert(e?.message || 'Google registration failed. Please try again.');
  } finally {
    isLoading.value = false;
  }
}
</script>
