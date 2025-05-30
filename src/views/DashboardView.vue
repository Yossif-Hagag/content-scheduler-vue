<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { usePostsStore } from "@/stores/posts";
import { usePlatformsStore } from "@/stores/platforms";

const postsStore = usePostsStore();
const platformsStore = usePlatformsStore();

const { message, errors } = storeToRefs(postsStore);

const posts = ref([]);
const platforms = ref([]);
const statusFilter = ref("");
const dateFilter = ref("");
const today = new Date().toLocaleDateString("en-CA");
const calendarView = ref(false);

async function fetchPosts() {
  const params = {};
  if (statusFilter.value) params.status = statusFilter.value;
  if (calendarView.value) {
    statusFilter.value = "scheduled";
  }
  if (dateFilter.value) params.date = dateFilter.value;

  posts.value = await postsStore.getAllPosts(params);
}

onMounted(async () => {
  await fetchPosts();
  platforms.value = await platformsStore.getAllPlatforms();

  if (calendarView.value) {
    initCalendar();
  }
});

watch([statusFilter, dateFilter], async () => {
  await fetchPosts();
  if (calendarView.value) {
    updateCalendarEvents();
  }
});

const scheduledTodayCount = computed(() => {
  return posts.value.filter((post) => {
    if (post.status !== "scheduled" || !post.scheduled_time) return false;

    const scheduledDate = new Date(post.scheduled_time)
      .toISOString()
      .slice(0, 10);
    return scheduledDate === today;
  }).length;
});

const calendarEvents = computed(() =>
  posts.value
    .filter((post) => post.status === "scheduled")
    .map((post) => ({
      id: post.id,
      title: post.title,
      start: post.scheduled_time,
      backgroundColor: "#dbeafe",
      borderColor: "#2563eb",
      extendedProps: { post },
    }))
);

let calendar = null;

function initCalendar() {
  if (calendar) {
    calendar.destroy();
  }
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin], // <-- أضف هنا
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: calendarEvents.value,
    eventClick: handleEventClick,
    height: "auto",
  });

  calendar.render();
}

function updateCalendarEvents() {
  if (calendar) {
    calendar.removeAllEvents();
    calendar.addEventSource(calendarEvents.value);
  }
}

function destroyCalendar() {
  if (calendar) {
    calendar.destroy();
    calendar = null;
  }
}

function handleEventClick(info) {
  const postId = info.event.id;
  window.location.href = `/posts/edit/${postId}`;
}

async function toggleCalendarView() {
  calendarView.value = !calendarView.value;

  if (calendarView.value) {
    statusFilter.value = "scheduled";
  } else {
    statusFilter.value = "";
  }

  await fetchPosts();

  if (calendarView.value) {
    initCalendar();
  } else {
    destroyCalendar();
  }
}
</script>

<template>
  <main>
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">Dashboard</h1>
      <RouterLink to="/posts/create" class="primary-btn w-1/2">
        + New Post
      </RouterLink>
    </div>

    <div
      v-if="message || errors.general"
      :class="[
        'p-3 rounded mb-4',
        errors.general
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700',
      ]"
    >
      <span
        class="float-right cursor-pointer font-bold"
        @click="
          () => {
            message = null;
            errors = {};
          }
        "
        >&times;</span
      >
      <div v-if="message">{{ message }}</div>
      <div v-if="errors.general">{{ errors.general[0] }}</div>
    </div>

    <!-- إحصائيات -->
    <div class="mb-4 flex gap-6">
      <div class="stat-box">
        <div class="stat-title">Scheduled Today</div>
        <div class="stat-value">{{ scheduledTodayCount }} / 10</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">Total Posts</div>
        <div class="stat-value">{{ posts.length }}</div>
      </div>
      <button class="btn-toggleView" @click="toggleCalendarView">
        {{ calendarView ? "List Posts" : "Calendar of Scheduled Posts" }}
      </button>
    </div>

    <!-- التقويم -->
    <div v-if="calendarView" class="mb-8">
      <div id="calendar"></div>
    </div>

    <!-- القائمة -->
    <div v-else>
      <div class="mb-4 flex gap-4">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        <input type="date" v-model="dateFilter" class="filter-select" />
      </div>

      <div v-if="posts.length > 0">
        <div
          v-for="post in posts"
          :key="post.id"
          class="border-l-4 border-blue-500 pl-4 mb-8 bg-white shadow rounded p-4"
        >
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-xl">{{ post.title }}</h2>
            <span
              :class="{
                'badge-draft': post.status === 'draft',
                'badge-scheduled': post.status === 'scheduled',
                'badge-published': post.status === 'published',
              }"
            >
              {{ post.status }}
            </span>
          </div>
          <div class="text-xs text-slate-600 mb-2">
            Scheduled:
            {{
              post.scheduled_time
                ? post.scheduled_time.slice(0, 16).replace("T", " ")
                : "N/A"
            }}
          </div>
          <div class="mb-2">
            <span
              v-for="platform in post.platforms"
              :key="platform.id"
              class="platform-chip"
            >
              {{ platform.name }}
            </span>
          </div>
          <p class="mb-2">{{ post.content }}</p>
          <div class="flex gap-2">
            <RouterLink
              :to="{ name: 'post_edit', params: { id: post.id } }"
              class="btn-edit"
            >
              Edit
            </RouterLink>
            <RouterLink
              :to="{ name: 'post_delete', params: { id: post.id } }"
              class="btn-delete"
            >
              Delete
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else>
        <h2 class="title">No posts found</h2>
      </div>
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
.btn-edit {
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: underline;
  color: #2563eb;
  background: #f1f5f9;
}
.btn-edit:hover {
  background: #dbeafe;
}
.btn-delete {
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-decoration: underline;
  color: #dc2626;
  background: #f1f5f9;
}
.btn-delete:hover {
  background: #dbeafe;
}
.btn-toggleView {
  background-color: #8b25eb;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  user-select: none;
  height: fit-content;
  align-self: center;
}

.btn-toggleView:hover {
  background-color: #7c21d9;
}

.btn-toggleView:focus {
  outline: 2px solid #8b25eb;
  outline-offset: 2px;
}
</style>
