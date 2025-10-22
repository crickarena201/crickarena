<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Reset Password</h1>
    <p class="text-sm text-gray-600 mb-4">You will be redirected to Firebase's secure reset flow from the email link.</p>
    <RouterLink to="/login" class="text-emerald-700 underline">Go to Login</RouterLink>
  </div>
</template>

<script setup>
// With Firebase reset emails, the link handles the reset on Firebase-hosted page.
// Keeping a placeholder route for spec completeness.
</script>