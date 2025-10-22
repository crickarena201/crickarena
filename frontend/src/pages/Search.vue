<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">Search</h1>
      <form class="flex items-center gap-2" @submit.prevent="applySearch">
        <div class="relative" ref="searchRef">
          <div class="relative">
            <input
              ref="searchInputRef"
              v-model.trim="localQuery"
              type="search"
              placeholder="Search clubs, tournaments, matches..."
              class="w-72 md:w-96 pl-3 pr-9 py-2 rounded-xl border border-indigo-200/70 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-400 placeholder-gray-400 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100"
              @focus="openSuggest = true"
              @input="onSuggestInput"
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

          <transition name="fade">
            <div
              v-if="openSuggest && localQuery"
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
                <RouterLink :to="{ name: 'search', query: { q: localQuery } }" class="block w-full text-center text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" @click="openSuggest = false">
                  See all results for "{{ localQuery }}"
                </RouterLink>
              </div>
            </div>
          </transition>
        </div>

        <button type="submit" class="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm">Search</button>
      </form>
    </div>

    <div v-if="loading" class="text-gray-500">Loading results...</div>
    <div v-else>
      <div v-if="!query" class="text-gray-500">Type something to search.</div>

      <div v-else class="space-y-10">
        <!-- Clubs -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold">Clubs</h2>
            <span class="text-sm text-gray-500">{{ filtered.clubs.length }}</span>
          </div>
          <div v-if="filtered.clubs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink
              v-for="c in filtered.clubs"
              :key="c.id"
              :to="{ name: 'club-details', params: { id: c.id } }"
              class="p-4 rounded-lg border hover:border-emerald-300 hover:shadow-sm transition"
            >
              <div class="flex items-center gap-3">
                <img v-if="c.logoUrl" :src="c.logoUrl" alt="logo" class="w-10 h-10 rounded object-cover" @error="e => (e.target.style.display='none')" />
                <div>
                  <div class="font-medium">{{ c.name }}</div>
                  <div class="text-xs text-gray-500">{{ c.district }} <span v-if="c.city">• {{ c.city }}</span></div>
                </div>
              </div>
              <p v-if="c.description" class="mt-2 text-sm text-gray-600 line-clamp-2">{{ c.description }}</p>
            </RouterLink>
          </div>
          <div v-else class="text-sm text-gray-500">No clubs found.</div>
        </section>

        <!-- Tournaments -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold">Tournaments</h2>
            <span class="text-sm text-gray-500">{{ filtered.tournaments.length }}</span>
          </div>
          <div v-if="filtered.tournaments.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink
              v-for="t in filtered.tournaments"
              :key="t._id"
              :to="{ name: 'tournament-details', params: { id: t._id } }"
              class="p-4 rounded-lg border hover:border-emerald-300 hover:shadow-sm transition"
            >
              <div class="font-medium">{{ t.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ t.district }} <span v-if="t.format">• {{ t.format }}</span> <span v-if="t.status">• {{ t.status }}</span></div>
              <div v-if="t.startDate" class="text-xs text-gray-500 mt-1">Starts: {{ formatDate(t.startDate) }}</div>
            </RouterLink>
          </div>
          <div v-else class="text-sm text-gray-500">No tournaments found.</div>
        </section>

        <!-- Matches (Upcoming/Ongoing) -->
        <section>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold">Matches</h2>
            <span class="text-sm text-gray-500">{{ filtered.matches.length }}</span>
          </div>
          <div v-if="filtered.matches.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink
              v-for="m in filtered.matches"
              :key="m._id"
              :to="{ name: 'match-details', params: { id: m.tournament?._id || m.tournamentId, matchId: m._id } }"
              class="p-4 rounded-lg border hover:border-emerald-300 hover:shadow-sm transition"
            >
              <div class="font-medium">{{ m.homeClub?.clubName || m.homeClub?.name }} vs {{ m.awayClub?.clubName || m.awayClub?.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ m.venue }} <span v-if="m.tournament?.name">• {{ m.tournament.name }}</span></div>
              <div class="text-xs text-gray-500 mt-1">{{ formatDate(m.date) }} <span v-if="m.time">• {{ m.time }}</span></div>
            </RouterLink>
          </div>
          <div v-else class="text-sm text-gray-500">No matches found.</div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()

const query = computed(() => (route.query.q || '').toString().trim())
const localQuery = ref('')

const loading = ref(false)
const clubs = ref([])
const tournaments = ref([])
const matches = ref([])
const dataLoaded = ref(false)

// Suggestions dropdown state
const openSuggest = ref(false)
const highlightedIndex = ref(-1)
const suggestions = ref([])
const searchRef = ref(null)
const searchInputRef = ref(null)
let debounceTimer

function includes(text, q) {
  if (!text) return false
  return text.toString().toLowerCase().includes(q.toLowerCase())
}

// Build suggestions from already-fetched data
function buildSuggestions(q) {
  const inc = (t) => includes(t, q)

  const clubItems = (clubs.value || [])
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

  const tourItems = (tournaments.value || [])
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

  const matchItems = (matches.value || [])
    .filter(m => inc(m.venue) || inc(m?.tournament?.name) || inc(m?.homeClub?.clubName || m?.homeClub?.name) || inc(m?.awayClub?.clubName || m?.awayClub?.name))
    .slice(0, 5)
    .map(m => ({
      key: `match-${m._id}`,
      type: 'match',
      label: `${m?.homeClub?.clubName || m?.homeClub?.name} vs ${m?.awayClub?.clubName || m?.awayClub?.name}`,
      sub: [m?.venue, m?.tournament?.name].filter(Boolean).join(' • '),
      icon: '📅',
      to: { name: 'match-details', params: { id: m?.tournament?._id || m.tournamentId, matchId: m._id } }
    }))

  suggestions.value = [...clubItems, ...tourItems, ...matchItems].slice(0, 8)
  highlightedIndex.value = suggestions.value.length ? 0 : -1
}

function onSuggestInput() {
  openSuggest.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const q = localQuery.value.trim()
    if (!q) {
      suggestions.value = []
      highlightedIndex.value = -1
      return
    }
    buildSuggestions(q)
  }, 120)
}

function move(step) {
  if (!suggestions.value.length) return
  const n = suggestions.value.length
  highlightedIndex.value = (highlightedIndex.value + step + n) % n
}

function onEnter() {
  const q = localQuery.value.trim()
  if (!q) return
  const s = suggestions.value[highlightedIndex.value]
  if (s) {
    goTo(s)
  } else {
    applySearch()
  }
}

function goTo(s) {
  openSuggest.value = false
  router.push(s.to)
}

const filtered = computed(() => {
  if (!query.value) return { clubs: [], tournaments: [], matches: [] }
  const q = query.value
  return {
    clubs: clubs.value.filter(c =>
      includes(c.name, q) || includes(c.district, q) || includes(c.city, q) || includes(c.description, q)
    ),
    tournaments: tournaments.value.filter(t =>
      includes(t.name, q) || includes(t.district, q) || includes(t.status, q) || includes(t.format, q)
    ),
    matches: matches.value.filter(m =>
      includes(m.venue, q) ||
      includes(m.tournament?.name, q) ||
      includes(m.homeClub?.clubName || m.homeClub?.name, q) ||
      includes(m.awayClub?.clubName || m.awayClub?.name, q)
    )
  }
})

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString() } catch { return '' }
}

function applySearch() {
  const q = localQuery.value.trim()
  router.replace({ name: 'search', query: q ? { q } : {} })
}

async function fetchAll() {
  loading.value = true
  try {
    const [clubsResp, tourResp, matchResp] = await Promise.all([
      api.get('/clubs/public'),
      api.get('/tournaments/list'),
      api.get('/tournaments/matches/upcoming', { params: { limit: 50 } })
    ])
    clubs.value = Array.isArray(clubsResp.data) ? clubsResp.data : []
    tournaments.value = Array.isArray(tourResp.data) ? tourResp.data : []
    matches.value = Array.isArray(matchResp.data) ? matchResp.data : []
    dataLoaded.value = true
    if (localQuery.value) buildSuggestions(localQuery.value)
  } catch (e) {
    console.warn('Search fetch failed', e?.response?.data || e.message)
  } finally {
    loading.value = false
  }
}

watch(() => route.query.q, (val) => {
  localQuery.value = (val || '').toString()
  if (localQuery.value && dataLoaded.value) buildSuggestions(localQuery.value)
}, { immediate: true })

onMounted(() => {
  fetchAll()
  const onDocClick = (e) => {
    if (!searchRef.value) return
    if (!searchRef.value.contains(e.target)) openSuggest.value = false
  }
  document.addEventListener('click', onDocClick)
  searchRef.value && (searchRef.value._onDocClick = onDocClick)
})

onBeforeUnmount(() => {
  const onDocClick = searchRef.value?._onDocClick
  if (onDocClick) document.removeEventListener('click', onDocClick)
})
</script>

<style scoped>
/* minimal */
</style>