<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-bold text-sky-700 mb-4">Tournaments</h1>

      <div class="flex gap-2 mb-6">
        <button @click="activeTab = 'available'" class="px-3 py-1.5 rounded border text-sm" :class="activeTab==='available' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 hover:bg-gray-50'">Available</button>
        <button @click="activeTab = 'mine'" class="px-3 py-1.5 rounded border text-sm" :class="activeTab==='mine' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 hover:bg-gray-50'">My Tournaments</button>
        <button @click="activeTab = 'all'" class="px-3 py-1.5 rounded border text-sm" :class="activeTab==='all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 hover:bg-gray-50'">All</button>
      </div>

      <!-- Available (Open for Registration) -->
      <div v-if="activeTab==='available'">
        <div v-if="loadingA" class="text-gray-500">Loading...</div>
        <div v-else class="grid md:grid-cols-2 gap-4">
          <div v-for="t in available" :key="t._id" class="bg-white rounded-lg shadow border overflow-hidden">
            <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-36 object-cover" />
            <div class="p-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-lg font-semibold text-gray-800">{{ t.name }}</div>
                  <div class="text-xs text-gray-500">{{ t.format }} • {{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                  <div class="text-xs text-gray-500">District: {{ t.district || '-' }}</div>
                  <div class="text-xs text-gray-500">Reg. Deadline: {{ t.registrationDeadline ? fmtDate(t.registrationDeadline) : '-' }}</div>
                </div>
              </div>
              <div class="mt-3">
                <label class="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="agree[t._id]" />
                  <span>I agree to tournament rules</span>
                </label>
              </div>
              <div class="mt-3 flex items-center gap-2">
                <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" class="px-3 py-1.5 rounded border hover:bg-gray-50">View Details</RouterLink>
                <template v-if="eligibility(t).canRegister">
                  <button @click="register(t)" class="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700">Register Now</button>
                </template>
                <template v-else>
                  <span class="px-2 py-0.5 text-xs rounded border" :class="eligibility(t).badgeClass">{{ eligibility(t).reason }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Tournaments -->
      <div v-else-if="activeTab==='mine'">
        <div v-if="loadingM" class="text-gray-500">Loading...</div>
        <div v-else class="grid md:grid-cols-2 gap-4">
          <div v-for="t in mine" :key="t._id" class="bg-white rounded-lg shadow border overflow-hidden">
            <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-36 object-cover" />
            <div class="p-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-lg font-semibold text-gray-800">{{ t.name }}</div>
                  <div class="text-xs text-gray-500">{{ t.format }} • {{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                  <div class="text-xs text-gray-500">District: {{ t.district || '-' }}</div>
                </div>
                <span class="px-2 py-0.5 text-xs rounded border" :class="statusClass(t.myRegistrationStatus)">{{ t.myRegistrationStatus }}</span>
              </div>
              <div class="mt-3">
                <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" class="px-3 py-1.5 rounded border hover:bg-gray-50">View Details</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Tournaments (with status filter including Cancelled) -->
      <div v-else>
        <div class="flex items-center gap-2 mb-3">
          <label class="text-sm text-gray-600">Status:</label>
          <select v-model="allStatus" class="px-3 py-2 rounded border">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div v-if="loadingAll" class="text-gray-500">Loading...</div>
        <div v-else>
          <div v-if="allFiltered.length === 0" class="text-sm text-gray-500">No tournaments found.</div>
          <div v-else class="grid md:grid-cols-2 gap-4">
            <div v-for="t in allFiltered" :key="t._id" class="bg-white rounded-lg shadow border overflow-hidden">
              <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-36 object-cover" />
              <div class="p-4">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="text-lg font-semibold text-gray-800">{{ t.name }}</div>
                    <div class="text-xs text-gray-500">{{ t.format }} • {{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                    <div class="text-xs text-gray-500">District: {{ t.district || '-' }}</div>
                  </div>
                  <span class="px-2 py-0.5 text-xs rounded border" :class="tournamentStatusClass(t.status)">{{ prettyStatus(t.status) }}</span>
                </div>
                <div class="mt-3">
                  <RouterLink :to="{ name: 'tournament-details', params: { id: t._id } }" class="px-3 py-1.5 rounded border hover:bg-gray-50">View Details</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import api from '../utils/api';

const activeTab = ref('available');

// Available
const available = ref([]);
const loadingA = ref(false);
const agree = ref({});

// Mine
const mine = ref([]);
const loadingM = ref(false);

// All
const allList = ref([]);
const loadingAll = ref(false);
const allStatus = ref('all'); // all | open | upcoming | ongoing | completed | cancelled

function fmtDate(d){ return new Date(d).toLocaleDateString(); }
function statusClass(status){
  return status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
         status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
         status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
         'bg-gray-50 text-gray-700 border-gray-200';
}

function tournamentStatusClass(status){
  return status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
         status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
         status === 'ongoing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
         status === 'completed' ? 'bg-gray-50 text-gray-700 border-gray-200' :
         'bg-blue-50 text-blue-700 border-blue-200';
}
function prettyStatus(s){
  const map = { open: 'Open', upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' };
  return map[s] || s;
}

// Map of tournamentId -> my status for quick checks
const myStatusMap = computed(() => {
  const map = {};
  for (const t of mine.value) map[t._id] = t.myRegistrationStatus;
  return map;
});

function eligibility(t){
  const now = new Date();
  const regDeadlinePassed = t.registrationDeadline && new Date(t.registrationDeadline) < now;
  const notOpen = t.status !== 'open';
  const myStatus = myStatusMap.value[t._id];
  const regs = Array.isArray(t.registrations) ? t.registrations : [];
  const approvedCount = regs.filter(r => r.status === 'approved' || r.status === 'pending').length; // pending also occupies a slot
  const isFull = typeof t.maxTeams === 'number' && approvedCount >= t.maxTeams;

  if (myStatus === 'approved') return { canRegister: false, reason: 'Approved', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (myStatus === 'pending') return { canRegister: false, reason: 'Already joined', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (myStatus === 'rejected') return { canRegister: false, reason: 'Rejected', badgeClass: 'bg-red-50 text-red-700 border-red-200' };
  if (regDeadlinePassed) return { canRegister: false, reason: 'Registration Closed', badgeClass: 'bg-gray-50 text-gray-700 border-gray-200' };
  if (isFull) return { canRegister: false, reason: 'Full', badgeClass: 'bg-gray-50 text-gray-700 border-gray-200' };
  if (notOpen) return { canRegister: false, reason: 'Not Available', badgeClass: 'bg-gray-50 text-gray-700 border-gray-200' };
  // Backend also ensures club approved; we assume club-manager route implies approved club, but UI hint:
  // Optionally fetch club status and add check here if needed.
  return { canRegister: true, reason: 'Register Now', badgeClass: 'bg-green-50 text-green-700 border-green-200' };
}

async function loadAvailable(){
  loadingA.value = true; try { const { data } = await api.get('/tournaments/open'); available.value = data; } finally { loadingA.value = false; }
}
async function loadMine(){
  loadingM.value = true; try { const { data } = await api.get('/tournaments/mine'); mine.value = data; } finally { loadingM.value = false; }
}
async function loadAllTournaments(){
  loadingAll.value = true;
  try {
    const qs = allStatus.value !== 'all' ? `?status=${encodeURIComponent(allStatus.value)}` : '';
    const { data } = await api.get(`/tournaments/list${qs}`);
    allList.value = data || [];
  } finally {
    loadingAll.value = false;
  }
}

const allFiltered = computed(() => allStatus.value === 'all' ? allList.value : allList.value.filter(t => t.status === allStatus.value));

async function register(t){
  if (!agree.value[t._id]){ alert('Please agree to tournament rules'); return; }
  const elig = eligibility(t);
  if (!elig.canRegister){ alert(elig.reason); return; }
  try {
    // Always create a registration request first; admin approval will gate payment
    await api.post(`/tournaments/${t._id}/register`);
    if (Number(t.entryFee) > 0) {
      alert('Registration submitted. You will be prompted to pay after admin approval.');
    } else {
      alert('Registration submitted. No entry fee required.');
    }
  } catch (e) {
    alert(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Failed to register');
  }
  await Promise.all([loadAvailable(), loadMine()]);
}

onMounted(async () => { await Promise.all([loadAvailable(), loadMine()]); });
watch(activeTab, async () => {
  if (activeTab.value==='available') loadAvailable();
  else if (activeTab.value==='mine') loadMine();
  else loadAllTournaments();
});
watch(allStatus, async () => { if (activeTab.value === 'all') await loadAllTournaments(); });
</script>