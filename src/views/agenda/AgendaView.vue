<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0 bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div class="flex items-center gap-2">
        <button @click="prevWeek" class="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
        </button>
        <div class="text-center min-w-[160px]">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wide">Semana</p>
          <h1 class="text-base font-bold text-slate-900">{{ weekRangeLabel }}</h1>
        </div>
        <button @click="nextWeek" class="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
        </button>
        <button @click="goToday" class="ml-1 px-3 py-1.5 text-xs font-semibold bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">Hoy</button>
      </div>
      <BaseButton @click="openNewAppointment" class="shadow-sm">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Nueva cita
      </BaseButton>
    </header>

    <!-- Week grid -->
    <div class="flex md:grid md:grid-cols-7 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-3 p-4">
      <div v-for="day in weekDays" :key="toDateKey(day)"
        class="min-w-[160px] md:min-w-0 shrink-0 md:shrink snap-start">
        <div class="flex items-center justify-between rounded-t-2xl px-3 py-2"
          :class="isToday(day) ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide opacity-80">{{ dayShortNames[day.getDay() === 0 ? 6 : day.getDay() - 1] }}</p>
            <p class="text-sm font-bold">{{ day.getDate() }}</p>
          </div>
          <button @click="openNewAppointmentForDay(day)"
            class="p-1 rounded-lg transition-colors"
            :class="isToday(day) ? 'hover:bg-white/20' : 'hover:bg-slate-200'">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </button>
        </div>
        <div class="bg-white border border-slate-100 rounded-b-2xl p-2 space-y-2 min-h-[80px]">
          <p v-if="appointmentsFor(day).length === 0" class="text-xs text-slate-400 text-center py-4">Sin citas</p>
          <div v-for="apt in appointmentsFor(day)" :key="apt.id"
            class="rounded-xl border border-slate-100 shadow-sm p-2.5 cursor-pointer hover:border-primary-200 hover:shadow-md transition-all bg-white"
            @click="openDetail(apt)">
            <div class="flex items-center justify-between gap-1">
              <p class="text-xs font-bold text-primary-600">{{ apt.time }}</p>
              <span :class="statusDotClass(apt.status)" class="w-2 h-2 rounded-full shrink-0" :title="statusLabel(apt.status)"></span>
            </div>
            <p class="text-xs font-semibold text-slate-900 truncate mt-1">{{ patientName(apt.patientId) }}</p>
            <p class="text-[11px] text-slate-400">{{ apt.duration }}min</p>
          </div>
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
          <p class="text-xs text-gray-400">{{ formatLong(selectedApt.date) }}</p>
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
                <p class="text-sm font-medium text-gray-800">{{ formatDateES(selectedPatient.birthDate) }}</p>
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
      <div class="border-t border-gray-100 p-4 flex flex-col gap-2 shrink-0">
        <div class="flex gap-3">
          <BaseButton variant="secondary" @click="changeStatusInDetail" class="flex-1">
            Cambiar estado
          </BaseButton>
          <BaseButton variant="secondary" @click="goToPatient(selectedApt.patientId)" class="flex-1">
            Ver paciente
          </BaseButton>
        </div>
        <BaseButton variant="danger" @click="deleteAptInDetail" class="w-full">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          Eliminar cita
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
              <label class="text-sm font-medium text-gray-700">Fecha</label>
              <input v-model="form.date" type="date" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Hora</label>
              <input v-model="form.time" type="time" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Duración (min)</label>
            <input v-model.number="form.duration" type="number" min="15" step="15" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Notas</label>
            <textarea v-model="form.notes" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
        </div>

        <div class="flex gap-3 pt-1">
          <BaseButton variant="secondary" @click="showForm = false" class="flex-1">Cancelar</BaseButton>
          <BaseButton @click="saveAppointment" :disabled="!form.patientId || !form.date || !form.time" :loading="saving" class="flex-1">Guardar</BaseButton>
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
import { formatDateES } from '@/utils/format'

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
  const apt = appointmentsStore.byDate(selectedApt.value.date).find(a => a.id === selectedApt.value!.id)
  if (apt) selectedApt.value = { ...apt }
}

function goToPatient(id: string) {
  selectedApt.value = null
  router.push(`/patients/${id}`)
}

const form = reactive({
  patientId: '',
  date: '',
  time: '09:00',
  duration: 45,
  notes: '',
})

const patients = computed(() => patientsStore.patients)

const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const dayShortNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function toDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatLong(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return `${d} de ${months[m - 1]} ${y}`
}

function isToday(d: Date) {
  return toDateKey(d) === toDateKey(new Date())
}

const weekStart = computed(() => {
  const d = new Date(selectedDate.value)
  const offset = d.getDay() === 0 ? -6 : 1 - d.getDay()
  d.setDate(d.getDate() + offset)
  return d
})

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    return d
  })
)

const weekRangeLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[6]
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} - ${end.getDate()} de ${months[end.getMonth()]} ${end.getFullYear()}`
  }
  return `${start.getDate()} de ${months[start.getMonth()]} - ${end.getDate()} de ${months[end.getMonth()]} ${end.getFullYear()}`
})

function appointmentsFor(day: Date) {
  return appointmentsStore.byDate(toDateKey(day))
}

function prevWeek() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 7)
  selectedDate.value = d
}
function nextWeek() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 7)
  selectedDate.value = d
}
function goToday() {
  selectedDate.value = new Date()
}

function openFormForDate(dateKey: string) {
  form.date = dateKey
  showForm.value = true
}

function openNewAppointment() {
  openFormForDate(toDateKey(new Date()))
}

function openNewAppointmentForDay(day: Date) {
  openFormForDate(toDateKey(day))
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

const statusDotColors: Record<Appointment['status'], string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-400',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
}

function statusClass(s: Appointment['status']) { return statusColors[s] }
function statusLabel(s: Appointment['status']) { return statusLabels[s] }
function statusDotClass(s: Appointment['status']) { return statusDotColors[s] }

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

async function deleteApt(id: string): Promise<boolean> {
  if (!confirm('¿Eliminar esta cita?')) return false
  try {
    await appointmentsStore.remove(id)
    return true
  } catch {
    alert('Error al eliminar la cita')
    return false
  }
}

async function deleteAptInDetail() {
  if (!selectedApt.value) return
  if (await deleteApt(selectedApt.value.id)) selectedApt.value = null
}

async function saveAppointment() {
  saving.value = true
  try {
    await appointmentsStore.add({
      patientId: form.patientId,
      date: form.date,
      time: form.time,
      duration: form.duration,
      notes: form.notes,
      status: 'confirmed',
    })
    showForm.value = false
    Object.assign(form, { patientId: '', date: '', time: '09:00', duration: 45, notes: '' })
  } catch {
    alert('Error al guardar la cita')
  } finally {
    saving.value = false
  }
}
</script>
