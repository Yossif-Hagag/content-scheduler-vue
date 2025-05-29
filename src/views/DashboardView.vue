<script setup>
import { usePostsStore } from "@/stores/posts";
import { usePlatformsStore } from "@/stores/platforms";
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";

const { getAllPosts } = usePostsStore();
const { getAllPlatforms } = usePlatformsStore();

const posts = ref([]);
const platforms = ref([]);
const statusFilter = ref("");
const dateFilter = ref("");
const today = new Date().toISOString().slice(0, 10);

onMounted(async () => {
  posts.value = await getAllPosts();
  platforms.value = await getAllPlatforms();
});

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const statusMatch = statusFilter.value ? post.status === statusFilter.value : true;
    const dateMatch = dateFilter.value ? post.scheduled_time?.slice(0, 10) === dateFilter.value : true;
    return statusMatch && dateMatch;
  });
});

const scheduledTodayCount = computed(() =>
  posts.value.filter(
    post => post.status === "scheduled" && post.scheduled_time?.slice(0, 10) === today
  ).length
);
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">Dashboard</h1>
      <RouterLink to="/posts/create" class="primary-btn w-1/2">+ New Post</RouterLink>
    </div>

    <!-- Quick Stats -->
    <div class="mb-4 flex gap-6">
      <div class="stat-box">
        <div class="stat-title">Scheduled Today</div>
        <div class="stat-value">{{ scheduledTodayCount }} / 10</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">Total Posts</div>
        <div class="stat-value">{{ posts.length }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 flex gap-4">
      <select v-model="statusFilter" class="filter-select">
        <option value="">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>
      <input type="date" v-model="dateFilter" class="filter-select" />
    </div>

    <!-- Posts List -->
    <div v-if="filteredPosts.length > 0">
      <div
        v-for="post in filteredPosts"
        :key="post.id"
        class="border-l-4 border-blue-500 pl-4 mb-8 bg-white shadow rounded p-4"
      >
        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl">{{ post.title }}</h2>
          <span
            :class="{
              'badge-draft': post.status === 'draft',
              'badge-scheduled': post.status === 'scheduled',
              'badge-published': post.status === 'published'
            }"
          >
            {{ post.status }}
          </span>
        </div>
        <div class="text-xs text-slate-600 mb-2">
          Scheduled: {{ post.scheduled_time ? post.scheduled_time.slice(0,16).replace('T',' ') : 'N/A' }}
        </div>
        <div class="mb-2">
          <span v-for="platform in post.platforms" :key="platform.id" class="platform-chip">
            {{ platform.name }}
          </span>
        </div>
        <p class="mb-2">{{ post.content }}</p>
        <div class="flex gap-2">
          <RouterLink :to="{ name: 'edit', params: { id: post.id } }" class="btn-edit">Edit</RouterLink>
          <RouterLink :to="{ name: 'show', params: { id: post.id } }" class="btn-view">View</RouterLink>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">No posts found</h2>
    </div>
  </main>
</template>

<style scoped>
.stat-box {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 12px 24px;
  min-width: 120px;
  text-align: center;
}
.stat-title {
  font-size: 0.9rem;
  color: #64748b;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}
.filter-select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}
.badge-draft {
  background: #fef9c3;
  color: #b45309;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}
.badge-scheduled {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}
.badge-published {
  background: #dcfce7;
  color: #15803d;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}
.platform-chip {
  background: #e0e7ef;
  color: #334155;
  border-radius: 8px;
  padding: 2px 8px;
  margin-right: 4px;
  font-size: 0.85rem;
}
.btn-edit, .btn-view {
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: underline;
  color: #2563eb;
  background: #f1f5f9;
}
.btn-edit:hover, .btn-view:hover {
  background: #dbeafe;
}
</style>