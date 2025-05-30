<script setup>
import { useAnalyticsStore } from "@/stores/analytics";
import { onMounted, computed } from "vue";
import { Pie, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const analyticsStore = useAnalyticsStore();
onMounted(() => {
  analyticsStore.fetchPostAnalytics();
});

const platformLabels = computed(() =>
  analyticsStore.data?.posts_per_platform?.map((p) => p.name) || []
);
const platformCounts = computed(() =>
  analyticsStore.data?.posts_per_platform?.map((p) => p.posts_count) || []
);
</script>

<template>
  <div class="analytics">
    <h2 class="text-xl font-bold mb-4">Post Analytics</h2>

    <div v-if="analyticsStore.data">
      <!-- Posts Per Platform -->
      <div class="mb-6">
        <h3 class="font-semibold mb-2">Posts per Platform</h3>
        <Bar
          :data="{
            labels: platformLabels,
            datasets: [
              {
                label: 'Posts',
                backgroundColor: '#3b82f6',
                data: platformCounts,
              },
            ],
          }"
          :options="{ responsive: true, plugins: { legend: { display: false } } }"
        />
      </div>

      <!-- Success Rate -->
      <div class="mb-6">
        <h3 class="font-semibold">Publishing Success Rate</h3>
        <p class="text-lg text-green-700 mt-2">
          {{ analyticsStore.data.success_rate }}%
        </p>
      </div>

      <!-- Scheduled vs Published -->
      <div>
        <h3 class="font-semibold mb-2">Scheduled vs Published</h3>
        <Pie
          :data="{
            labels: ['Scheduled', 'Published'],
            datasets: [
              {
                backgroundColor: ['#f59e0b', '#10b981'],
                data: [
                  analyticsStore.data.scheduled_count,
                  analyticsStore.data.published_count,
                ],
              },
            ],
          }"
        />
      </div>
    </div>

    <div v-else class="text-gray-500">Loading analytics...</div>
  </div>
</template>

<style scoped>
.analytics {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}
</style>
