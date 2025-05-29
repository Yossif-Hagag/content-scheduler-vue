<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { usePostsStore } from "@/stores/posts";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

onMounted(async () => {
  const id = route.params.id;

  const confirmed = confirm("Are you sure you want to delete this post?");
  if (confirmed) {
    await postsStore.deletePost(id);
  }

  router.push("/dashboard");
});
</script>

<template>
  <main class="p-4 text-center text-slate-600">
    <p>Deleting post...</p>
  </main>
</template>
