<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import PostAnalytics from "@/views/PostAnalytics.vue";

const authStore = useAuthStore();
</script>

<template>
  <header>
    <nav>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>

      <div v-if="authStore.user" class="flex items-center space-x-6">
        <RouterLink :to="{ name: 'dashboard' }" class="nav-link"
          >Dashboard</RouterLink
        >
        <RouterLink :to="{ name: 'post_analytics' }" class="nav-link"
          >Post Analytics
        </RouterLink>
        <RouterLink :to="{ name: 'settings' }" class="nav-link"
          >Settings
        </RouterLink>
        <RouterLink :to="{ name: 'logs' }" class="nav-link">Logs</RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="nav-link"
          >Profile</RouterLink
        >
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>

      <div v-else class="space-x-6">
        <RouterLink :to="{ name: 'register' }" class="nav-link">
          Register
        </RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-link">
          Login
        </RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>
