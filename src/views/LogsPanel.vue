<script setup>
import { useLogsStore } from "@/stores/logs";
import { onMounted } from "vue";

const logsStore = useLogsStore();
onMounted(() => {
  logsStore.fetchLogs();
});
</script>

<template>
  <div class="log-panel">
    <h2 class="text-lg font-semibold mb-4">Activity Logs</h2>
    <ul v-if="logsStore.logs.length" class="space-y-2">
      <li
        v-for="log in logsStore.logs"
        :key="log.id"
        class="border p-3 rounded text-sm bg-gray-50"
      >
        <strong>{{ log.user.name }}</strong> - {{ log.action }}<br />
        <span class="text-gray-500">{{ log.description }}</span
        ><br />
        <small class="text-gray-400">{{
          new Date(log.created_at).toLocaleString()
        }}</small>
      </li>
    </ul>
    <p v-else>No logs found.</p>
  </div>
</template>
