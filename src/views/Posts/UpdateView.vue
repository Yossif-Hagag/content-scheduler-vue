<script setup>
import { usePostsStore } from "@/stores/posts";
import { usePlatformsStore } from "@/stores/platforms";
import { storeToRefs } from "pinia";
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const postsStore = usePostsStore();
const platformsStore = usePlatformsStore();
const route = useRoute();
const router = useRouter();

const { message } = storeToRefs(postsStore);
const { errors } = storeToRefs(postsStore);

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

// تحميل جميع المنصات
onMounted(async () => {
  allPlatforms.value = await platformsStore.getAllPlatforms();

  // جلب بيانات المنشور المراد تعديله
  const postId = route.params.id;
  if (postId) {
    const post = await postsStore.getPost(postId);
    if (post) {
      formData.title = post.title || "";
      formData.content = post.content || "";
      formData.scheduled_time = post.scheduled_time || "";
      formData.status = post.status || "draft";
      formData.platforms = post.platforms ? post.platforms.map(p => p.id) : [];
      // لا نملأ image_url لأن الصورة قد تكون ملف جديد أو رابط
    } else {
      // إذا المنشور غير موجود توجه لصفحة أخرى أو عرض رسالة
      router.push("/posts");
    }
  }
});

const handleImage = (e) => {
  formData.image_url = e.target.files[0];
};

const submit = async () => {
  const postId = route.params.id;
  await postsStore.updatePost(postId, formData);
  // بعد التعديل يمكن التوجيه مثلاً لصفحة التفاصيل أو القائمة
  router.push("/posts");
};
</script>

<template>
  <main>
    <h1 class="title">Edit Post</h1>

    <div
      v-if="message || errors.general"
      :class="['alert', errors.general ? 'alert-error' : 'alert-success']"
    >
      <span
        style="float: right; cursor: pointer"
        @click="message && (message = null);
          errors.general && (errors.general = null);
        "
        >&times;</span
      >
      <span v-if="message">{{ message }}</span>
      <span v-if="errors.general">{{ errors.general[0] }}</span>
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
          @change="handleImage"
          class="input"
        />
        <p v-if="errors.image_url" class="error">{{ errors.image_url[0] }}</p>
      </div>
      <button class="primary-btn mb-12">Update</button>
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
