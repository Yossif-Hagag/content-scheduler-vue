<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";

const { message } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

onMounted(() => (errors.value = {}));
</script>

<template>
  <main>
    <h1 class="title">Register a new account</h1>

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
      <!-- <div v-if="errors.general">{{ errors.general[0] }}</div> -->
    </div>

    <form
      @submit.prevent="authenticate('register', formData)"
      class="w-1/2 mx-auto space-y-6"
    >
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" />
        <p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
      </div>

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

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="formData.password_confirmation"
        />
      </div>

      <button class="primary-btn">Register</button>
    </form>
  </main>
</template>
