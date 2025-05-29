import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const usePostsStore = defineStore("postsStore", {
  state: () => ({
    errors: {},
    message: null,
  }),
  actions: {
    /******************* Get all posts *******************/
    async getAllPosts(params = {}) {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/posts${query ? "?" + query : ""}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
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

      const useFormData = formData.image_url instanceof File;

      if (useFormData) {
        body = new FormData();
        body.append("title", formData.title ?? "");
        body.append("content", formData.content ?? "");
        body.append("scheduled_time", formData.scheduled_time ?? "");
        body.append("status", formData.status ?? "draft");
        if (Array.isArray(formData.platforms)) {
          formData.platforms.forEach((val) => body.append("platforms[]", val));
        }
        if (formData.image_url instanceof File) {
          body.append("image_url", formData.image_url);
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

      const res = await fetch("/api/posts", {
        method: "POST",
        headers,
        body,
      });

      const data = await res.json();

      if (res.status === 422) {
        this.errors = data.errors || { general: [data.message] };
        this.message = null;
      } else if (res.ok) {
        this.errors = {};
        this.message = data.message || "Post created successfully.";
        return data.data;
      } else {
        this.errors = { general: [data.message || "Failed to create post."] };
      }
    },
    /******************* Delete a post *******************/
    async deletePost(post) {
      const authStore = useAuthStore();
      if (authStore.user.id && post) {
        const res = await fetch(`/api/posts/${post}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          this.errors = {};
          this.message = data.message || "Post deleted successfully.";
        } else {
          this.errors = { general: [data.message] };
        }
      }
    },
    /******************* Update a post *******************/
    async updatePost(post, formData) {
      this.errors = {};
      const authStore = useAuthStore();
      if (authStore.user.id && post) {
        let body, headers;
        let method = "PUT";

        if (formData.image_url instanceof File) {
          body = new FormData();
          body.append("_method", "PUT");

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

          method = "POST";
        } else {
          body = JSON.stringify(formData);
          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
        }

        const res = await fetch(`/api/posts/${post}`, {
          method,
          headers,
          body,
        });

        const data = await res.json();
        if (res.status === 422) {
          this.errors = { general: [data.message] };
        } else if (res.ok) {
          this.errors = {};
          this.message = data.message || "Post updated successfully.";
          return data.data;
        }
      }
    },
  },
});
