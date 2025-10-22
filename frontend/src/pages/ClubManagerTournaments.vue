<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Tournament Management</h1>
        <p class="text-slate-600">Register for tournaments and manage your participation</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <span class="text-sm font-semibold text-blue-700">{{ registeredTournaments.length }} Registered</span>
        </div>
        <div class="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <span class="text-sm font-semibold text-green-700">{{ availableTournaments.length }} Available</span>
        </div>
      </div>
    </div>

    <!-- Tournament Tabs -->
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-500/10 border border-slate-100/50 overflow-hidden">
      <div class="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50/30">
        <nav class="flex">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                  :class="[
                    'relative px-8 py-5 text-sm font-semibold transition-all duration-300',
                    activeTab === tab.key 
                      ? 'text-blue-600 bg-white shadow-lg' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  ]">
            <span class="relative z-10">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="ml-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
              {{ tab.count }}
            </span>
            <div v-if="activeTab === tab.key" class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-full"></div>
          </button>
        </nav>
      </div>

      <div class="p-8">
        <!-- Available Tournaments -->
        <div v-if="activeTab === 'available'">
          <div v-if="loadingAvailable" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p class="text-slate-600 mt-4 font-medium">Loading tournaments...</p>
          </div>
          <div v-else-if="availableTournaments.length === 0" class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Available Tournaments</h3>
            <p class="text-slate-600 max-w-md mx-auto">There are no tournaments open for registration at the moment. Check back later for new opportunities!</p>
          </div>
          <div v-else class="grid lg:grid-cols-2 gap-8">
            <div v-for="tournament in availableTournaments" :key="tournament._id" 
                 class="group bg-white border-2 border-slate-100 rounded-3xl overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div v-if="tournament.bannerUrl" class="relative h-56 overflow-hidden">
                <img :src="tournament.bannerUrl" alt="Tournament banner" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                    {{ tournament.format || 'Tournament' }}
                  </span>
                </div>
              </div>
              <div class="p-8">
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ tournament.name }}</h3>
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    tournament.status === 'open' ? 'bg-green-100 text-green-700' :
                    tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  ]">
                    {{ tournament.status?.charAt(0).toUpperCase() + tournament.status?.slice(1) }}
                  </span>
                </div>
                
                <p class="text-slate-600 mb-6 line-clamp-2">{{ tournament.description }}</p>
                
                <div class="space-y-3 mb-6">
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">{{ formatDate(tournament.startDate) }} - {{ formatDate(tournament.endDate) }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">{{ tournament.district || tournament.location || 'TBD' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">₹{{ tournament.entryFee || 0 }} Entry Fee</span>
                  </div>
                  <div v-if="tournament.registrationDeadline" class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">Registration closes: {{ formatDate(tournament.registrationDeadline) }}</span>
                  </div>
                </div>

                <div class="bg-slate-50 rounded-2xl p-4 mb-6">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-slate-600">Format:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ tournament.format || 'TBD' }}</span>
                    </div>
                    <div>
                      <span class="text-slate-600">Teams:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ tournament.registrations?.length || 0 }} / {{ tournament.maxTeams || '∞' }}</span>
                    </div>
                    <div v-if="tournament.prizePool">
                      <span class="text-slate-600">Prize Pool:</span>
                      <span class="font-medium text-slate-900 ml-2">₹{{ tournament.prizePool }}</span>
                    </div>
                    <div v-if="tournament.venues && tournament.venues.length">
                      <span class="text-slate-600">Venues:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ tournament.venues.join(', ') }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="text-sm">
                    <span class="text-slate-600">Registration Status:</span>
                    <span class="font-medium text-green-600 ml-1">Open</span>
                  </div>
                  <button @click="registerForTournament(tournament)" 
                          :disabled="registering === tournament._id"
                          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
                    <span v-if="registering === tournament._id">Registering...</span>
                    <span v-else>Register Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registered Tournaments -->
        <div v-if="activeTab === 'registered'">
          <div v-if="loadingRegistered" class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p class="text-slate-600 mt-4 font-medium">Loading registered tournaments...</p>
          </div>
          <div v-else-if="registeredTournaments.length === 0" class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">No Registered Tournaments</h3>
            <p class="text-slate-600 max-w-md mx-auto">You haven't registered for any tournaments yet. Browse available tournaments to get started!</p>
          </div>
          <div v-else class="grid lg:grid-cols-2 gap-8">
            <div v-for="tournament in registeredTournaments" :key="tournament._id" 
                 class="group bg-white border-2 border-green-100 rounded-3xl overflow-hidden hover:border-green-200 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <div v-if="tournament.bannerUrl" class="relative h-56 overflow-hidden">
                <img :src="tournament.bannerUrl" alt="Tournament banner" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div class="absolute top-4 right-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
                    ✓ Registered
                  </span>
                </div>
              </div>
              <div class="p-8">
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">{{ tournament.name }}</h3>
                  <div class="flex flex-col gap-2 items-end">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      tournament.status === 'ongoing' ? 'bg-orange-100 text-orange-700' :
                      tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      tournament.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                      'bg-green-100 text-green-700'
                    ]">
                      {{ tournament.status?.charAt(0).toUpperCase() + tournament.status?.slice(1) }}
                    </span>
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      tournament.applicationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                      tournament.applicationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      tournament.applicationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    ]">
                      {{ tournament.applicationStatus?.charAt(0).toUpperCase() + tournament.applicationStatus?.slice(1) }}
                    </span>
                    <span v-if="tournament.entryFee > 0" :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      tournament.paymentStatus === 'paid' && tournament.paymentVerified ? 'bg-green-100 text-green-700' :
                      tournament.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      tournament.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    ]">
                      {{ tournament.paymentStatus === 'paid' && tournament.paymentVerified ? '✓ Paid' :
                         tournament.paymentStatus === 'pending' ? 'Payment Pending' :
                         tournament.paymentStatus === 'failed' ? 'Payment Failed' :
                         'Payment Required' }}
                    </span>
                  </div>
                </div>
                
                <p class="text-slate-600 mb-6 line-clamp-2">{{ tournament.description }}</p>
                
                <div class="space-y-3 mb-6">
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">{{ formatDate(tournament.startDate) }} - {{ formatDate(tournament.endDate) }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">{{ tournament.location || tournament.district || 'TBD' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm">
                    <div class="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                    <span class="font-medium text-slate-900">₹{{ tournament.entryFee || 0 }} Entry Fee</span>
                  </div>
                </div>
                
                <div class="bg-slate-50 rounded-2xl p-4 mb-6">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-slate-600">Applied:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ formatDate(tournament.appliedAt) }}</span>
                    </div>
                    <div v-if="tournament.decisionAt">
                      <span class="text-slate-600">Decision:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ formatDate(tournament.decisionAt) }}</span>
                    </div>
                    <div>
                      <span class="text-slate-600">Format:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ tournament.format || 'TBD' }}</span>
                    </div>
                    <div>
                      <span class="text-slate-600">Teams:</span>
                      <span class="font-medium text-slate-900 ml-2">{{ tournament.totalRegistrations || 0 }} / {{ tournament.maxTeams || '∞' }}</span>
                    </div>
                  </div>
                  <div v-if="tournament.rejectionReason" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div class="text-sm text-red-700">
                      <span class="font-medium">Rejection Reason:</span> {{ tournament.rejectionReason }}
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="text-sm">
                    <span :class="[
                      'font-medium',
                      tournament.applicationStatus === 'approved' ? 'text-green-600' :
                      tournament.applicationStatus === 'pending' ? 'text-yellow-600' :
                      tournament.applicationStatus === 'rejected' ? 'text-red-600' :
                      'text-slate-600'
                    ]">
                      {{ tournament.applicationStatus === 'approved' ? 'Approved for Tournament' :
                         tournament.applicationStatus === 'pending' ? 'Application Pending' :
                         tournament.applicationStatus === 'rejected' ? 'Application Rejected' :
                         'Application Status Unknown' }}
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <RouterLink :to="{ name: 'tournament-details', params: { id: tournament.id } }" 
                               class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
                      View Details
                    </RouterLink>
                    <!-- Payment Button: Only show if entry fee exists and not yet paid -->
                    <button v-if="tournament.entryFee > 0 && !(tournament.paymentStatus === 'paid' && tournament.paymentVerified)" 
                            @click="handlePayment(tournament)"
                            :disabled="paying === tournament.id"
                            class="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl">
                      <span v-if="paying === tournament.id">Processing...</span>
                      <span v-else>Pay Entry Fee</span>
                    </button>
                    <!-- Paid Status Button -->
                    <button v-else-if="tournament.entryFee > 0 && tournament.paymentStatus === 'paid' && tournament.paymentVerified" 
                            disabled
                            class="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium cursor-not-allowed">
                      ✓ Paid
                    </button>
                  </div>
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { notify } from '../utils/notifications';

const activeTab = ref('available');
const availableTournaments = ref([]);
const registeredTournaments = ref([]);
const loadingAvailable = ref(false);
const loadingRegistered = ref(false);
const registering = ref(null);
const paying = ref(null);

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const tabs = computed(() => [
  { key: 'available', label: 'Available Tournaments', count: availableTournaments.value.length },
  { key: 'registered', label: 'My Tournaments', count: registeredTournaments.value.length }
]);

onMounted(async () => {
  await Promise.all([loadAvailableTournaments(), loadRegisteredTournaments()]);
});

async function loadAvailableTournaments() {
  loadingAvailable.value = true;
  try {
    // Get open tournaments for registration
    const response = await axios.get(`${API}/tournaments/open`);
    const allOpenTournaments = response.data || [];
    
    // Get club's applied tournaments to filter them out
    const appliedResponse = await axios.get(`${API}/clubs/my-club/tournaments`);
    const appliedTournaments = appliedResponse.data.tournaments || [];
    const appliedTournamentIds = appliedTournaments.map(t => t.id);
    
    // Filter out tournaments the club has already applied to
    availableTournaments.value = allOpenTournaments.filter(t => !appliedTournamentIds.includes(t._id));
  } catch (error) {
    console.error('Failed to load available tournaments:', error);
  } finally {
    loadingAvailable.value = false;
  }
}

async function loadRegisteredTournaments() {
  loadingRegistered.value = true;
  try {
    const response = await axios.get(`${API}/clubs/my-club/tournaments`);
    registeredTournaments.value = response.data.tournaments || [];
  } catch (error) {
    console.error('Failed to load registered tournaments:', error);
  } finally {
    loadingRegistered.value = false;
  }
}

async function registerForTournament(tournament) {
  registering.value = tournament._id;
  try {
    await axios.post(`${API}/tournaments/${tournament._id}/register`);
    // Move tournament from available to registered
    availableTournaments.value = availableTournaments.value.filter(t => t._id !== tournament._id);
    registeredTournaments.value.push({ ...tournament, registrationDate: new Date().toISOString() });
    notify.success('Successfully registered for tournament!');
  } catch (error) {
    console.error('Failed to register for tournament:', error);
    notify.error(error.response?.data?.message || 'Failed to register for tournament');
  } finally {
    registering.value = null;
  }
}

async function handlePayment(tournament) {
  if (!tournament.entryFee || tournament.entryFee <= 0) {
    notify.info('No entry fee required for this tournament');
    return;
  }

  // Check if already paid
  if (tournament.paymentStatus === 'paid' && tournament.paymentVerified) {
    notify.success('Entry fee has already been paid for this tournament');
    return;
  }

  paying.value = tournament.id;
  try {
    // Create Razorpay order
    const orderResponse = await axios.post(`${API}/payments/orders`, {
      tournamentId: tournament.id
    });

    const { keyId, order, amount, currency } = orderResponse.data;

    // Initialize Razorpay payment
    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: 'CrickArena',
      description: `Entry fee for ${tournament.name}`,
      order_id: order.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          await axios.post(`${API}/payments/verify`, {
            tournamentId: tournament.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          notify.success('Payment successful! Entry fee paid.');
          // Reload tournament data to reflect payment status
          await loadRegisteredTournaments();
        } catch (error) {
          console.error('Payment verification error:', error);
          notify.error('Payment verification failed. Please contact support.');
        }
      },
      theme: {
        color: '#3B82F6'
      }
    };

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      notify.error('Payment system not loaded. Please refresh the page.');
      paying.value = null;
      return;
    }

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      notify.error('Payment failed: ' + response.error.description);
      paying.value = null;
    });
    razorpay.open();
    
  } catch (error) {
    console.error('Payment error:', error);
    const errorMsg = error.response?.data?.message || 'Payment failed. Please try again.';
    notify.error(errorMsg);
  } finally {
    paying.value = null;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-8 > * {
  animation: fadeInUp 0.6s ease-out;
}

.space-y-8 > *:nth-child(2) {
  animation-delay: 0.1s;
}
</style>