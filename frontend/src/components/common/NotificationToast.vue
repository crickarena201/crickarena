<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              type === 'success' ? 'bg-green-100' : 
              type === 'error' ? 'bg-red-100' : 
              type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
            ]">
              <!-- Success Icon -->
              <svg v-if="type === 'success'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <!-- Error Icon -->
              <svg v-else-if="type === 'error'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <!-- Warning Icon -->
              <svg v-else-if="type === 'warning'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <!-- Info Icon -->
              <svg v-else class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          
          <!-- Content -->
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-semibold text-slate-900">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm text-slate-600">
              {{ message }}
            </p>
          </div>
          
          <!-- Close Button -->
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="close"
              class="bg-white rounded-lg inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div v-if="showProgress" class="h-1 bg-slate-100">
        <div
          :class="[
            'h-full transition-all duration-100 ease-linear',
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
          ]"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 4000
  },
  showProgress: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const progress = ref(100);
let progressInterval = null;
let autoCloseTimeout = null;

function close() {
  emit('close');
}

function startProgress() {
  if (!props.showProgress || props.duration <= 0) return;
  
  const stepTime = 50; // Update every 50ms
  const totalSteps = props.duration / stepTime;
  const stepDecrement = 100 / totalSteps;
  
  progressInterval = setInterval(() => {
    progress.value -= stepDecrement;
    if (progress.value <= 0) {
      progress.value = 0;
      clearInterval(progressInterval);
    }
  }, stepTime);
}

function startAutoClose() {
  if (props.duration > 0) {
    autoCloseTimeout = setTimeout(() => {
      close();
    }, props.duration);
  }
}

onMounted(() => {
  if (props.show) {
    startProgress();
    startAutoClose();
  }
});

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout);
  }
});

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    progress.value = 100;
    startProgress();
    startAutoClose();
  } else {
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
    }
  }
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
