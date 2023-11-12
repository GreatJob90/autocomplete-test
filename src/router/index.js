import {
    createRouter,
    createWebHistory,
    createMemoryHistory
} from "vue-router";

const baseUrl = import.meta.env.BASE_URL;
const history = import.meta.env.SSR
    ? createMemoryHistory(baseUrl)
    : createWebHistory(baseUrl);
const router = createRouter({
  history,
  routes: [
    {
      path: "/",
      name: "home",
        component: () => import("../views/DefaultView.vue")
    }
  ]
});

export default router;
