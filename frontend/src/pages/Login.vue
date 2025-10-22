<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background with cricket theme -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <!-- Cricket field pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-emerald-300 rounded-full"></div>
        <div class="absolute top-1/3 left-1/3 w-16 h-16 border border-emerald-300 rounded-full"></div>
        <div class="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-emerald-300 rounded-full"></div>
        <div class="absolute bottom-1/4 right-1/3 w-20 h-20 border border-emerald-300 rounded-full"></div>
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
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to CrickArena</h1>
          <p class="text-gray-600">Your gateway to cricket excellence</p>
        </div>

        <!-- Login card -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p class="text-gray-600">Sign in to your account</p>
          </div>

          <form class="space-y-6" @submit.prevent="onEmailLogin">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                  </div>
                  <input 
                    v-model="email" 
                    type="email" 
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="password" 
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" 
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button" 
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors" 
                    @click="showPassword = !showPassword"
                  >
                    <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.548-4.226M6.223 6.223A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div class="text-sm">
                <RouterLink to="/forgot-password" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  Forgot password?
                </RouterLink>
              </div>
            </div>

            <button 
              :disabled="isLoading" 
              :class="[
                'w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.02]',
                (isLoading) ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Sign In
              </span>
            </button>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div class="mt-6">
              <button 
                @click="onGoogle" 
                :disabled="isLoading"
                class="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
              >
                <img alt="Google" class="w-5 h-5 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"/>
                Continue with Google
              </button>
            </div>
          </div>

          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              New to CrickArena?
              <RouterLink to="/register" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                Create your account
              </RouterLink>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            © 2024 CrickArena. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { notify } from '../utils/notifications';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const router = useRouter();
const auth = useAuthStore();

async function onEmailLogin() {
  if (!email.value || !password.value) return; // minimal check: non-empty

  isLoading.value = true;
  try {
    await auth.loginEmail(email.value.trim(), password.value);
    const isAdmin = auth.userProfile?.role === 'admin' || auth.user?.email === 'admin@crickarena.com';
    router.replace({ name: isAdmin ? 'admin' : 'crickhub' });
  } catch (e) {
    console.error(e);
    
    // Map Firebase error codes to user-friendly messages
    let errorMessage = 'Login failed. Please try again.';
    
    if (e?.code === 'auth/invalid-credential' || e?.message?.includes('invalid-credential')) {
      errorMessage = 'Invalid email or password. Please check your credentials and try again.';
    } else if (e?.code === 'auth/user-not-found' || e?.message?.includes('user-not-found')) {
      errorMessage = 'No account found with this email. Please check your email or sign up.';
    } else if (e?.code === 'auth/wrong-password' || e?.message?.includes('wrong-password')) {
      errorMessage = 'Incorrect password. Please try again or reset your password.';
    } else if (e?.code === 'auth/too-many-requests' || e?.message?.includes('too-many-requests')) {
      errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
    } else if (e?.code === 'auth/user-disabled' || e?.message?.includes('user-disabled')) {
      errorMessage = 'This account has been disabled. Please contact support.';
    } else if (e?.code === 'auth/invalid-email' || e?.message?.includes('invalid-email')) {
      errorMessage = 'Invalid email format. Please enter a valid email address.';
    } else if (e?.message && !e?.message?.includes('Firebase')) {
      errorMessage = e.message;
    }
    
    notify.error(errorMessage);
  } finally {
    isLoading.value = false;
  }
}

async function onGoogle() {
  isLoading.value = true;
  try {
    await auth.loginGoogle();
    const isAdmin = auth.userProfile?.role === 'admin' || auth.user?.email === 'admin@crickarena.com';
    router.replace({ name: isAdmin ? 'admin' : 'crickhub' });
  } catch (e) {
    console.error('Google Sign-In error:', e);
    const msg = e?.code ? `${e.code}: ${e.message || ''}` : (e?.message || 'Unknown error');
    notify.error(`Google Sign-In failed. ${msg}`);
  } finally {
    isLoading.value = false;
  }
}
</script>
