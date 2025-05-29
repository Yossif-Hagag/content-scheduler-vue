import { defineStore } from "pinia";

export const usePlatformsStore = defineStore("platformsStore", {
  state: () => ({
    platforms: [],
    activePlatforms: [],
    errors: {},
    message: null,
  }),
  actions: {
    // جلب جميع المنصات المتاحة
    async getAllPlatforms() {
      const res = await fetch("/api/platforms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      this.platforms = data.data || [];
      return this.platforms;
    },

    // جلب المنصات النشطة للمستخدم
    async getActivePlatforms() {
      const res = await fetch("/api/platforms/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      this.activePlatforms = data.data || [];
      return this.activePlatforms;
    },

    // تفعيل أو تعطيل منصة للمستخدم
    async toggleActivePlatform(platform_id, action) {
      this.errors = {};
      this.message = null;
      const res = await fetch("/api/platforms/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ platform_id, action }),
      });
      const data = await res.json();
      if (res.ok) {
        this.message = data.message || "Platform status updated.";
        // تحديث المنصات النشطة بعد التغيير
        this.activePlatforms = data.data || [];
      } else {
        this.errors = { general: [data.message || "Failed to update platform status."] };
      }
    },
  },
});