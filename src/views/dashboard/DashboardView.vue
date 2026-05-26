<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0 bg-slate-50">
    <header class="bg-white border-b border-slate-100 px-6 py-5 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Dashboard</h1>
      <p class="text-sm text-slate-400 mt-0.5">Resumen general de tu clínica</p>
    </header>

    <div class="p-6 mx-auto space-y-6">

      <!-- Stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink to="/patients"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-t-2xl"></div>
          <div class="flex items-center gap-3 mb-3 mt-1">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Pacientes</span>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ patientsStore.total }}</p>
        </RouterLink>

        <RouterLink to="/agenda"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-2xl"></div>
          <div class="flex items-center gap-3 mb-3 mt-1">
            <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Citas hoy</span>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ todayCount }}</p>
        </RouterLink>

        <RouterLink to="/sessions"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 to-indigo-500 rounded-t-2xl"></div>
          <div class="flex items-center gap-3 mb-3 mt-1">
            <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sesiones</span>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ sessionsStore.total }}</p>
        </RouterLink>

        <RouterLink to="/agenda"
          class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-t-2xl"></div>
          <div class="flex items-center gap-3 mb-3 mt-1">
            <div class="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Pendientes</span>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ pendingCount }}</p>
        </RouterLink>
      </div>

      <!-- Recordatorios de mañana -->
      <div v-if="tomorrowAppointments.length > 0" class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.999 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.626 0 12 0zm0 21.75a9.721 9.721 0 0 1-4.964-1.36l-.357-.212-3.697.993.997-3.62-.232-.372A9.72 9.72 0 0 1 2.25 12c0-5.376 4.374-9.75 9.75-9.75s9.75 4.374 9.75 9.75-4.374 9.75-9.75 9.75z"/>
              </svg>
            </div>
            <div>
              <h2 class="font-semibold text-slate-900 leading-tight">Recordatorios de mañana</h2>
              <p class="text-xs text-slate-400">{{ tomorrowAppointments.length }} cita{{ tomorrowAppointments.length !== 1 ? 's' : '' }} · {{ sentCount }} enviado{{ sentCount !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button v-if="pendingSendCount > 0" @click="sendAll"
            class="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl font-medium transition-colors">
            Enviar todos
          </button>
        </div>

        <ul class="space-y-2">
          <li v-for="apt in tomorrowAppointments" :key="apt.id"
            class="flex items-center gap-3 p-2.5 rounded-xl"
            :class="sentReminders.has(apt.id) ? 'bg-green-50' : 'bg-slate-50'">
            <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center text-xs font-bold text-slate-700 shrink-0 shadow-sm">
              {{ apt.time }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ patientName(apt.patientId) }}</p>
              <p class="text-xs text-slate-400">{{ apt.duration }} min · {{ patientPhone(apt.patientId) || 'Sin teléfono' }}</p>
            </div>
            <div class="shrink-0">
              <button v-if="sentReminders.has(apt.id)"
                @click="sendReminder(apt)"
                class="flex items-center gap-1 text-xs text-green-600 font-medium px-2.5 py-1 bg-green-100 hover:bg-green-200 rounded-full transition-colors">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Enviado
              </button>
              <button v-else-if="patientPhone(apt.patientId)"
                @click="sendReminder(apt)"
                class="flex items-center gap-1.5 text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl font-medium transition-colors">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.999 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.626 0 12 0zm0 21.75a9.721 9.721 0 0 1-4.964-1.36l-.357-.212-3.697.993.997-3.62-.232-.372A9.72 9.72 0 0 1 2.25 12c0-5.376 4.374-9.75 9.75-9.75s9.75 4.374 9.75 9.75-4.374 9.75-9.75 9.75z"/>
                </svg>
                Enviar
              </button>
              <span v-else class="text-xs text-slate-300 px-2">Sin tel.</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Bottom panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Próximas Citas -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-900">Próximas Citas</h2>
            <RouterLink to="/agenda" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Ver agenda
              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
            </RouterLink>
          </div>
          <div v-if="upcomingAppointments.length === 0" class="text-sm text-slate-400 py-6 text-center">
            No hay citas próximas
          </div>
          <ul v-else class="space-y-2.5">
            <li v-for="apt in upcomingAppointments" :key="apt.id"
              class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <div class="w-10 h-10 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-xs font-bold leading-tight"
                :class="statusBg(apt.status)">
                <span>{{ apt.time }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ patientName(apt.patientId) }}</p>
                <p class="text-xs text-slate-400">{{ formatDate(apt.date) }} · {{ apt.duration }} min</p>
              </div>
              <span class="text-xs px-2.5 py-1 rounded-full font-medium shrink-0" :class="statusPill(apt.status)">
                {{ statusLabel(apt.status) }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Últimos Pacientes -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-900">Últimos Pacientes</h2>
            <RouterLink to="/patients" class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Ver todos
              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
            </RouterLink>
          </div>
          <div v-if="recentPatients.length === 0" class="text-sm text-slate-400 py-6 text-center">
            No hay pacientes registrados
          </div>
          <ul v-else class="space-y-1">
            <li v-for="p in recentPatients" :key="p.id">
              <RouterLink :to="`/patients/${p.id}`" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                <div class="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                  {{ p.name[0] }}{{ p.lastName[0] }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900 group-hover:text-primary-600 truncate transition-colors">{{ p.name }} {{ p.lastName }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ p.phone || p.email || 'Sin contacto' }}</p>
                </div>
                <svg class="w-4 h-4 text-slate-300 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
              </RouterLink>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useSessionsStore } from '@/stores/sessions'

const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()
const sessionsStore = useSessionsStore()

const today = new Date().toISOString().slice(0, 10)
const tomorrowDate = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) })()
const SENT_KEY = `fisioapp_reminders_${tomorrowDate}`
const sentReminders = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem(SENT_KEY) || '[]')))

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

const tomorrowAppointments = computed(() =>
  appointmentsStore.appointments
    .filter(a => a.date === tomorrowDate && a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => a.time.localeCompare(b.time))
)

const sentCount = computed(() => tomorrowAppointments.value.filter(a => sentReminders.value.has(a.id)).length)
const pendingSendCount = computed(() => tomorrowAppointments.value.filter(a => !sentReminders.value.has(a.id) && patientPhone(a.patientId)).length)

function patientName(id: string) {
  const p = patientsStore.getById(id)
  return p ? `${p.name} ${p.lastName}` : 'Desconocido'
}

function patientPhone(id: string) {
  return patientsStore.getById(id)?.phone ?? ''
}

function markSent(aptId: string) {
  sentReminders.value = new Set([...sentReminders.value, aptId])
  localStorage.setItem(SENT_KEY, JSON.stringify([...sentReminders.value]))
}

function sendReminder(apt: typeof tomorrowAppointments.value[number]) {
  const patient = patientsStore.getById(apt.patientId)
  if (!patient?.phone) return
  const message = `Hola ${patient.name}, te recordamos que mañana tienes cita a las ${apt.time}h. ¡Hasta mañana!`
  const phone = patient.phone.replace(/[\s\-().]/g, '')
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  markSent(apt.id)
}

async function sendAll() {
  const pending = tomorrowAppointments.value.filter(a => !sentReminders.value.has(a.id) && patientPhone(a.patientId))
  for (const apt of pending) {
    sendReminder(apt)
    await new Promise(r => setTimeout(r, 600))
  }
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
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-slate-100 text-slate-400',
  }[status] ?? 'bg-slate-100 text-slate-500'
}

function statusPill(status: string) {
  return {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-primary-50 text-primary-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-slate-100 text-slate-400',
  }[status] ?? 'bg-slate-100 text-slate-500'
}
</script>
