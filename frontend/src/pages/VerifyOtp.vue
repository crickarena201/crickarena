<template>
  <div class="max-w-md mx-auto mt-12 bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-100">
    <div class="flex items-center gap-3 mb-6">
      <svg class="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M7 12l3 3 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h1 class="text-2xl font-bold">Verify your email</h1>
    </div>

    <form @submit.prevent="onVerify" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div class="relative">
          <input v-model.trim="email" type="email" placeholder="you@example.com"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l8 5 8-5"/><path d="M4 18h16"/></svg>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">6-digit OTP</label>
        <input v-model.trim="code" type="text" maxlength="6" minlength="6" placeholder="______"
               class="w-full border border-gray-300 rounded-lg px-3 py-2 tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
        <p class="text-xs text-gray-500 mt-1">Enter the code sent to your email.</p>
      </div>

      <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold shadow focus:outline-none focus:ring-4 focus:ring-green-200">
        Verify
      </button>
    </form>

    <transition name="fade">
      <p v-if="msg" class="mt-4 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">{{ msg }}</p>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const email = ref('');
const code = ref('');
const msg = ref('');

onMounted(() => { email.value = route.query.email || ''; });

async function onVerify(){
  const { data } = await axios.post('http://localhost:4000/api/auth/verify-otp', { email: email.value, code: code.value });
  msg.value = data.message;
  setTimeout(() => router.push('/'), 800);
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
