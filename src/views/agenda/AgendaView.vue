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
        <button @click="goToday" class="ml-1 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100">Hoy</button>
      </div>
      <BaseButton @click="showForm = true" class="shadow-sm">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Nueva cita
      </BaseButton>
    </header>

    <!-- Appointments list -->
    <div class="p-4 space-y-3 max-w-2xl mx-auto">
      <div v-if="todayAppointments.length === 0" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5"/></svg>
        <p class="font-medium">Sin citas este día</p>
      </div>

      <div v-for="apt in todayAppointments" :key="apt.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4 cursor-pointer hover:border-primary-200 hover:shadow-md transition-all"
        @click="openDetail(apt)">
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
        <div class="flex gap-2" @click.stop>
          <IconButton @click="changeStatus(apt)">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          </IconButton>
          <IconButton variant="danger" @click="deleteApt(apt.id)">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          </IconButton>
        </div>
      </div>
    </div>

    <!-- Full-screen appointment detail -->
    <div v-if="selectedApt" class="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      <!-- Detail header -->
      <header class="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <button @click="selectedApt = null" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        </button>
        <div class="flex-1">
          <p class="text-xs text-gray-400">{{ formattedDate }}</p>
          <h2 class="text-base font-bold text-gray-900 leading-tight">{{ patientName(selectedApt.patientId) }}</h2>
        </div>
        <span :class="statusClass(selectedApt.status)" class="text-xs px-2.5 py-1 rounded-full font-medium">{{ statusLabel(selectedApt.status) }}</span>
      </header>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Appointment info -->
        <section class="bg-primary-50 rounded-2xl p-4 flex gap-6">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary-600">{{ selectedApt.time }}</p>
            <p class="text-xs text-primary-400">hora</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-primary-600">{{ selectedApt.duration }}</p>
            <p class="text-xs text-primary-400">minutos</p>
          </div>
          <div v-if="selectedApt.notes" class="flex-1">
            <p class="text-xs text-primary-400 mb-0.5">Notas de la cita</p>
            <p class="text-sm text-primary-800">{{ selectedApt.notes }}</p>
          </div>
        </section>

        <!-- Patient info -->
        <template v-if="selectedPatient">
          <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Datos del paciente</h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-if="selectedPatient.phone">
                <p class="text-xs text-gray-400">Teléfono</p>
                <a :href="'tel:' + selectedPatient.phone" class="text-sm font-medium text-primary-600">{{ selectedPatient.phone }}</a>
              </div>
              <div v-if="selectedPatient.email">
                <p class="text-xs text-gray-400">Email</p>
                <p class="text-sm font-medium text-gray-800 truncate">{{ selectedPatient.email }}</p>
              </div>
              <div v-if="selectedPatient.dni">
                <p class="text-xs text-gray-400">DNI</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedPatient.dni }}</p>
              </div>
              <div v-if="selectedPatient.birthDate">
                <p class="text-xs text-gray-400">Fecha de nacimiento</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedPatient.birthDate }}</p>
              </div>
            </div>
          </section>

          <section v-if="selectedPatient.pathologies" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Patologías</h3>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedPatient.pathologies }}</p>
          </section>

          <section v-if="selectedPatient.medicalHistory" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Historial médico</h3>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedPatient.medicalHistory }}</p>
          </section>

          <section v-if="selectedPatient.observations" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Observaciones</h3>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ selectedPatient.observations }}</p>
          </section>

          <section v-if="selectedPatient.billingRate" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Facturación</h3>
            <div class="flex gap-6">
              <div>
                <p class="text-xs text-gray-400">Tarifa por sesión</p>
                <p class="text-sm font-semibold text-gray-800">{{ selectedPatient.billingRate }} €</p>
              </div>
              <div v-if="selectedPatient.billingMethod">
                <p class="text-xs text-gray-400">Forma de pago</p>
                <p class="text-sm font-medium text-gray-800">{{ selectedPatient.billingMethod }}</p>
              </div>
            </div>
            <p v-if="selectedPatient.billingNotes" class="text-sm text-gray-500 mt-2">{{ selectedPatient.billingNotes }}</p>
          </section>
        </template>
      </div>

      <!-- Detail actions -->
      <div class="border-t border-gray-100 p-4 flex gap-3 shrink-0">
        <BaseButton variant="secondary" @click="changeStatusInDetail" class="flex-1">
          Cambiar estado
        </BaseButton>
        <BaseButton variant="secondary" @click="goToPatient(selectedApt.patientId)" class="flex-1">
          Ver paciente
        </BaseButton>
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
          <BaseButton variant="secondary" @click="showForm = false" class="flex-1">Cancelar</BaseButton>
          <BaseButton @click="saveAppointment" :disabled="!form.patientId || !form.time" :loading="saving" class="flex-1">Guardar</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentsStore } from '@/stores/appointments'
import { usePatientsStore } from '@/stores/patients'
import type { Appointment } from '@/types'
import BaseButton from '@/components/BaseButton.vue'
import IconButton from '@/components/IconButton.vue'

const router = useRouter()
const appointmentsStore = useAppointmentsStore()
const patientsStore = usePatientsStore()

const selectedDate = ref(new Date())
const showForm = ref(false)
const selectedApt = ref<Appointment | null>(null)

const selectedPatient = computed(() =>
  selectedApt.value ? patientsStore.getById(selectedApt.value.patientId) : null
)

function openDetail(apt: Appointment) {
  selectedApt.value = { ...apt }
}

async function changeStatusInDetail() {
  if (!selectedApt.value) return
  await changeStatus(selectedApt.value)
  const apt = appointmentsStore.byDate(dateKey.value).find(a => a.id === selectedApt.value!.id)
  if (apt) selectedApt.value = { ...apt }
}

function goToPatient(id: string) {
  selectedApt.value = null
  router.push(`/patients/${id}`)
}

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

const saving = ref(false)

async function changeStatus(apt: Appointment) {
  const cycle: Appointment['status'][] = ['pending', 'confirmed', 'completed', 'cancelled']
  const next = cycle[(cycle.indexOf(apt.status) + 1) % cycle.length]
  try {
    await appointmentsStore.update(apt.id, { status: next })
  } catch {
    alert('Error al actualizar el estado')
  }
}

async function deleteApt(id: string) {
  if (!confirm('¿Eliminar esta cita?')) return
  try {
    await appointmentsStore.remove(id)
  } catch {
    alert('Error al eliminar la cita')
  }
}

async function saveAppointment() {
  saving.value = true
  try {
    await appointmentsStore.add({
      patientId: form.patientId,
      date: dateKey.value,
      time: form.time,
      duration: form.duration,
      notes: form.notes,
      status: 'confirmed',
    })
    showForm.value = false
    Object.assign(form, { patientId: '', time: '09:00', duration: 45, notes: '' })
  } catch {
    alert('Error al guardar la cita')
  } finally {
    saving.value = false
  }
}
</script>
