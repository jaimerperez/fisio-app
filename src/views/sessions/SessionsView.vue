<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0 bg-slate-50">
    <header class="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Sesiones</h1>
      <p class="text-xs text-slate-400 mt-0.5">{{ sessions.length }} sesión{{ sessions.length !== 1 ? 'es' : '' }} registrada{{ sessions.length !== 1 ? 's' : '' }}</p>
    </header>

    <div class="p-4 max-w-2xl mx-auto space-y-2.5">
      <div v-if="sessions.length === 0" class="text-center py-16 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"/></svg>
        <p class="font-semibold text-slate-500">Sin sesiones registradas</p>
        <p class="text-sm mt-1">Añade sesiones desde la ficha de cada paciente</p>
      </div>
      <div v-for="s in sorted" :key="s.id"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3 hover:shadow-md transition-all">
        <div class="w-1 rounded-full bg-gradient-to-b from-violet-400 to-primary-500 shrink-0 self-stretch min-h-[40px]"></div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <RouterLink :to="`/patients/${s.patientId}`" class="font-semibold text-primary-600 hover:text-primary-700 truncate block transition-colors">
                {{ patientName(s.patientId) }}
              </RouterLink>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatDateES(s.date) }} · {{ s.duration }} min</p>
            </div>
            <IconButton variant="danger" @click="deleteSession(s.id)" class="shrink-0">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
            </IconButton>
          </div>
          <p v-if="s.treatment" class="text-sm text-violet-700 mt-1.5 font-medium bg-violet-50 px-2.5 py-1 rounded-lg inline-block">{{ s.treatment }}</p>
          <p v-if="s.notes" class="text-sm text-slate-600 mt-1.5 leading-relaxed">{{ s.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions'
import { usePatientsStore } from '@/stores/patients'
import IconButton from '@/components/IconButton.vue'
import { formatDateES } from '@/utils/format'

const sessionsStore = useSessionsStore()
const patientsStore = usePatientsStore()

const sessions = computed(() => sessionsStore.sessions)
const sorted = computed(() => [...sessions.value].sort((a, b) => b.date.localeCompare(a.date)))

function patientName(id: string) {
  const p = patientsStore.getById(id)
  return p ? `${p.name} ${p.lastName}` : 'Desconocido'
}

async function deleteSession(id: string) {
  if (!confirm('¿Eliminar esta sesión?')) return
  try {
    await sessionsStore.remove(id)
  } catch {
    alert('Error al eliminar la sesión')
  }
}
</script>
