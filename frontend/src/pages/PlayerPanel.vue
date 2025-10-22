<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
    <div class="flex">
      <!-- Sidebar -->
      <aside :class="['bg-white/80 backdrop-blur-xl border-r border-white/20 w-80 shrink-0 flex flex-col shadow-2xl shadow-green-500/10 fixed h-screen z-10', sidebarOpen ? 'flex' : 'hidden md:flex']">
        <!-- Sidebar Header -->
        <div class="h-20 flex items-center px-6 border-b border-slate-200/50 bg-gradient-to-r from-green-600 to-emerald-600">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <div class="font-bold text-xl text-white tracking-tight">CrickArena</div>
              <div class="text-sm text-green-100 font-medium">Player Portal</div>
            </div>
          </div>
        </div>

        <!-- Player Info Card -->
        <div class="p-6 border-b border-slate-200/50">
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m0 0a5.002 5.002 0 0 1 9.75 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-900 truncate text-lg">{{ playerData?.fullName || 'Player' }}</div>
                <div class="text-sm text-slate-600 truncate">
                  {{ playerData?.preferredPosition || 'Cricket Player' }}
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="playerData?.currentClub" class="text-xs text-slate-500">
                    {{ playerData.currentClub.name || playerData.currentClub.clubName }}
                  </span>
                  <span v-if="playerData" :class="[
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    playerData.currentClub ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ playerData.currentClub ? 'Member' : 'Available' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <RouterLink 
            :to="{ name: 'player-panel' }" 
            class="nav-link group"
            :class="isActive('player-panel')"
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
            :to="{ name: 'player-panel-training' }" 
            class="nav-link group"
            :class="isActive('player-panel-training')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <span class="nav-text">Training</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'player-panel-applications' }" 
            class="nav-link group"
            :class="isActive('player-panel-applications')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="nav-text">Applications</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'player-panel-goals' }" 
            class="nav-link group"
            :class="isActive('player-panel-goals')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <span class="nav-text">My Goals</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'player-panel-feedback' }" 
            class="nav-link group"
            :class="isActive('player-panel-feedback')"
            @click="sidebarOpen = false"
          >
            <div class="nav-icon-wrapper">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <span class="nav-text">Coach Feedback</span>
            <div class="nav-indicator"></div>
          </RouterLink>

          <RouterLink 
            :to="{ name: 'player-panel-messages' }" 
            class="nav-link group"
            :class="isActive('player-panel-messages')"
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
            :to="{ name: 'player-panel-matches' }" 
            class="nav-link group"
            :class="isActive('player-panel-matches')"
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
            :to="{ name: 'player-panel-profile' }" 
            class="nav-link group"
            :class="isActive('player-panel-profile')"
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
          <div class="bg-gradient-to-r from-slate-50 to-green-50 rounded-2xl p-4 border border-slate-200">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {{ userInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-slate-900 truncate">
                  {{ auth.userProfile?.name || auth.user?.email || 'Player' }}
                </div>
                <div class="text-xs text-slate-600">Cricket Player</div>
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
                {{ playerData?.fullName || 'Player Dashboard' }}
                <span v-if="playerData?.preferredPosition" class="text-slate-400"> • {{ playerData.preferredPosition }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="p-3 rounded-2xl hover:bg-slate-100 transition-colors relative" title="Notifications">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
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

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-8 overflow-y-auto">
          <router-view :player-data="playerData" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const sidebarOpen = ref(false);
const playerData = ref(null);

// Initialize auth if needed
onMounted(async () => {
  if (!auth.initialized) {
    try {
      await auth.init?.();
    } catch (e) {
      console.error('Auth init failed:', e);
    }
  }

  await loadPlayerData();
});

async function loadPlayerData() {
  try {
    const response = await axios.get(`${API}/players/profile`, { withCredentials: true });
    playerData.value = response.data.player;
  } catch (error) {
    console.error('Error loading player data:', error);
  }
}

// Navigation helpers
const isActive = (routeName) => {
  return route.name === routeName ? 'active' : '';
};

const getPageTitle = () => {
  const titles = {
    'player-panel': 'Dashboard',
    'player-panel-training': 'Training Sessions',
    'player-panel-applications': 'Club Applications',
    'player-panel-goals': 'My Goals',
    'player-panel-feedback': 'Coach Feedback',
    'player-panel-matches': 'Club Matches',
    'player-panel-profile': 'Profile'
  };
  return titles[route.name] || 'Player Portal';
};

// User helpers
const userInitials = computed(() => {
  const name = auth.userProfile?.name || auth.user?.email?.split('@')[0] || 'P';
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});

// Logout function
const logout = async () => {
  await auth.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-700 hover:bg-slate-100/70 transition-all duration-200;
}

.nav-link.active {
  @apply bg-green-50 text-green-700 font-medium shadow-sm;
}

.nav-icon-wrapper {
  @apply w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 group-hover:bg-white transition-colors;
}

.nav-link.active .nav-icon-wrapper {
  @apply bg-green-100;
}

.nav-text {
  @apply text-sm font-medium flex-1;
}

.nav-indicator {
  @apply w-1.5 h-1.5 rounded-full bg-slate-300 opacity-0 transition-opacity;
}

.nav-link.active .nav-indicator {
  @apply bg-green-500 opacity-100;
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