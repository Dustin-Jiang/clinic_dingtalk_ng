import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/new',
      name: 'new',
      component: () => import('@/views/NewRecordView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryAppointmentsView.vue')
    },
    {
      path: '/announcement/:id',
      name: 'announcement',
      props: true,
      component: () => import('@/views/AnnouncementView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit-record',
      props: true,
      component: () => import('@/views/EditRecordView.vue')
    }
  ]
})

export default router
