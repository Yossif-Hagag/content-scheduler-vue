<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <main>
    <h1 class="title">Welcome to Content Scheduler</h1>
    <p class="subtitle">
      <span v-if="user">Welcome back <span class="font-semibold text-slate-600">{{ user.name }}</span>! You are logged in. Go to your <router-link to="/dashboard">dashboard</router-link>.</span>
      <span v-else>Please login to access your dashboard.</span>
    </p>
  </main>
</template>

<style scoped>
.title {
  text-align: center;
  margin-top: 80px;
  font-size: 2.5rem;
  color: #2563eb;
}
.subtitle {
  text-align: center;
  margin-top: 16px;
  color: #64748b;
  font-size: 1.2rem;
}
</style>