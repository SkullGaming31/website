import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/streams',
      name: 'streams',
      component: () => import('../views/StreamsView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/clips',
      name: "clips",
      component: () => import('../views/ClipsView.vue')
    },
    {
      path: '/schedule',
      name: "schedule",
      component: () => import('../views/ScheduleView.vue')
    },
    {
      path: '/faq',
      name: "faq",
      component: () => import('../views/FaqView.vue')
    }
  ]
})

export default router
