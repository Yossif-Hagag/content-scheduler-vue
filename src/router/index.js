import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DashboardView from "@/views/DashboardView.vue";
import RegisterView from "../views/Auth/RegisterView.vue";
import LoginView from "../views/Auth/LoginView.vue";
import PostCreateView from "@/views/Posts/CreateView.vue";
import PostUpdateView from "@/views/Posts/UpdateView.vue";
import PostDeleteView from "@/views/Posts/DeleteView.vue";
import ShowView from "@/views/Posts/ShowView.vue";
import UpdateView from "@/views/Posts/UpdateView.vue";
import ProfileView from "@/views/Auth/ProfileView.vue";
import Settings from "@/views/Settings.vue";
import LogsPanel from "@/views/LogsPanel.vue";
import PostAnalytics from "@/views/PostAnalytics.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { auth: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { auth: true },
    },
    {
      path: "/posts/create",
      name: "post_create",
      component: PostCreateView,
      meta: { auth: true },
    },
    {
      path: "/posts/edit/:id",
      name: "post_edit",
      component: PostUpdateView,
      meta: { auth: true },
    },
    {
      path: "/posts/delete/:id",
      name: "post_delete",
      component: PostDeleteView,
      meta: { auth: true },
    },
    {
      path: "/posts/:id",
      name: "show",
      component: ShowView,
    },
    {
      path: "/posts/update/:id",
      name: "update",
      component: UpdateView,
      meta: { auth: true },
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings,
      meta: { auth: true },
    },
    {
      path: "/logs",
      name: "logs",
      component: LogsPanel,
      meta: { auth: true },
    },
    {
      path: "/analytics/posts",
      name: "post_analytics",
      component: PostAnalytics,
      meta: { auth: true },
    },
  ],
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.user && to.meta.guest) {
    return { name: "home" };
  }

  if (!authStore.user && to.meta.auth) {
    return { name: "login" };
  }
});

export default router;
