<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0 bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-5">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-0.5">Resumen general de tu clínica</p>
    </header>

    <div class="p-6 mx-auto space-y-6">

      <!-- Stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink to="/patients" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg class="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-500">Pacientes</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ patientsStore.total }}</p>
        </RouterLink>

        <RouterLink to="/agenda" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <svg class="w-5 h-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-500">Citas Hoy</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ todayCount }}</p>
        </RouterLink>

        <RouterLink to="/sessions" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <svg class="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-500">Sesiones Total</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ sessionsStore.total }}</p>
        </RouterLink>

        <RouterLink to="/agenda" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-red-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-500">Citas Pendientes</span>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ pendingCount }}</p>
        </RouterLink>
      </div>

      <!-- Bottom panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Próximas Citas -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="font-semibold text-gray-900 mb-4">Próximas Citas</h2>
          <div v-if="upcomingAppointments.length === 0" class="text-sm text-gray-400 py-4 text-center">
            No hay citas próximas
          </div>
          <ul v-else class="space-y-3">
            <li v-for="apt in upcomingAppointments" :key="apt.id"
              class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-xs font-bold leading-tight"
                :class="statusBg(apt.status)">
                <span>{{ apt.time }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ patientName(apt.patientId) }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(apt.date) }} · {{ apt.duration }} min</p>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="statusPill(apt.status)">
                {{ statusLabel(apt.status) }}
              </span>
            </li>
          </ul>
          <RouterLink to="/agenda" class="mt-4 flex items-center gap-1 text-xs text-primary-600 hover:underline font-medium">
            Ver agenda
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </RouterLink>
        </div>

        <!-- Últimos Pacientes -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="font-semibold text-gray-900 mb-4">Últimos Pacientes</h2>
          <div v-if="recentPatients.length === 0" class="text-sm text-gray-400 py-4 text-center">
            No hay pacientes registrados
          </div>
          <ul v-else class="space-y-3">
            <li v-for="p in recentPatients" :key="p.id" class="flex items-center gap-3">
              <RouterLink :to="`/patients/${p.id}`" class="flex items-center gap-3 flex-1 min-w-0 group">
                <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                  {{ p.name[0] }}{{ p.lastName[0] }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 group-hover:text-primary-600 truncate">{{ p.name }} {{ p.lastName }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ p.phone || p.email || 'Sin contacto' }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
              </RouterLink>
            </li>
          </ul>
          <RouterLink to="/patients" class="mt-4 flex items-center gap-1 text-xs text-primary-600 hover:underline font-medium">
            Ver todos
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useSessionsStore } from '@/stores/sessions'

const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const sessionsStore = useSessionsStore()

const today = new Date().toISOString().slice(0, 10)

const todayCount = computed(() =>
  appointmentsStore.appointments.filter(a => a.date === today).length
)

const pendingCount = computed(() =>
  appointmentsStore.appointments.filter(a => a.status === 'pending').length
)

const upcomingAppointments = computed(() =>
  appointmentsStore.appointments
    .filter(a => a.date >= today && a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)
)

const recentPatients = computed(() =>
  [...patientsStore.patients]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
)

function patientName(id: string) {
  const p = patientsStore.getById(id)
  return p ? `${p.name} ${p.lastName}` : 'Desconocido'
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

function statusLabel(status: string) {
  return { pending: 'Pendiente', confirmed: 'Confirmada', completed: 'Completada', cancelled: 'Cancelada' }[status] ?? status
}

function statusBg(status: string) {
  return {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-primary-50 text-primary-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-100 text-gray-400',
  }[status] ?? 'bg-gray-100 text-gray-500'
}

function statusPill(status: string) {
  return {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-primary-50 text-primary-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-100 text-gray-400',
  }[status] ?? 'bg-gray-100 text-gray-500'
}
</script>
