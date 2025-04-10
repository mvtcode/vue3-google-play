import { createRouter, createWebHistory } from 'vue-router'
import Mp3Play from '../views/Mp3Play.vue'
import PdfView from '../views/PdfView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mp3',
      component: Mp3Play,
    },
    {
      path: '/pdf',
      name: 'pdf',
      component: PdfView,
    },
  ],
})

export default router
