import { defineStore } from "pinia";
import router from "@/router";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: null,
    errors: {},
    message: null,
  }),

  actions: {
    /******************* Get authenticated user *******************/
    async getUser() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          if (data.data && data.data.id) {
            this.user = data.data;
          } else if (data.user && data.user.id) {
            this.user = data.user;
          } else {
            this.user = data;
          }
        }
      }
    },
    /******************* Update user profile *******************/
    async updateProfile(form) {
      this.errors = {};
      this.message = null;
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.status === 422) {
        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.errors = { general: [data.message] };
        }
      } else if (res.ok) {
        this.message = data.message || "Profile updated successfully.";
        this.user = data.data;
      } else {
        this.errors = { general: [data.message || "Update failed."] };
      }
    },

    /******************* Login or Register user *******************/
    async authenticate(apiRoute, formData) {
      this.errors = {};
      this.message = null; // Reset message before new request

      const res = await fetch(`/api/${apiRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 422 && data.errors) {
        this.errors = data.errors;
        this.message = data.message || "Validation error.";
      } else if (res.ok && data.data && data.data.token) {
        localStorage.setItem("token", data.data.token);
        this.user = data.data.user;
        this.message = data.message || "Login successful.";
        router.push({ name: "dashboard" });
      } else {
        this.errors = { general: ["An error occurred. Please try again."] };
        this.message = data.message || "An error occurred. Please try again.";
      }
    },

    /******************* Logout user *******************/
    async logout() {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        router.push({ name: "home" });
      }
    },
  },
});
