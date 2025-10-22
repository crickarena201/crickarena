<template>
  <div v-if="clubData === null && clubChecked" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Club Registration Required</h2>
      <p class="text-slate-600 mb-6">
        You need to register your club before accessing the Club Manager dashboard.
      </p>
      <RouterLink 
        :to="{ name: 'club-registration' }" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
      >
        Register Your Club
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </RouterLink>
      <button 
        @click="logout" 
        class="mt-4 text-slate-500 hover:text-slate-700 font-medium"
      >
        Logout
      </button>
    </div>
  </div>

  <div v-else-if="clubData && clubData.status !== 'approved'" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Club Registration Pending</h2>
      <p class="text-slate-600 mb-2">
        Your club registration is currently {{ clubData.status }}.
      </p>
      <p class="text-slate-500 text-sm mb-6">
        Please wait for admin approval before accessing the Club Manager dashboard.
      </p>
      <RouterLink 
        :to="{ name: 'home' }" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
      >
        Back to Home
      </RouterLink>
      <button 
        @click="logout" 
        class="mt-4 text-slate-500 hover:text-slate-700 font-medium"
      >
        Logout
      </button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="flex">
      <!-- Sidebar -->
      <aside :class="['bg-white/80 backdrop-blur-xl border-r border-white/20 w-80 shrink-0 flex flex-col shadow-2xl shadow-blue-500/10 fixed h-screen z-10', sidebarOpen ? 'flex' : 'hidden md:flex']">
        <!-- Sidebar Header -->
        <div class="h-20 flex items-center px-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <div class="font-bold text-xl text-white tracking-tight">CrickArena</div>
              <div class="text-sm text-blue-100 font-medium">Club Manager</div>
            </div>
          </div>
        </div>

        <!-- Club Info Card -->
        <div class="p-6 border-b border-slate-200/50">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div class="flex items-center gap-3">
              <div v-if="clubData?.logoUrl" class="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <img :src="getLogoUrl()" :alt="clubData.clubName" class="w-full h-full object-cover" 
                     @error="logoError = true" v-show="!logoError">
                <div v-show="logoError" class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              </div>
              <div v-else class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-900 truncate text-lg">{{ clubData?.clubName || 'Your Club' }}</div>
                <div class="text-sm text-slate-600 truncate">
                  {{ clubData?.city && clubData?.district ? `${clubData.city}, ${clubData.district}` : (clubData?.district || 'Club Management') }}
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="clubData?.memberCount" class="text-xs text-slate-500">
                    {{ clubData.memberCount }} members
                  </span>
                  <span v-if="clubData" :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    clubData.status === 'approved' ? 'bg-green-100 text-green-800' :
                    clubData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ clubData.status?.charAt(0).toUpperCase() + clubData.status?.slice(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <RouterLink 
            :to="{ name: 'club-manager' }" 
            class="nav-link group"
            :class="isActive('club-manager')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"/>
              </svg>
            </div>
            <span class="nav-text">Dashboard</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-tournaments' }" 
            class="nav-link group"
            :class="isActive('club-manager-tournaments')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="nav-text">Tournaments</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-players' }" 
            class="nav-link group"
            :class="isActive('club-manager-players')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
            <span class="nav-text">Players</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-coaches' }" 
            class="nav-link group"
            :class="isActive('club-manager-coaches')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
            <span class="nav-text">Coaches</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-training-sessions' }" 
            class="nav-link group"
            :class="isActive('club-manager-training-sessions')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="nav-text">Training Sessions</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-matches' }" 
            class="nav-link group"
            :class="isActive('club-manager-matches')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="nav-text">Matches</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-messages' }" 
            class="nav-link group"
            :class="isActive('club-manager-messages')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span class="nav-text">Messages</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'club-manager-profile' }" 
            class="nav-link group"
            :class="isActive('club-manager-profile')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span class="nav-text">Profile</span>
            <div class="nav-indicator"></div>
          </RouterLink>
        </nav>

        <!-- User Profile Section -->
        <div class="p-4 border-t border-slate-200/50">
          <div class="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {{ userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-slate-900 truncate">
                  {{ auth.userProfile?.name || auth.user?.email || 'Club Manager' }}
                </div>
                <div class="text-xs text-slate-600">Club Manager</div>
              </div>
              <button @click="logout" class="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors group" title="Logout">
                <svg class="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div v-if="sidebarOpen" class="fixed inset-0 bg-black/50 z-50 md:hidden" @click="sidebarOpen = false"></div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 ml-0 md:ml-80">
        <!-- Top Header -->
        <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm flex items-center justify-between px-4 lg:px-8">
          <div class="flex items-center gap-4">
            <button @click="sidebarOpen = !sidebarOpen" class="md:hidden p-3 rounded-2xl hover:bg-slate-100 transition-colors">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold text-slate-900">{{ getPageTitle() }}</h1>
              <p class="text-sm text-slate-600">
                {{ clubData?.clubName || 'Club Management Dashboard' }}
                <span v-if="clubData?.city && clubData?.district" class="text-slate-400"> • {{ clubData.city }}, {{ clubData.district }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-3 rounded-2xl hover:bg-slate-100 transition-colors group">
              <svg class="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z"/>
              </svg>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            <!-- Back to Site -->
            <RouterLink :to="{ name: 'home' }" class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.47 3.84a.75.75 0 01.86 0l8.25 5.5a.75.75 0 01.33.62V20a2 2 0 01-2 2h-4.5a.75.75 0 01-.75-.75V15a1.5 1.5 0 00-3 0v6.25a.75.75 0 01-.75.75H4.5A2 2 0 012.5 20V9.96a.75.75 0 01.33-.62l8.25-5.5z"/>
              </svg>
              <span>Back to Site</span>
            </RouterLink>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 p-4 lg:p-8 overflow-y-auto">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../store/auth';
import api from '../utils/api.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const clubData = ref(null);
const sidebarOpen = ref(false);
const logoError = ref(false);
const clubChecked = ref(false);

// Using centralized API instance

onMounted(async () => {
  // Initialize auth
  if (!auth.initialized) {
    try {
      await auth.init?.();
    } catch (e) {
      console.error('Auth init failed:', e);
    }
  }

  // Load club data
  await loadClubData();
});

async function loadClubData() {
  try {
    const response = await api.get('/clubs/my-club');
    clubData.value = response.data.club;
    clubChecked.value = true;
    logoError.value = false; // Reset logo error when loading new data
  } catch (error) {
    // If club not found, set clubData to null to show registration prompt
    if (error.response && error.response.status === 404) {
      clubData.value = null;
      clubChecked.value = true;
      
      // Show notification about club registration requirement
      if (typeof window.$notify !== 'undefined') {
        window.$notify.info('Club Registration Required', 'Please register your club to access the dashboard.');
      }
    } else {
      console.error('Failed to load club data:', error);
      
      // Show error notification
      if (typeof window.$notify !== 'undefined') {
        window.$notify.error('Error', 'Failed to load club data. Please try again.');
      }
    }
  }
}

function getLogoUrl() {
  if (!clubData.value) return '';
  const baseUrl = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
  return clubData.value.logoUrl || `${baseUrl}/clubs/${clubData.value._id || clubData.value.id}/logo`;
}

function isActive(name) {
  return route.name === name ? 'nav-active' : 'nav-inactive';
}

function getPageTitle() {
  const titles = {
    'club-manager': 'Dashboard',
    'club-manager-tournaments': 'Tournaments',
    'club-manager-players': 'Players', 
    'club-manager-coaches': 'Coaches',
    'club-manager-training-sessions': 'Training Sessions', // Added title
    'club-manager-matches': 'Matches',
    'club-manager-profile': 'Profile'
  };
  return titles[route.name] || 'Club Manager';
}

const userInitials = computed(() => {
  const display = auth.userProfile?.name || auth.user?.email || '';
  const parts = display.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0)?.toUpperCase() || 'C';
  }
  return (parts[0]?.charAt(0) + parts[1]?.charAt(0)).toUpperCase();
});

async function logout(){
  try {
    await auth.logout();
    
    // Show logout success notification
    if (typeof window.$notify !== 'undefined') {
      window.$notify.success('Logged Out', 'You have been successfully logged out.');
    }
  } catch (error) {
    console.error('Logout error:', error);
    
    // Show error notification
    if (typeof window.$notify !== 'undefined') {
      window.$notify.error('Logout Error', 'There was an error logging out. Please try again.');
    }
  }
  window.location.href = '/';
}
</script>

<style scoped>
.nav-link {
  @apply relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium overflow-hidden;
}

.nav-icon-wrapper {
  @apply w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 relative z-10;
}

.nav-text {
  @apply font-semibold relative z-10 transition-all duration-300;
}

.nav-indicator {
  @apply absolute right-3 w-2 h-2 rounded-full transition-all duration-300 opacity-0 scale-0;
}

.nav-inactive {
  @apply text-slate-600 hover:text-slate-900 hover:bg-slate-50;
}

.nav-inactive .nav-icon-wrapper {
  @apply bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:scale-110;
}

.nav-active {
  @apply text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25;
}

.nav-active .nav-icon-wrapper {
  @apply bg-white/20 text-white scale-110;
}

.nav-active .nav-indicator {
  @apply bg-white opacity-100 scale-100;
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 8px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

nav::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 4px;
}

nav::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.7);
}
</style>