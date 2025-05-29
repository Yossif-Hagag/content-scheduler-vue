<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";

const { message } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

onMounted(() => (errors.value = {}));
</script>

<template>
  <main>
    <h1 class="title">Login to your account</h1>

    <div
      v-if="message"
      :class="['alert', errors.general ? 'alert-error' : 'alert-success']"
    >
      <span style="float: right; cursor: pointer" @click="message = null"
        >&times;</span
      >
      {{ message }}
    </div>

    <form
      @submit.prevent="authenticate('login', formData)"
      class="w-1/2 mx-auto space-y-6"
    >
      <div>
        <input type="text" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="formData.password"
        />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>

      <button class="primary-btn">Login</button>
    </form>
  </main>
</template>

