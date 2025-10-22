<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Forgot Password</h1>
    <form @submit.prevent="send" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="email" type="email" class="w-full border rounded px-3 py-2" required />
      </div>
      <button :disabled="loading" class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
    <p v-if="errorMsg" class="text-sm text-red-600 mt-3">{{ errorMsg }}</p>
    <p v-if="sent" class="text-sm text-gray-600 mt-3">
      If this email exists, a reset link has been sent.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, isFirebaseConfigured } from '../firebase/client';
import { sendPasswordResetEmail } from 'firebase/auth';

const email = ref('');
const loading = ref(false);
const sent = ref(false);
const errorMsg = ref('');

async function send(){
  errorMsg.value = '';
  sent.value = false;
  try {
    loading.value = true;

    if (!isFirebaseConfigured || !auth) {
      throw new Error('AUTH_NOT_CONFIGURED');
    }

    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    };

    await sendPasswordResetEmail(auth, email.value.trim(), actionCodeSettings);
    sent.value = true;
  } catch (e) {
    console.error('Password reset error:', e);
    // Show helpful message in dev, generic in production
    if (import.meta.env.DEV) {
      if (e?.message === 'AUTH_NOT_CONFIGURED') {
        errorMsg.value = 'Auth not configured. Set VITE_FIREBASE_* in frontend/.env and restart dev server.';
      } else if (e?.code) {
        errorMsg.value = `${e.code}: ${e.message || 'Failed to send reset email.'}`;
      } else {
        errorMsg.value = 'Failed to send reset email. Check console for details.';
      }
    } else {
      // Avoid account enumeration in production
      sent.value = true;
    }
  } finally {
    loading.value = false;
  }
}
</script>