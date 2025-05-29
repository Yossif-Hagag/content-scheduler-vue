import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const usePostsStore = defineStore("postsStore", {
  state: () => ({
    errors: {},
  }),
  actions: {
    /******************* Get all posts *******************/
    async getAllPosts(params = {}) {
      // دعم الفلاتر: status, date
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/posts${query ? "?" + query : ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      // data.data هو مصفوفة المنشورات مع platforms
      return data.data || [];
    },

    /******************* Get a post *******************/
    async getPost(postId) {
      const res = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      return data.data; // post مع platforms
    },

    /******************* Create a post *******************/
    async createPost(formData) {
      this.errors = {};
      let body, headers;

      // استخدم FormData إذا كان هناك صورة أو منصات
      const useFormData =
        formData.image_url instanceof File ||
        (Array.isArray(formData.platforms) && formData.platforms.length > 0);

      if (useFormData) {
        body = new FormData();
        for (const key in formData) {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((val) => body.append(`${key}[]`, val));
          } else {
            // أضف الحقل حتى لو كان فارغاً (لأن Laravel يتوقع وجوده)
            body.append(key, formData[key] ?? "");
          }
        }
        headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // لا تضع Content-Type مع FormData
        };
      } else {
        body = JSON.stringify(formData);
        headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (res.status === 422) {
        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.errors = { general: [data.message] };
        }
      } else if (res.ok) {
        this.errors = {};
        return data.data;
      } else {
        this.errors = { general: [data.message || "Failed to create post."] };
      }
    },

    /******************* Delete a post *******************/
    async deletePost(post) {
      const authStore = useAuthStore();
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          this.errors = {};
        } else {
          this.errors = { general: [data.message] };
        }
      }
    },

    /******************* Update a post *******************/
    async updatePost(post, formData) {
      this.errors = {};
      const authStore = useAuthStore();
      if (authStore.user.id === post.user_id) {
        let body, headers;
        if (formData.image_url instanceof File) {
          body = new FormData();
          for (const key in formData) {
            if (Array.isArray(formData[key])) {
              formData[key].forEach((val) => body.append(`${key}[]`, val));
            } else {
              body.append(key, formData[key]);
            }
          }
          headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
        } else {
          body = JSON.stringify(formData);
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
        }

        const res = await fetch(`/api/posts/${post.id}`, {
          method: "PUT",
          headers,
          body,
        });

        const data = await res.json();
        if (res.status === 422) {
          this.errors = { general: [data.message] };
        } else if (res.ok) {
          this.errors = {};
          return data.data;
        }
      }
    },
  },
});
