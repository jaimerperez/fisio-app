import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
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

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.name !== 'login' && !authStore.isAuthenticated) {
    return '/login'
  }
})

export default router
