<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside :class="['bg-white border-r w-72 shrink-0 flex-col hidden md:flex', sidebarOpen ? 'block' : '']">
        <div class="h-16 flex items-center px-4 border-b">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">CA</div>
            <div class="text-lg font-semibold">Admin Panel</div>
          </div>
        </div>
        <nav class="p-3 space-y-1">
          <RouterLink :to="{ name: 'admin' }" class="nav-item" :class="linkClass('admin')">
            <span class="icon">🏠</span>
            <span>Overview</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-tournaments' }" class="nav-item" :class="linkClass('admin-tournaments')">
            <span class="icon">🏆</span>
            <span>Tournament Management</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-clubs' }" class="nav-item" :class="linkClass('admin-clubs')">
            <span class="icon">👥</span>
            <span>Club Management</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-players' }" class="nav-item" :class="linkClass('admin-players')">
            <span class="icon">🏃</span>
            <span>Player Management</span>
          </RouterLink>
          <RouterLink :to="{ name: 'admin-coaches' }" class="nav-item" :class="linkClass('admin-coaches')">
            <span class="icon">👨‍🏫</span>
            <span>Coach Management</span>
          </RouterLink>
          <div class="nav-item cursor-not-allowed opacity-60">
            <span class="icon">📊</span>
            <span>Analytics</span>
            <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Coming Soon</span>
          </div>
        </nav>
      </aside>

      <!-- Main -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-16 bg-gray-900 text-white flex items-center justify-between px-3 md:px-6">
          <div class="flex items-center gap-3 min-w-0">
            <button class="md:hidden p-2 rounded hover:bg-white/10" @click="sidebarOpen = !sidebarOpen">☰</button>
            <div class="flex items-center gap-3 truncate">
              <div class="hidden md:flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">CA</div>
                <div class="text-sm md:text-base font-semibold truncate">CrickArena | Admin Panel</div>
              </div>
              <!-- Primary links (desktop) -->
              <nav class="hidden lg:flex items-center gap-2 ml-4 text-sm">
                <RouterLink :to="{ name: 'admin' }" class="top-link" :class="topLinkClass('admin')">Dashboard</RouterLink>
                <RouterLink :to="{ name: 'admin-tournaments' }" class="top-link" :class="topLinkClass('admin-tournaments')">Tournaments</RouterLink>
                <RouterLink :to="{ name: 'admin-clubs' }" class="top-link" :class="topLinkClass('admin-clubs')">Clubs</RouterLink>
                <RouterLink :to="{ name: 'admin-players' }" class="top-link" :class="topLinkClass('admin-players')">Players</RouterLink>
                <RouterLink :to="{ name: 'admin-coaches' }" class="top-link" :class="topLinkClass('admin-coaches')">Coaches</RouterLink>
                <span class="top-link opacity-50 cursor-not-allowed" title="Coming soon">Analytics</span>
              </nav>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink :to="{ name: 'home' }" class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-white text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path d="M11.47 3.84a.75.75 0 01.86 0l8.25 5.5a.75.75 0 01.33.62V20a2 2 0 01-2 2h-4.5a.75.75 0 01-.75-.75V15a1.5 1.5 0 00-3 0v6.25a.75.75 0 01-.75.75H4.5A2 2 0 012.5 20V9.96a.75.75 0 01.33-.62l8.25-5.5z" />
              </svg>
              <span>Back to Site</span>
            </RouterLink>
            <RouterLink :to="{ name: 'profile' }" class="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10">
              <div v-if="auth.userProfile || auth.user" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold">
                {{ userInitials }}
              </div>
              <div class="hidden md:block text-sm" v-if="auth.userProfile">{{ auth.userProfile.name || auth.user?.email }}</div>
            </RouterLink>
            <button class="px-3 py-1.5 rounded bg-white text-gray-900 hover:bg-gray-100 text-sm" @click="logout">Logout</button>
          </div>
        </header>

        <!-- Secondary nav (mobile) -->
        <div class="lg:hidden bg-gray-800 text-gray-200 px-3 py-2 flex items-center gap-3 overflow-x-auto">
          <RouterLink :to="{ name: 'admin' }" class="mobile-link" :class="topLinkClass('admin')">Dashboard</RouterLink>
          <RouterLink :to="{ name: 'admin-tournaments' }" class="mobile-link" :class="topLinkClass('admin-tournaments')">Tournaments</RouterLink>
          <RouterLink :to="{ name: 'admin-clubs' }" class="mobile-link" :class="topLinkClass('admin-clubs')">Clubs</RouterLink>
          <RouterLink :to="{ name: 'admin-players' }" class="mobile-link" :class="topLinkClass('admin-players')">Players</RouterLink>
          <RouterLink :to="{ name: 'admin-coaches' }" class="mobile-link" :class="topLinkClass('admin-coaches')">Coaches</RouterLink>
          <span class="mobile-link opacity-50">Analytics</span>
        </div>

        <!-- Content -->
        <main class="p-3 md:p-6">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Mobile drawer backdrop -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 md:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const sidebarOpen = ref(false);

function linkClass(name){
  return route.name === name ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'hover:bg-gray-50';
}

function topLinkClass(name){
  return route.name === name ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10';
}

const userInitials = computed(() => {
  const display = auth.userProfile?.name || auth.user?.email || '';
  const parts = display.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]?.charAt(0)?.toUpperCase() || 'A';
  }
  return (parts[0]?.charAt(0) + parts[1]?.charAt(0)).toUpperCase();
});

async function logout(){
  try {
    await auth.logout();
  } catch {}
  router.replace({ name: 'home' });
}
</script>

<style scoped>
.nav-item { @apply w-full flex items-center gap-3 px-3 py-2.5 rounded border border-transparent text-sm font-medium transition; }
.icon { @apply w-5 h-5; }
.top-link { @apply px-2.5 py-1.5 rounded transition whitespace-nowrap; }
.mobile-link { @apply px-2 py-1 rounded transition whitespace-nowrap; }
</style>