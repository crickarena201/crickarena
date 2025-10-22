<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Welcome, Admin</h1>
      <p class="text-gray-600">Use the shortcuts below to manage the platform.</p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <RouterLink :to="{ name: 'admin-tournaments' }" class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">🏆</div>
          <div>
            <div class="font-semibold">Tournament Management</div>
            <div class="text-sm text-gray-500">Create, edit, approve teams, fixtures</div>
          </div>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-clubs' }" class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">👥</div>
          <div>
            <div class="font-semibold">Club Management</div>
            <div class="text-sm text-gray-500">Review and approve clubs</div>
          </div>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-players' }" class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">🏃</div>
          <div>
            <div class="font-semibold">Player Management</div>
            <div class="text-sm text-gray-500">View and manage players</div>
          </div>
        </div>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-coaches' }" class="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">👨‍🏫</div>
          <div>
            <div class="font-semibold">Coach Management</div>
            <div class="text-sm text-gray-500">View and manage coaches</div>
          </div>
        </div>
      </RouterLink>

      <div class="block rounded-xl border border-dashed border-gray-200 p-5 bg-gray-50 text-gray-500 cursor-not-allowed">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">📊</div>
          <div>
            <div class="font-semibold">Analytics</div>
            <div class="text-sm">Coming Soon</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>