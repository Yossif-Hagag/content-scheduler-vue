import { defineStore } from "pinia";

export const usePlatformsStore = defineStore("platformsStore", {
  state: () => ({
    platforms: [],
    activePlatforms: [],
    errors: {},
    message: null,
  }),

  actions: {
    async getAllPlatforms() {
      this.errors = {};
      try {
        const res = await fetch("/api/platforms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.platforms = data.data || [];
        } else {
          this.errors = { general: [data.message || "فشل في جلب المنصات."] };
        }
      } catch (err) {
        this.errors = { general: [err.message || "خطأ غير متوقع."] };
      }
    },

    async getActivePlatforms() {
      this.errors = {};
      try {
        const res = await fetch("/api/user/active-platforms", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.activePlatforms = data.data || [];
        } else {
          this.errors = { general: [data.message || "فشل في جلب المنصات النشطة."] };
        }
      } catch (err) {
        this.errors = { general: [err.message || "خطأ غير متوقع."] };
      }

      return this.activePlatforms;
    },

    async toggleActivePlatform(platform_id, action) {
      this.errors = {};
      this.message = null;
      try {
        const res = await fetch("/api/user/platform/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ platform_id, action }),
        });
        const data = await res.json();

        if (res.ok) {
          this.message = data.message || "Platform status updated successfully.";
          this.activePlatforms = Object.entries(data.data || {}).map(([name, id]) => ({
            id,
            name,
          }));
        } else {
          this.errors = { general: [data.message || "Failed to update platform status."] };
        }
      } catch (err) {
        this.errors = { general: [err.message || "An error occurred while connecting to the server."] };
      }
    },
  },
});
