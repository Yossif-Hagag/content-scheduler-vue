<script setup>
import { usePostsStore } from "@/stores/posts";
import { usePlatformsStore } from "@/stores/platforms";
import { storeToRefs } from "pinia";
import { reactive, ref, computed, onMounted, toRaw } from "vue";

const postsStore = usePostsStore();
const platformsStore = usePlatformsStore();
const { message, errors } = storeToRefs(postsStore);

const formData = reactive({
  title: "",
  content: "",
  image_url: null,
  scheduled_time: "",
  status: "draft",
  platforms: [],
});

const charCount = computed(() => formData.content.length);

const allPlatforms = ref([]);
onMounted(async () => {
  allPlatforms.value = await platformsStore.getActivePlatforms();
});

const handleImage = (e) => {
  formData.image_url = e.target.files[0];
};

const submit = async () => {
  await postsStore.createPost(toRaw(formData));
};
</script>

<template>
  <main>
    <h1 class="title">Create a new post</h1>

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

    <form @submit.prevent="submit" class="post-form">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <textarea
          rows="6"
          placeholder="Post Content"
          v-model="formData.content"
        ></textarea>
        <div class="flex justify-between items-center">
          <span class="text-xs text-slate-500"
            >Characters: {{ charCount }}</span
          >
          <p v-if="errors.content" class="error">{{ errors.content[0] }}</p>
        </div>
      </div>
      <div>
        <label>Platforms</label>
        <select v-model="formData.platforms" multiple class="input">
          <option v-for="p in allPlatforms" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
        <p v-if="errors.platforms" class="error">{{ errors.platforms[0] }}</p>
      </div>
      <div>
        <label>Scheduled Time</label>
        <input
          type="datetime-local"
          v-model="formData.scheduled_time"
          class="input"
        />
        <p v-if="errors.scheduled_time" class="error">
          {{ errors.scheduled_time[0] }}
        </p>
      </div>
      <div>
        <label>Status</label>
        <select v-model="formData.status" class="input">
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
        <p v-if="errors.status" class="error">{{ errors.status[0] }}</p>
      </div>
      <div>
        <label>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          @change="(e) => (formData.image_url = e.target.files[0])"
          class="input"
        />
        <p v-if="errors.image_url" class="error">{{ errors.image_url[0] }}</p>
      </div>
      <button class="primary-btn mb-12">Create</button>
    </form>
  </main>
</template>

<style scoped>
.post-form {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  margin-top: 4px;
}
.error {
  color: #b91c1c;
  font-size: 0.95em;
}
</style>
