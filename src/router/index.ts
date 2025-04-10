import { createRouter, createWebHistory } from 'vue-router'
import Mp3Play from '../views/Mp3Play.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mp3',
      name: 'mp3',
      component: Mp3Play,
    },
  ],
})

export default router
