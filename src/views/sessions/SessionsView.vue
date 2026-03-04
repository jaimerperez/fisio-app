<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-900">Sesiones</h1>
    </header>

    <div class="p-4 max-w-2xl mx-auto space-y-3">
      <div v-if="sessions.length === 0" class="text-center py-16 text-gray-400">
        <p class="font-medium">Sin sesiones registradas</p>
        <p class="text-sm mt-1">Añade sesiones desde la ficha de cada paciente</p>
      </div>
      <div v-for="s in sorted" :key="s.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-start justify-between">
          <div>
            <RouterLink :to="`/patients/${s.patientId}`" class="font-semibold text-primary-600 hover:underline">
              {{ patientName(s.patientId) }}
            </RouterLink>
            <p class="text-sm text-gray-500">{{ s.date }} · {{ s.duration }} min</p>
          </div>
          <button @click="sessionsStore.remove(s.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
          </button>
        </div>
        <p v-if="s.treatment" class="text-sm text-primary-700 mt-1.5 font-medium">{{ s.treatment }}</p>
        <p v-if="s.notes" class="text-sm text-gray-600 mt-1">{{ s.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions'
import { usePatientsStore } from '@/stores/patients'

const sessionsStore = useSessionsStore()
const patientsStore = usePatientsStore()

const sessions = computed(() => sessionsStore.sessions)
const sorted = computed(() => [...sessions.value].sort((a, b) => b.date.localeCompare(a.date)))

function patientName(id: string) {
  const p = patientsStore.getById(id)
  return p ? `${p.name} ${p.lastName}` : 'Desconocido'
}
</script>
