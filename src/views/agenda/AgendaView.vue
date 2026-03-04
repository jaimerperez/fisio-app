<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button @click="prevDay" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        </button>
        <div>
          <p class="text-sm text-gray-500">{{ dayOfWeek }}</p>
          <h1 class="text-lg font-bold text-gray-900">{{ formattedDate }}</h1>
        </div>
        <button @click="nextDay" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
        </button>
        <button @click="goToday" class="ml-1 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">
          Hoy
        </button>
      </div>
      <button @click="showForm = true"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 active:scale-95 transition-all shadow-sm">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Nueva cita
      </button>
    </header>

    <!-- Appointments list -->
    <div class="p-4 space-y-3 max-w-2xl mx-auto">
      <div v-if="todayAppointments.length === 0" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"/></svg>
        <p class="font-medium">Sin citas este día</p>
      </div>

      <div v-for="apt in todayAppointments" :key="apt.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
        <div class="text-center min-w-[56px]">
          <p class="text-lg font-bold text-primary-600">{{ apt.time }}</p>
          <p class="text-xs text-gray-400">{{ apt.duration }}min</p>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">{{ patientName(apt.patientId) }}</p>
          <p v-if="apt.notes" class="text-sm text-gray-500 mt-0.5">{{ apt.notes }}</p>
          <span :class="statusClass(apt.status)" class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium">
            {{ statusLabel(apt.status) }}
          </span>
        </div>
        <div class="flex gap-2">
          <button @click="changeStatus(apt)" class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          </button>
          <button @click="deleteApt(apt.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- New appointment modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <h2 class="text-lg font-bold text-gray-900">Nueva cita</h2>

        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">Paciente</label>
            <select v-model="form.patientId" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Seleccionar paciente...</option>
              <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} {{ p.lastName }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Hora</label>
              <input v-model="form.time" type="time" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Duración (min)</label>
              <input v-model.number="form.duration" type="number" min="15" step="15" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Notas</label>
            <textarea v-model="form.notes" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
        </div>

        <div class="flex gap-3 pt-1">
          <button @click="showForm = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button @click="saveAppointment" :disabled="!form.patientId || !form.time"
            class="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import type { Appointment } from '@/types'

const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()

const selectedDate = ref(new Date())
const showForm = ref(false)

const form = reactive({
  patientId: '',
  time: '09:00',
  duration: 45,
  notes: '',
})

const patients = computed(() => patientsStore.patients)

const dateKey = computed(() => selectedDate.value.toISOString().slice(0, 10))

const todayAppointments = computed(() => appointmentsStore.byDate(dateKey.value))

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

const dayOfWeek = computed(() => days[selectedDate.value.getDay()])
const formattedDate = computed(() => `${selectedDate.value.getDate()} de ${months[selectedDate.value.getMonth()]} ${selectedDate.value.getFullYear()}`)

function prevDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d
}
function nextDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d
}
function goToday() {
  selectedDate.value = new Date()
}

function patientName(id: string) {
  const p = patientsStore.getById(id)
  return p ? `${p.name} ${p.lastName}` : 'Paciente desconocido'
}

const statusColors: Record<Appointment['status'], string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}
const statusLabels: Record<Appointment['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

function statusClass(s: Appointment['status']) { return statusColors[s] }
function statusLabel(s: Appointment['status']) { return statusLabels[s] }

function changeStatus(apt: Appointment) {
  const cycle: Appointment['status'][] = ['pending', 'confirmed', 'completed', 'cancelled']
  const next = cycle[(cycle.indexOf(apt.status) + 1) % cycle.length]
  appointmentsStore.update(apt.id, { status: next })
}

function deleteApt(id: string) {
  if (confirm('¿Eliminar esta cita?')) appointmentsStore.remove(id)
}

function saveAppointment() {
  appointmentsStore.add({
    patientId: form.patientId,
    date: dateKey.value,
    time: form.time,
    duration: form.duration,
    notes: form.notes,
    status: 'confirmed',
  })
  showForm.value = false
  Object.assign(form, { patientId: '', time: '09:00', duration: 45, notes: '' })
}
</script>
