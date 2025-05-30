<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";

const authStore = useAuthStore();
const { user, errors, message } = storeToRefs(authStore);

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const loading = ref(false);

onMounted(() => {
  if (!user.value) {
    authStore.getUser().then(() => {
      if (user.value) {
        form.name = user.value.name;
        form.email = user.value.email;
      }
    });
  } else {
    form.name = user.value.name;
    form.email = user.value.email;
  }
});

const updateProfile = async () => {
  loading.value = true;
  await authStore.updateProfile(form);
  loading.value = false;
};
</script>

<template>
  <main>
    <h1 class="title">Profile</h1>

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

    
    <div class="profile-box">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label>Name</label>
          <input v-model="form.name" type="text" class="input" />
          <p v-if="errors?.name" class="error">{{ errors.name[0] }}</p>
        </div>
        <div>
          <label>Email</label>
          <input v-model="form.email" type="email" class="input" />
          <p v-if="errors?.email" class="error">{{ errors.email[0] }}</p>
        </div>
        <div>
          <label>New Password</label>
          <input
            v-model="form.password"
            type="password"
            class="input"
            autocomplete="new-password"
          />
          <p v-if="errors?.password" class="error">{{ errors.password[0] }}</p>
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            class="input"
            autocomplete="new-password"
          />
        </div>
        <button class="primary-btn" :disabled="loading">
          {{ loading ? "Saving..." : "Update Profile" }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.profile-box {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  margin: 24px auto;
  font-size: 1.1rem;
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
.alert-success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #22c55e;
  padding: 8px;
  border-radius: 6px;
}
</style>
