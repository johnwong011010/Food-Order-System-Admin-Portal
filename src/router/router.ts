import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/food-items',
    name: 'food-items',
    component: () => import('../views/FoodItem.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: './dashboard' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router