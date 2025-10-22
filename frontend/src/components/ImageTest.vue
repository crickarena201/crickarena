<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Image Loading Test</h2>
    
    <div class="space-y-4">
      <div>
        <h3 class="font-medium mb-2">Placeholder Image (from public directory):</h3>
        <img src="/images/placeholder.png" alt="Placeholder" class="w-32 h-32 border rounded" @error="onImageError">
      </div>
      
      <div>
        <h3 class="font-medium mb-2">Vite Logo (from public directory):</h3>
        <img src="/vite.svg" alt="Vite Logo" class="w-32 h-32 border rounded" @error="onImageError">
      </div>
      
      <div v-if="errorImages.length > 0">
        <h3 class="font-medium text-red-600 mb-2">Failed to load images:</h3>
        <ul class="list-disc pl-5 text-red-500">
          <li v-for="img in errorImages" :key="img">{{ img }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const errorImages = ref([])

function onImageError(event) {
  const src = event.target.src
  errorImages.value.push(src)
  console.error('Failed to load image:', src)
}
</script>