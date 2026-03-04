<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-900">Pacientes</h1>
      <button @click="showForm = true"
        class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 active:scale-95 transition-all shadow-sm">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Nuevo
      </button>
    </header>

    <div class="p-4 max-w-2xl mx-auto space-y-4">
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
        <input v-model="query" type="search" placeholder="Buscar por nombre o DNI..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
      </div>

      <!-- List -->
      <div v-if="filtered.length === 0" class="text-center py-16 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
        <p class="font-medium">Sin pacientes</p>
      </div>

      <RouterLink v-for="p in filtered" :key="p.id" :to="`/patients/${p.id}`"
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-primary-200 transition-colors">
        <div class="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
          {{ p.name[0] }}{{ p.lastName[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900">{{ p.name }} {{ p.lastName }}</p>
          <p class="text-sm text-gray-500 truncate">{{ p.phone }} <span v-if="p.dni">· {{ p.dni }}</span></p>
        </div>
        <svg class="w-4 h-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
      </RouterLink>
    </div>

    <!-- New patient modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold text-gray-900">Nuevo paciente</h2>

        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Nombre *</label>
              <input v-model="form.name" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Apellidos *</label>
              <input v-model="form.lastName" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Fecha nacimiento</label>
              <input v-model="form.birthDate" type="date" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">DNI / NIF</label>
              <input v-model="form.dni" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Teléfono</label>
              <input v-model="form.phone" type="tel" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Antecedentes médicos</label>
            <textarea v-model="form.medicalHistory" rows="3" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Alergias, medicamentos, patologías previas..." />
          </div>
        </div>

        <div class="flex gap-3 pt-1">
          <button @click="showForm = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
          <button @click="savePatient" :disabled="!form.name || !form.lastName"
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
import { RouterLink } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'

const store = usePatientsStore()
const query = ref('')
const showForm = ref(false)

const form = reactive({
  name: '', lastName: '', birthDate: '', dni: '', phone: '', email: '', medicalHistory: '',
})

const filtered = computed(() =>
  query.value ? store.search(query.value) : store.patients
)

function savePatient() {
  store.add({ ...form, photos: [] })
  showForm.value = false
  Object.assign(form, { name: '', lastName: '', birthDate: '', dni: '', phone: '', email: '', medicalHistory: '' })
}
</script>
