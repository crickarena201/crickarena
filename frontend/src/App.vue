<template>
  <div class="min-h-screen flex flex-col bg-[rgb(var(--bg))]">
    <template v-if="!isAdminRoute">
      <Navbar />
      <main class="flex-1 pt-6">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
          <transition name="page" mode="out-in">
            <router-view />
          </transition>
        </div>
      </main>
      <footer class="border-t border-gray-200/60 dark:border-neutral-800 mt-10">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-8 text-sm text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span>© {{ new Date().getFullYear() }} CrickArena</span>
          <div class="flex items-center gap-6">
            <RouterLink to="/help" class="hover:text-gray-700 dark:hover:text-gray-300">Help Center</RouterLink>
            <RouterLink to="/contact" class="hover:text-gray-700 dark:hover:text-gray-300">Contact Us</RouterLink>
            <RouterLink to="/privacy" class="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</RouterLink>
            <RouterLink to="/terms" class="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</RouterLink>
          </div>
        </div>
      </footer>
    </template>
    <template v-else>
      <router-view />
    </template>
    
    <!-- Global Notification Component -->
    <NotificationPopup />
    
    <!-- Global Confirm Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import NotificationPopup from './components/NotificationPopup.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';

const route = useRoute();
const isAdminRoute = computed(() => route.matched.some(r => r.meta && (r.meta.requiresAdmin || r.meta.requiresClubManager || r.meta.requiresCoach || r.meta.requiresPlayer)));
</script>

<style>
.page-enter-active, .page-leave-active { transition: opacity .15s, transform .15s; }
.page-enter-from, .page-leave-to { opacity: 0; transform: translateY(4px); }
</style>
