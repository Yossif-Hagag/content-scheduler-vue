import { defineStore } from "pinia";

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({
    data: null,
  }),
  actions: {
    async fetchPostAnalytics() {
      try {
        const res = await fetch("/api/analytics/posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await res.json();
        this.data = result.data;
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    },
  },
});
