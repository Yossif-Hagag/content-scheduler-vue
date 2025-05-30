import { defineStore } from "pinia";

export const useLogsStore = defineStore("logs", {
  state: () => ({
    logs: [],
  }),
  actions: {
    async fetchLogs() {
      const res = await fetch("/api/logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      this.logs = data;
    },
  },
});
