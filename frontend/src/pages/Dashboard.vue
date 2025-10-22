<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50 to-white">
    <div class="max-w-6xl mx-auto p-4 space-y-10">
      <!-- Welcome / Session -->
      <section class="relative overflow-hidden rounded-3xl">
        <div class="rounded-3xl p-8 md:p-10 bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-xl">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p class="text-sm font-semibold text-emerald-100">Welcome back</p>
              <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow">Kerala Cricket Dashboard</h1>
              <p class="mt-3 text-white/90 max-w-prose">
                Your gateway to Kerala's grassroots cricket community. Discover local clubs, follow district tournaments, and stay connected with cricket across God's Own Country.
              </p>
              <div class="mt-6 flex items-center gap-3 text-sm">
                <span class="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
                  <span>{{ auth.userProfile?.name || auth.user?.displayName || auth.user?.email }}</span>
                </span>
              </div>
            </div>
            <div class="relative hidden md:block">
              <div class="aspect-video rounded-2xl bg-white/10 border border-white/30 shadow-inner overflow-hidden">
                <div class="absolute inset-0 p-6 flex flex-col justify-center">
                  <h3 class="text-2xl font-bold drop-shadow">Cricket: The Gentleman’s Game</h3>
                  <p class="mt-2 text-white/85 text-sm leading-relaxed">
                    From the coastal grounds of Kollam to the hill stations of Wayanad, Kerala's cricket community thrives across all 14 districts. 
                    Join local tournaments, connect with neighborhood clubs, and be part of God's Own Country's cricket legacy.
                  </p>
                  <ul class="mt-4 grid grid-cols-2 gap-2 text-sm text-white/90">
                    <li class="inline-flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>14 Districts</li>
                    <li class="inline-flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>Local Tournaments</li>
                    <li class="inline-flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>Grassroots Cricket</li>
                    <li class="inline-flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>Community Spirit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Grid overlay -->
        <div class="pointer-events-none absolute inset-0 rounded-3xl [mask-image:linear-gradient(to_bottom,black,transparent)]">
          <svg aria-hidden="true" class="absolute inset-0 h-full w-full stroke-white/10" fill="none"><defs><pattern id="grid2" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 32V.5H32"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid2)"/></svg>
        </div>
      </section>

      <!-- Player Welcome Section -->
      <section v-if="isPlayer" class="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center flex-shrink-0 bg-white">
            <img v-if="playerPhotoUrl" :src="playerPhotoUrl" alt="Player photo" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Welcome to Your Cricket Journey!</h3>
            <p class="text-gray-600 mb-4">As a player, you can create your cricket profile, discover clubs across Kerala, and apply to join teams that match your skills and interests.</p>
            <div class="flex flex-wrap gap-3">
              <RouterLink :to="{ name: 'player-registration' }" class="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Complete Profile
              </RouterLink>
              <RouterLink to="/clubs" class="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Find Clubs
              </RouterLink>
              <RouterLink to="/player/dashboard" class="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Player Dashboard
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Club Manager Welcome Section -->
      <section v-if="isClubManager" class="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Manage Your Cricket Club!</h3>
            <p class="text-gray-600 mb-4">As a club manager, you can register your club, manage player applications, participate in tournaments, and grow Kerala's cricket community.</p>
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/club-manager" class="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Club Manager Dashboard
              </RouterLink>
              <RouterLink to="/club-registration" class="inline-flex items-center px-4 py-2 border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-100 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4"/>
                </svg>
                Register Club
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Coach Welcome Section -->
      <section v-if="isCoach" class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Share Your Cricket Expertise!</h3>
            <p class="text-gray-600 mb-4">As a coach, you can create your coaching profile, showcase your expertise, and apply to coach clubs across Kerala to develop the next generation of cricketers.</p>
            <div class="flex flex-wrap gap-3">
              <RouterLink :to="{ name: 'coach-registration' }" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Complete Profile
              </RouterLink>
              <RouterLink to="/clubs" class="inline-flex items-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Find Clubs
              </RouterLink>
              <RouterLink to="/coach/dashboard" class="inline-flex items-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Coach Dashboard
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Favorites -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-2xl font-bold text-emerald-700 flex items-center gap-2">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.17L12 18.896l-7.336 3.87 1.402-8.17L.132 9.21l8.2-1.192L12 .587z"/></svg>
            Your Favorites
          </h2>
          <div class="text-sm text-gray-500" v-if="!favClubs.length && !favTournaments.length">No favorites yet. Mark tournaments and clubs as ★ Favorite to see them here.</div>
        </div>

        <!-- Favorite Tournaments -->
        <div v-if="favTournaments.length" class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900">Tournaments</h3>
            <button v-if="favTournaments.length" @click="clearFavorites('tournaments')" class="text-xs text-emerald-700 hover:underline">Clear all</button>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="t in favTournaments" :key="t._id" class="group relative rounded-2xl overflow-hidden border bg-white shadow hover:shadow-md transition">
              <div class="h-28 bg-gradient-to-br from-emerald-200 to-emerald-100">
                <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition" />
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h4 class="font-bold text-gray-900 leading-tight">{{ t.name }}</h4>
                    <div class="text-xs text-gray-500">{{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                  </div>
                  <button class="text-amber-500" @click="toggleFavoriteTournament(t._id)">★</button>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" class="text-sm text-emerald-700 hover:underline">Open</RouterLink>
                  <span class="text-[11px] px-2 py-0.5 rounded border" :class="statusBadgeClass(t.status)">{{ t.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorite Clubs -->
        <div v-if="favClubs.length">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900">Clubs</h3>
            <button v-if="favClubs.length" @click="clearFavorites('clubs')" class="text-xs text-emerald-700 hover:underline">Clear all</button>
          </div>
          <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="c in favClubs" :key="c._id || c.id" class="rounded-2xl overflow-hidden border bg-white shadow hover:shadow-md transition">
              <div class="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img v-if="c.logoUrl" :src="c.logoUrl" class="w-20 h-20 object-cover rounded-full border" />
                <div v-else class="text-gray-400 text-xs">No logo</div>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h4 class="font-bold text-gray-900 leading-tight">{{ c.name || c.clubName }}</h4>
                    <div class="text-xs text-gray-500">{{ c.district || c.city || 'Kerala' }}</div>
                  </div>
                  <button class="text-amber-500" @click="toggleFavoriteClub(c._id || c.id)">★</button>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <RouterLink :to="{ name: 'club-details', params: { id: c._id || c.id } }" class="text-sm text-emerald-700 hover:underline">Open</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Updates -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-2xl font-bold text-green-700 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 4h18v13H3z"/><path d="M8 21l4-4 4 4"/></svg>
            Kerala Cricket Updates
          </h2>
          <div class="flex gap-4">
            <RouterLink v-if="isClubManager" to="/club-manager" class="text-sm bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">Club Manager Dashboard</RouterLink>
            <RouterLink v-if="isClubManager" to="/club-registration" class="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Register Club</RouterLink>
            <RouterLink v-if="isPlayer" :to="{ name: 'player-registration' }" class="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">Complete Player Profile</RouterLink>
            <RouterLink v-if="isCoach" :to="{ name: 'coach-registration' }" class="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Complete Coach Profile</RouterLink>
            <RouterLink to="/" class="text-sm text-green-700 hover:underline">View all tournaments</RouterLink>
          </div>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="n in news" :key="n.id" class="rounded-2xl bg-white/70 border border-gray-100 shadow overflow-hidden">
            <div class="h-32 bg-gradient-to-br from-emerald-200 to-emerald-100" />
            <div class="p-4">
              <h3 class="font-semibold text-lg">{{ n.title }}</h3>
              <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ n.summary }}</p>
              <div class="mt-3 text-xs text-gray-500">{{ n.date }}</div>
            </div>
          </article>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import api from '../utils/api';
 
 import axios from 'axios';

const auth = useAuthStore();
const isClubManager = computed(() => (auth.userProfile?.role || 'public') === 'clubManager');
const isPlayer = computed(() => (auth.userProfile?.role || 'public') === 'player');
const isCoach = computed(() => (auth.userProfile?.role || 'public') === 'coach');
const playerPhotoUrl = ref('');

// Favorites state (server-backed per-account)
const favTournamentIds = ref([]);
const favClubIds = ref([]);
const favTournaments = ref([]);
const favClubs = ref([]);

async function loadFavoriteIds(){
  try{
    const { data } = await api.get('/users/me/favorites');
    favTournamentIds.value = (data.favoriteTournaments || []).map(String);
    favClubIds.value = (data.favoriteClubs || []).map(String);
  } catch {
    favTournamentIds.value = [];
    favClubIds.value = [];
  }
}

async function fetchFavoriteTournaments(){
  const ids = Array.from(new Set(favTournamentIds.value));
  const results = [];
  for (const id of ids){
    try {
      const { data } = await api.get(`/tournaments/${id}`);
      if (data && data._id) results.push(data);
    } catch {}
  }
  favTournaments.value = results;
}

async function fetchFavoriteClubs(){
  const ids = Array.from(new Set(favClubIds.value));
  const results = [];
  for (const id of ids){
    try {
      const { data } = await api.get(`/clubs/public/${id}`);
      if (data && (data._id || data.id)) results.push(data);
    } catch {}
  }
  favClubs.value = results;
}

async function toggleFavoriteTournament(id){
  try{
    const isFav = favTournamentIds.value.includes(String(id));
    const { data } = await api.post('/users/me/favorites', { type: 'tournament', id, action: isFav ? 'remove' : 'add' });
    favTournamentIds.value = (data.favoriteTournaments || []).map(String);
    // prune list if removed
    favTournaments.value = favTournaments.value.filter(t => favTournamentIds.value.includes(String(t._id)));
  } catch {}
}

async function toggleFavoriteClub(id){
  try{
    const isFav = favClubIds.value.includes(String(id));
    const { data } = await api.post('/users/me/favorites', { type: 'club', id, action: isFav ? 'remove' : 'add' });
    favClubIds.value = (data.favoriteClubs || []).map(String);
    favClubs.value = favClubs.value.filter(c => favClubIds.value.includes(String(c._id || c.id)));
  } catch {}
}

async function clearFavorites(type){
  try{
    if (type === 'tournaments'){
      // remove all tournaments
      for (const id of favTournamentIds.value) {
        try { await api.post('/users/me/favorites', { type: 'tournament', id, action: 'remove' }); } catch {}
      }
      favTournamentIds.value = []; favTournaments.value = [];
    } else if (type === 'clubs'){
      for (const id of favClubIds.value) {
        try { await api.post('/users/me/favorites', { type: 'club', id, action: 'remove' }); } catch {}
      }
      favClubIds.value = []; favClubs.value = [];
    }
  } catch {}
}

function fmtDate(d){ if(!d) return ''; return new Date(d).toLocaleDateString(); }
function statusBadgeClass(s){
  return s === 'completed' || s === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
         s === 'ongoing' || s === 'Live' ? 'bg-amber-50 text-amber-700 border-amber-200' :
         s === 'cancelled' || s === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
         'bg-gray-50 text-gray-700 border-gray-200';
}

// Static placeholder news
const news = ref([
  { id: 1, title: 'Kochi Tuskers defeat Thrissur Warriors in thriller', date: 'Today', summary: 'A nail-biting final over at the Kochi Cricket Ground saw the Tuskers clinch victory with a last-ball boundary.' },
  { id: 2, title: 'Young Kozhikode batsman scores maiden century', date: 'Yesterday', summary: 'The 19-year-old opener from Kozhikode showcased maturity beyond his years, crafting a classy ton in the district championship.' },
  { id: 3, title: 'Kannur Spinners dominate Palakkad in night match', date: '2 days ago', summary: 'Local spinners ruled the roost under lights as Kannur secured a convincing victory in the inter-district tournament.' },
]);

onMounted(async () => {
  await loadFavoriteIds();
  await Promise.all([fetchFavoriteTournaments(), fetchFavoriteClubs()]);
  // Try to load player photo
  if (isPlayer.value) {
    try {
      const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
      // Add cache-busting parameter to prevent browser caching issues
      const cacheBuster = Date.now();
      const resp = await axios.get(`${API}/players/photo?t=${cacheBuster}`, { 
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      // Clean up previous blob URL if it exists
      if (playerPhotoUrl.value) {
        URL.revokeObjectURL(playerPhotoUrl.value);
      }
      const blobUrl = URL.createObjectURL(resp.data);
      playerPhotoUrl.value = blobUrl;
    } catch {}
  }
});
</script>