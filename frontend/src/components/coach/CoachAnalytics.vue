<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Coaching Analytics</h2>
      <div class="flex gap-2">
        <select
          v-model="timeRange"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid md:grid-cols-4 gap-4 mb-8">
      <div class="bg-blue-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-800">Players Coached</p>
            <p class="text-2xl font-bold text-blue-900">{{ analytics.playersCoached }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-green-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-800">Sessions Conducted</p>
            <p class="text-2xl font-bold text-green-900">{{ analytics.sessionsConducted }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-purple-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-800">Avg. Attendance</p>
            <p class="text-2xl font-bold text-purple-900">{{ analytics.avgAttendance }}%</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-yellow-50 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-800">Programs Active</p>
            <p class="text-2xl font-bold text-yellow-900">{{ analytics.activePrograms }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Attendance Trend -->
      <div class="border border-gray-200 rounded-xl p-4">
        <h3 class="font-semibold text-gray-900 mb-4">Attendance Trend</h3>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(data, index) in attendanceData"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-green-500 rounded-t hover:bg-green-600 transition"
              :style="{ height: data.value + '%' }"
            ></div>
            <span class="text-xs text-gray-500 mt-2">{{ data.label }}</span>
          </div>
        </div>
      </div>

      <!-- Skill Development -->
      <div class="border border-gray-200 rounded-xl p-4">
        <h3 class="font-semibold text-gray-900 mb-4">Skill Development Overview</h3>
        <div class="space-y-4">
          <div
            v-for="skill in skillDevelopment"
            :key="skill.name"
            class="space-y-2"
          >
            <div class="flex justify-between">
              <span class="text-sm font-medium">{{ skill.name }}</span>
              <span class="text-sm font-bold text-green-600">{{ skill.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full"
                :style="{ width: skill.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div>
      <h3 class="font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
        >
          <div
            :class="{
              'bg-green-100 text-green-800': activity.type === 'session',
              'bg-blue-100 text-blue-800': activity.type === 'player',
              'bg-purple-100 text-purple-800': activity.type === 'program'
            }"
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <svg
              v-if="activity.type === 'session'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <svg
              v-else-if="activity.type === 'player'"
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ activity.time }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ activity.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const timeRange = ref('30');

// Mock data for demonstration
const analytics = ref({
  playersCoached: 24,
  sessionsConducted: 42,
  avgAttendance: 87,
  activePrograms: 3
});

const attendanceData = ref([
  { label: 'Mon', value: 75 },
  { label: 'Tue', value: 82 },
  { label: 'Wed', value: 90 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 85 },
  { label: 'Sat', value: 92 },
  { label: 'Sun', value: 88 }
]);

const skillDevelopment = ref([
  { name: 'Batting Technique', progress: 85 },
  { name: 'Bowling Accuracy', progress: 78 },
  { name: 'Fielding Skills', progress: 92 },
  { name: 'Fitness Level', progress: 80 },
  { name: 'Mental Strength', progress: 75 }
]);

const recentActivities = ref([
  {
    id: '1',
    type: 'session',
    title: 'Cover Drive Session',
    time: '2 hours ago',
    description: 'Conducted advanced batting technique session with 12 players'
  },
  {
    id: '2',
    type: 'player',
    title: 'New Player Added',
    time: '1 day ago',
    description: 'Added Amit Kumar to Advanced Batting Program'
  },
  {
    id: '3',
    type: 'program',
    title: 'Program Update',
    time: '2 days ago',
    description: 'Updated Bowling Mastery Program schedule'
  },
  {
    id: '4',
    type: 'session',
    title: 'Fielding Practice',
    time: '3 days ago',
    description: 'Completed fielding positions training session'
  }
]);

// Update data based on time range
const updateData = () => {
  // In a real implementation, this would fetch data from the API based on the selected time range
  console.log(`Updating data for last ${timeRange.value} days`);
};

watch(timeRange, () => {
  updateData();
});

onMounted(() => {
  updateData();
});
</script>

<style scoped>
/* Custom styles */
</style>