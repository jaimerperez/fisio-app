import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/agenda',
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: () => import('@/views/agenda/AgendaView.vue'),
    },
    {
      path: '/patients',
      name: 'patients',
      component: () => import('@/views/patients/PatientsView.vue'),
    },
    {
      path: '/patients/:id',
      name: 'patient-detail',
      component: () => import('@/views/patients/PatientDetailView.vue'),
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: () => import('@/views/sessions/SessionsView.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/reports/ReportsView.vue'),
    },
  ],
})

export default router
