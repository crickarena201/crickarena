<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl md:text-3xl font-bold text-emerald-700">Tournaments</h1>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Status</label>
          <select v-model="status" class="px-3 py-2 rounded border bg-white">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-gray-500">Loading...</div>
      <div v-else>
        <div v-if="list.length === 0" class="text-sm text-gray-500">No tournaments found.</div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="t in list" :key="t._id" class="bg-white rounded-xl shadow border overflow-hidden">
            <div class="h-36 bg-gray-100">
              <img v-if="t.bannerUrl" :src="t.bannerUrl" class="w-full h-full object-cover" />
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between">
                <div>
                  <div class="text-lg font-semibold text-gray-900">{{ t.name }}</div>
                  <div class="text-xs text-gray-500">{{ t.format }} • {{ fmtDate(t.startDate) }} - {{ fmtDate(t.endDate) }}</div>
                  <div class="text-xs text-gray-500 mt-1">District: {{ t.district || '-' }}</div>
                </div>
                <span class="px-2 py-0.5 text-xs rounded border" :class="statusPill(t.status)">{{ prettyStatus(t.status) }}</span>
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
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '../utils/api';

const status = ref('all');
const loading = ref(false);
const list = ref([]);

function fmtDate(d){ return d ? new Date(d).toLocaleDateString() : '-'; }
function prettyStatus(s){
  const map = { open: 'Open', upcoming: 'Upcoming', ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' };
  return map[s] || s;
}
function statusPill(s){
  return s === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
         s === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
         s === 'ongoing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
         s === 'completed' ? 'bg-gray-50 text-gray-700 border-gray-200' :
         'bg-blue-50 text-blue-700 border-blue-200';
}

async function load(){
  loading.value = true;
  try{
    const qs = status.value !== 'all' ? `?status=${encodeURIComponent(status.value)}` : '';
    const { data } = await api.get(`/tournaments/list${qs}`);
    list.value = data || [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
watch(status, load);
</script>