<script setup>
import { ref, onMounted } from "vue";
import { usePlatformsStore } from "@/stores/platforms";
import { storeToRefs } from "pinia";

const loading = ref(false);
const store = usePlatformsStore();
const { platforms, activePlatforms, message, errors } = storeToRefs(store);

const fetchData = async () => {
  loading.value = true;
  await store.getAllPlatforms();
  await store.getActivePlatforms();
  loading.value = false;
};

const isActive = (platformId) => {
  return activePlatforms.value.some((p) => p.id === platformId);
};

const togglePlatform = async (platformId) => {
  const action = isActive(platformId) ? "detach" : "attach";
  await store.toggleActivePlatform(platformId, action);
};

onMounted(fetchData);
</script>

<template>
  <main class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Platform Management</h1>

    <div v-if="loading">Loading...</div>

    <div
      v-if="message || errors.general"
      :class="['p-3 rounded mb-4', errors.general ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']"
    >
      <span
        class="float-right cursor-pointer font-bold"
        @click="
          () => {
            store.message = null;
            store.errors = {};
          }
        "
        >&times;</span
      >
      <div v-if="message">{{ message }}</div>
      <div v-if="errors.general">{{ errors.general[0] }}</div>
    </div>

    <div
      v-for="platform in platforms"
      :key="platform.id"
      class="flex justify-between items-center border p-4 rounded mb-2"
    >
      <div class="font-semibold">{{ platform.name }}</div>
      <button
        @click="togglePlatform(platform.id)"
        :class="[
          'px-4 py-2 rounded font-medium',
          isActive(platform.id)
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-green-100 text-green-600 hover:bg-green-200',
        ]"
      >
        {{ isActive(platform.id) ? "Deactivate" : "Activate" }}
      </button>
    </div>
  </main>
</template>
