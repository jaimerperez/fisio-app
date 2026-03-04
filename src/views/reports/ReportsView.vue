<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-900">Informes</h1>
    </header>

    <div class="p-4 max-w-2xl mx-auto space-y-4">
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-primary-600">{{ totalPatients }}</p>
          <p class="text-xs text-gray-500 mt-1">Pacientes</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-green-600">{{ totalSessions }}</p>
          <p class="text-xs text-gray-500 mt-1">Sesiones</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-3xl font-bold text-orange-500">{{ monthSessions }}</p>
          <p class="text-xs text-gray-500 mt-1">Este mes</p>
        </div>
      </div>

      <!-- Patient report selector -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 class="font-semibold text-gray-900">Informe por paciente</h2>
        <select v-model="selectedPatientId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Seleccionar paciente...</option>
          <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }} {{ p.lastName }}</option>
        </select>

        <div v-if="selectedPatient" class="space-y-2">
          <div class="rounded-xl bg-gray-50 p-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Sesiones totales</span>
              <span class="font-semibold">{{ patientSessions.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tiempo total</span>
              <span class="font-semibold">{{ totalMinutes }} min</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Última sesión</span>
              <span class="font-semibold">{{ lastSession ?? '—' }}</span>
            </div>
          </div>
          <button @click="printReport" class="w-full py-2.5 border border-primary-200 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"/></svg>
            Imprimir informe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePatientsStore } from '@/stores/patients'
import { useSessionsStore } from '@/stores/sessions'

const patientsStore = usePatientsStore()
const sessionsStore = useSessionsStore()

const selectedPatientId = ref('')

const patients = computed(() => patientsStore.patients)
const totalPatients = computed(() => patientsStore.total)
const totalSessions = computed(() => sessionsStore.total)

const monthSessions = computed(() => {
  const month = new Date().toISOString().slice(0, 7)
  return sessionsStore.sessions.filter(s => s.date.startsWith(month)).length
})

const selectedPatient = computed(() => selectedPatientId.value ? patientsStore.getById(selectedPatientId.value) : null)
const patientSessions = computed(() => selectedPatientId.value ? sessionsStore.byPatient(selectedPatientId.value) : [])
const totalMinutes = computed(() => patientSessions.value.reduce((acc, s) => acc + s.duration, 0))
const lastSession = computed(() => patientSessions.value[0]?.date ?? null)

function printReport() {
  const p = selectedPatient.value!
  const sessions = patientSessions.value
  const lines = [
    `INFORME DE PACIENTE`,
    `===================`,
    `Nombre: ${p.name} ${p.lastName}`,
    `DNI: ${p.dni || '—'}`,
    `Teléfono: ${p.phone || '—'}`,
    `Antecedentes: ${p.medicalHistory || '—'}`,
    ``,
    `SESIONES (${sessions.length})`,
    `-------------------`,
    ...sessions.map(s => `${s.date} | ${s.duration}min | ${s.treatment || ''} | ${s.notes || ''}`),
  ]
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<pre style="font-family:monospace;padding:2rem">${lines.join('\n')}</pre>`)
  win.document.close()
  win.print()
}
</script>
