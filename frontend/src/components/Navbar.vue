<template>
  <header class="sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200/60 dark:bg-neutral-900/70 dark:border-neutral-800">
    <!-- subtle gradient bar -->
    <div class="h-0.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>

    <nav class="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <!-- Brand -->
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="relative">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(16,185,129,0.6)] group-hover:shadow-[0_14px_28px_-10px_rgba(16,185,129,0.7)] transition-all duration-300 group-hover:scale-105">
            <!-- Cricket ball + cross wicket icon -->
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v5m0 10v5M22 12h-5M7 12H2" stroke-linecap="round" />
            </svg>
          </div>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-black tracking-tight leading-none text-emerald-700 group-hover:text-emerald-600 dark:text-emerald-300 dark:group-hover:text-emerald-200 transition-colors">
            Crick<span class="text-emerald-600 dark:text-emerald-300">Arena</span>
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Cricket Hub</span>
        </div>
      </RouterLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-3">
        <!-- Primary links -->
        <ul class="flex items-center gap-1 text-sm font-medium">
          <li>
            <RouterLink to="/" v-slot="{ href }">
              <a :href="href" :class="navLinkClass('/')">Home</a>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/clubs'" v-slot="{ href }">
              <a :href="href" :class="navLinkClass('/clubs')">Clubs</a>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="'/tournaments'" v-slot="{ href }">
              <a :href="href" :class="navLinkClass('/tournaments')">Tournaments</a>
            </RouterLink>
          </li>
          <template v-if="auth.user">
            <li>
              <RouterLink :to="'/crickhub'" v-slot="{ href }">
                <a :href="href" :class="navLinkClass('/crickhub')">CrickHub</a>
              </RouterLink>
            </li>
            <li v-if="isClubManager">
              <RouterLink :to="'/club-manager'" v-slot="{ href }">
                <a :href="href" :class="navLinkClass('/club-manager')">Club Manager</a>
              </RouterLink>
            </li>
            <li v-if="isPlayer">
              <RouterLink :to="'/player-panel'" v-slot="{ href }">
                <a :href="href" :class="navLinkClass('/player-panel')">Player Dashboard</a>
              </RouterLink>
            </li>
            <li v-if="isCoach">
              <RouterLink :to="'/coach-panel'" v-slot="{ href }">
                <a :href="href" :class="navLinkClass('/coach-panel')">Coach Dashboard</a>
              </RouterLink>
            </li>
            <!-- Replace legacy Admin links with one Admin Panel entry -->
            <li v-if="isAdmin">
              <RouterLink :to="'/admin'" v-slot="{ href }">
                <a :href="href" class="px-3 py-2 rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition">Admin Panel</a>
              </RouterLink>
            </li>
          </template>
        </ul>

        <!-- Search (desktop) -->
        <div class="relative w-64 lg:w-80" ref="searchRef">
          <form @submit.prevent="onSubmitSearch" role="search" aria-label="Site search (desktop)">
            <div class="relative">
              <input
                ref="searchInputRef"
                v-model.trim="navbarQuery"
                type="search"
                placeholder="Search clubs, tournaments, matches..."
                class="w-full pl-3 pr-9 py-2 rounded-xl border border-indigo-200/70 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400 placeholder-gray-400 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100"
                @focus="openSuggest = true; ensureData()"
                @input="onQueryInput"
                @keydown.down.prevent="move(1)"
                @keydown.up.prevent="move(-1)"
                @keydown.enter.prevent="onEnter()"
                @keydown.esc="openSuggest = false"
                aria-autocomplete="list"
                :aria-expanded="openSuggest.toString()"
              />
              <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </div>
          </form>

          <transition name="fade">
            <div
              v-if="openSuggest && navbarQuery"
              class="absolute z-50 mt-2 w-full rounded-xl border border-indigo-200/70 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden"
              role="listbox"
            >
              <ul v-if="suggestions.length" class="py-1">
                <li v-for="(s, idx) in suggestions" :key="s.key">
                  <button
                    type="button"
                    class="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50/80 dark:hover:bg-neutral-800"
                    :class="{ 'bg-indigo-100/60 dark:bg-neutral-800': idx === highlightedIndex }"
                    @mousedown.prevent="goTo(s)"
                    role="option"
                    :aria-selected="(idx === highlightedIndex).toString()"
                  >
                    <span class="text-base">{{ s.icon }}</span>
                    <div class="min-w-0">
                      <div class="font-medium truncate">{{ s.label }}</div>
                      <div class="text-xs text-gray-500 truncate" v-if="s.sub">{{ s.sub }}</div>
                    </div>
                  </button>
                </li>
              </ul>
              <div v-else class="px-3 py-3 text-sm text-gray-500">No quick matches. Press Enter to see all results.</div>
              <div class="border-t border-indigo-100/80 bg-indigo-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 p-2">
                <RouterLink :to="{ name: 'search', query: { q: navbarQuery } }" class="block w-full text-center text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" @click="openSuggest = false">
                  See all results for "{{ navbarQuery }}"
                </RouterLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- Auth area -->
        <div class="relative" ref="userMenuRef" v-if="auth.user">
          <button
            class="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-100/70 transition-colors"
            @click="openUser = !openUser"
            :aria-expanded="openUser.toString()"
            aria-haspopup="menu"
          >
            <div class="w-8 h-8 rounded-full overflow-hidden shadow-sm ring-2 ring-emerald-200">
              <img
                v-if="userPhotoUrl"
                :src="userPhotoUrl"
                alt="Profile"
                class="w-full h-full object-cover"
                @error="userPhotoUrl = null"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
              </div>
            </div>
            <div class="hidden xl:flex flex-col text-left">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getUserDisplayName() }}</span>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ auth.userProfile?.role || 'Member' }}</span>
            </div>
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <transition name="fade">
            <div
              v-if="openUser"
              class="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-200/70 bg-emerald-50/95 backdrop-blur shadow-xl"
              role="menu"
            >
              <div class="px-3 py-2 border-b border-emerald-100/80">
                <div class="text-sm font-semibold text-emerald-800">{{ getUserDisplayName() }}</div>
                <div class="text-xs text-emerald-700/80">{{ auth.user?.email }}</div>
              </div>
              <ul class="py-1 text-sm">
                <li>
                  <RouterLink to="/profile" class="menuItem emerald">Profile</RouterLink>
                </li>
                <li>
                  <RouterLink to="/crickhub" class="menuItem emerald">CrickHub</RouterLink>
                </li>
                <li v-if="isClubManager">
                  <RouterLink to="/club-manager" class="menuItem emerald">Club Manager</RouterLink>
                </li>
                <li v-if="isPlayer">
                  <RouterLink to="/player-panel" class="menuItem emerald">Player Dashboard</RouterLink>
                </li>
                <li v-if="isCoach">
                  <RouterLink to="/coach-panel" class="menuItem emerald">Coach Dashboard</RouterLink>
                </li>
                <li v-if="isAdmin">
                  <RouterLink to="/admin" class="menuItem emerald">Admin Panel</RouterLink>
                </li>
              </ul>
              <div class="border-t border-emerald-100/80 p-2">
                <button @click="onLogout" class="w-full px-3 py-2 rounded-md border border-emerald-200 text-emerald-800 hover:bg-emerald-100/70 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </transition>
        </div>
        <template v-else>
          <RouterLink to="/login" class="px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800">Login</RouterLink>
          <RouterLink to="/register" class="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Sign up</RouterLink>
        </template>
      </div>

      <!-- Mobile controls -->
      <div class="flex md:hidden items-center gap-1">
        <button class="p-2 rounded-md hover:bg-gray-100" @click="openMobile = !openMobile" aria-label="Toggle menu" :aria-expanded="openMobile.toString()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path v-if="!openMobile" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile panel -->
    <transition name="fade">
      <div v-if="openMobile" class="md:hidden border-t border-gray-200 dark:border-neutral-800">
        <div class="px-4 py-3">
          <form class="mb-3" @submit.prevent="onSubmitSearch" role="search" aria-label="Site search (mobile)">
            <div class="flex gap-2">
              <input
                v-model.trim="navbarQuery"
                type="search"
                placeholder="Search..."
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100"
              />
              <button type="submit" class="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Go</button>
            </div>
          </form>
          <ul class="space-y-1 text-sm font-medium">
            <li><RouterLink @click="openMobile=false" to="/" class="mobileLink">Home</RouterLink></li>
            <li><RouterLink @click="openMobile=false" to="/clubs" class="mobileLink">Clubs</RouterLink></li>
            <li><RouterLink @click="openMobile=false" to="/tournaments" class="mobileLink">Tournaments</RouterLink></li>
            <template v-if="auth.user">
              <li><RouterLink @click="openMobile=false" to="/crickhub" class="mobileLink">CrickHub</RouterLink></li>
              <li v-if="isClubManager"><RouterLink @click="openMobile=false" to="/club-manager" class="mobileLink">Club Manager</RouterLink></li>
              <li v-if="isPlayer"><RouterLink @click="openMobile=false" to="/player-panel" class="mobileLink">Player Dashboard</RouterLink></li>
              <li v-if="isCoach"><RouterLink @click="openMobile=false" to="/coach-panel" class="mobileLink">Coach Dashboard</RouterLink></li>
              <li v-if="isAdmin"><RouterLink @click="openMobile=false" to="/admin" class="mobileLink">Admin Panel</RouterLink></li>
              <li class="py-2 border-t border-gray-200 dark:border-neutral-800">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-emerald-200">
                    <img
                      v-if="userPhotoUrl"
                      :src="userPhotoUrl"
                      alt="Profile"
                      class="w-full h-full object-cover"
                      @error="userPhotoUrl = null"
                    />
                    <div v-else class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getUserDisplayName() }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ auth.userProfile?.role || 'Member' }} • {{ auth.user?.email }}</div>
                  </div>
                </div>
                <button @click="onLogout" class="w-full px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors">Logout</button>
              </li>
            </template>
            <template v-else>
              <li class="flex gap-2 pt-2">
                <RouterLink @click="openMobile=false" to="/login" class="flex-1 text-center px-3 py-2 rounded-md border text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:border-neutral-700 dark:hover:bg-neutral-800">Login</RouterLink>
                <RouterLink @click="openMobile=false" to="/register" class="flex-1 text-center px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Sign up</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import api from '../utils/api'
import axios from 'axios'

const auth = useAuthStore()
const route = useRoute()
const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const openMobile = ref(false)
const openUser = ref(false)
const userMenuRef = ref(null)
const userPhotoUrl = ref(null)

// Global search state (kept in sync with route.query.q)
const navbarQuery = ref('')

// Suggestion dropdown state
const openSuggest = ref(false)
const highlightedIndex = ref(-1)
const suggestions = ref([])
const searchRef = ref(null)
const searchInputRef = ref(null)
let clubsCache = []
let tournamentsCache = []
let matchesCache = []
let dataLoaded = false
let debounceTimer = null

// Load user profile photo
async function loadUserPhoto() {
  const role = auth.userProfile?.role
  if (!role || role === 'public' || role === 'clubManager') {
    userPhotoUrl.value = null
    return
  }
  
  try {
    const idTok = auth.user ? await auth.user.getIdToken(true) : null
    const endpoint = role === 'player' ? '/players/photo' : role === 'coach' ? '/coaches/photo' : null
    if (!endpoint) return
    
    const response = await axios.get(`${API}${endpoint}`, {
      headers: { ...(idTok ? { Authorization: `Bearer ${idTok}` } : {}) },
      responseType: 'blob',
      withCredentials: true
    })
    
    if (userPhotoUrl.value) {
      URL.revokeObjectURL(userPhotoUrl.value)
    }
    
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    userPhotoUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Error loading user photo:', error)
    }
    userPhotoUrl.value = null
  }
}

function resetHighlight() {
  highlightedIndex.value = suggestions.value.length ? 0 : -1
}

function buildSuggestions(q) {
  const norm = (v) => (v || '').toString().toLowerCase()
  const nq = norm(q)
  const inc = (t) => norm(t).includes(nq)

  const clubItems = (clubsCache || [])
    .filter(c => inc(c.name) || inc(c.district) || inc(c.city))
    .slice(0, 5)
    .map(c => ({
      key: `club-${c.id}`,
      type: 'club',
      label: c.name,
      sub: [c.district, c.city].filter(Boolean).join(' • '),
      icon: '🏏',
      to: { name: 'club-details', params: { id: c.id } }
    }))

  const tourItems = (tournamentsCache || [])
    .filter(t => inc(t.name) || inc(t.district) || inc(t.status) || inc(t.format))
    .slice(0, 5)
    .map(t => ({
      key: `tour-${t._id}`,
      type: 'tournament',
      label: t.name,
      sub: [t.district, t.format, t.status].filter(Boolean).join(' • '),
      icon: '🏆',
      to: { name: 'tournament-details', params: { id: t._id } }
    }))

  const matchItems = (matchesCache || [])
    .filter(m => inc(m.venue) || inc(m?.tournament?.name) || inc(m?.homeClub?.clubName || m?.homeClub?.name) || inc(m?.awayClub?.clubName || m?.awayClub?.name))
    .slice(0, 5)
    .map(m => ({
      key: `match-${m._id}`,
      type: 'match',
      label: `${m?.homeClub?.clubName || m?.homeClub?.name} vs ${m?.awayClub?.clubName || m?.awayClub?.name}`,
      sub: [m?.venue, m?.tournament?.name].filter(Boolean).join(' • '),
      icon: '📅',
      to: { name: 'match-details', params: { id: m?.tournament?._id, matchId: m._id } }
    }))

  const combined = [...clubItems, ...tourItems, ...matchItems].slice(0, 8)
  suggestions.value = combined
  resetHighlight()
}

async function ensureData() {
  if (dataLoaded) return
  try {
    const [clubsResp, tourResp, matchResp] = await Promise.all([
      api.get('/clubs/public'),
      api.get('/tournaments/list'),
      api.get('/tournaments/matches/upcoming', { params: { limit: 50 } })
    ])
    clubsCache = Array.isArray(clubsResp.data) ? clubsResp.data : []
    tournamentsCache = Array.isArray(tourResp.data) ? tourResp.data : []
    matchesCache = Array.isArray(matchResp.data) ? matchResp.data : []
    dataLoaded = true
    if (navbarQuery.value) buildSuggestions(navbarQuery.value)
  } catch (e) {
    // Fail silently; dropdown will just show no quick matches
    console.warn('Navbar suggestions fetch failed', e?.response?.data || e.message)
  }
}

function onQueryInput() {
  openSuggest.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (!navbarQuery.value) {
      suggestions.value = []
      highlightedIndex.value = -1
      return
    }
    buildSuggestions(navbarQuery.value)
  }, 120)
}

function move(step) {
  if (!suggestions.value.length) return
  const n = suggestions.value.length
  highlightedIndex.value = (highlightedIndex.value + step + n) % n
}

function onEnter() {
  const q = navbarQuery.value.trim()
  if (!q) return
  const s = suggestions.value[highlightedIndex.value]
  if (s) {
    goTo(s)
  } else {
    onSubmitSearch()
  }
}

function goTo(s) {
  openSuggest.value = false
  router.push(s.to)
}

// Router instance for navigation
import { useRouter } from 'vue-router'
const router = useRouter()

function onSubmitSearch() {
  const q = navbarQuery.value.trim()
  // Navigate to Search page with query; replace if already on search to avoid history spam
  if (route.name === 'search') {
    router.replace({ name: 'search', query: q ? { q } : {} })
  } else {
    router.push({ name: 'search', query: q ? { q } : {} })
  }
  openSuggest.value = false
  openMobile.value = false
}

// Keep navbar input in sync with URL query
watch(() => route.query.q, (val) => {
  navbarQuery.value = (val || '').toString()
  if (navbarQuery.value) {
    ensureData().then(() => buildSuggestions(navbarQuery.value))
  } else {
    suggestions.value = []
    highlightedIndex.value = -1
  }
}, { immediate: true })

// Close suggestions on outside click
onMounted(() => {
  const onDocClick = (e) => {
    if (!searchRef.value) return
    if (!searchRef.value.contains(e.target)) {
      openSuggest.value = false
    }
  }
  document.addEventListener('click', onDocClick)
  searchRef.value && (searchRef.value._onDocClick = onDocClick)
})

onBeforeUnmount(() => {
  const onDocClick = searchRef.value?._onDocClick
  if (onDocClick) document.removeEventListener('click', onDocClick)
})

// Active route helper for styling
function navLinkClass(path) {
  const active = route.path === path || route.path.startsWith(path + '/')
  return [
    'relative px-3 py-2 rounded-lg transition-all duration-200',
    active
      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-900/30 ring-1 ring-emerald-200/70 dark:ring-emerald-900/50 shadow-sm'
      : 'text-gray-600 hover:text-emerald-700 dark:text-gray-300 dark:hover:text-emerald-300 hover:bg-gray-100/60 dark:hover:bg-neutral-800/70'
  ]
}

// Role checks
const isAdmin = computed(() => {
  const userRole = auth.userProfile?.role || 'user'
  return userRole === 'admin' || auth.user?.email === 'admin@crickarena.com'
})

const isClubManager = computed(() => (auth.userProfile?.role || 'public') === 'clubManager')
const isPlayer = computed(() => (auth.userProfile?.role || 'public') === 'player')
const isCoach = computed(() => (auth.userProfile?.role || 'public') === 'coach')

// User display helpers
function getUserDisplayName() {
  return (
    auth.userProfile?.name ||
    auth.user?.displayName ||
    auth.user?.email?.split('@')[0] ||
    'User'
  )
}

function getUserInitials() {
  const name = getUserDisplayName()
  if (name === 'User') return 'U'
  const words = name.split(' ')
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

async function onLogout() {
  await auth.logout()
  openMobile.value = false
  openUser.value = false
  // Redirect to home after logout
  router.push({ name: 'home' })
}

onMounted(() => {
  // Close user menu on outside click
  const onDocClick = (e) => {
    if (!userMenuRef.value) return
    if (!userMenuRef.value.contains(e.target)) {
      openUser.value = false
    }
  }
  document.addEventListener('click', onDocClick)
  // Store for cleanup
  userMenuRef.value && (userMenuRef.value._onDocClick = onDocClick)
  
  // Load user photo
  loadUserPhoto()
  
  // Listen for profile photo updates
  window.addEventListener('profile-photo-updated', loadUserPhoto)
  window.addEventListener('profile-updated', loadUserPhoto)
})

onBeforeUnmount(() => {
  const onDocClick = userMenuRef.value?._onDocClick
  if (onDocClick) document.removeEventListener('click', onDocClick)
  
  // Clean up photo URL
  if (userPhotoUrl.value) {
    URL.revokeObjectURL(userPhotoUrl.value)
  }
  
  // Remove event listeners
  window.removeEventListener('profile-photo-updated', loadUserPhoto)
  window.removeEventListener('profile-updated', loadUserPhoto)
})
// Watch for auth changes to reload photo
watch(() => auth.userProfile?.role, () => {
  loadUserPhoto()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.menuItem {
  display: block;
  padding: 0.5rem 0.75rem;
  color: rgb(55 65 81); /* gray-700 */
}
.menuItem:hover {
  background: rgb(243 244 246); /* gray-100 */
}
.menuItem.emerald {
  color: rgb(6 95 70); /* emerald-800 */
}
.menuItem.emerald:hover {
  background: rgba(16,185,129,0.12); /* emerald tint */
}

.mobileLink {
  display: block;
  padding: 0.625rem 0.5rem;
  border-radius: 0.5rem;
  color: rgb(55 65 81);
}
.mobileLink:hover {
  background: rgb(243 244 246);
}
</style>