<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 class="text-xl font-bold text-gray-900">Pacientes</h1>
      <BaseButton @click="showForm = true" class="shadow-sm">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
        Nuevo
      </BaseButton>
    </header>

    <div class="p-4 mx-auto space-y-4">
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

      <div v-for="p in filtered" :key="p.id"
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-primary-200 transition-colors">
        <RouterLink :to="`/patients/${p.id}`" class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
            {{ p.name[0] }}{{ p.lastName[0] }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900">{{ p.name }} {{ p.lastName }}</p>
            <p class="text-sm text-gray-500 truncate">{{ p.phone }} <span v-if="p.dni">· {{ p.dni }}</span></p>
          </div>
          <svg class="w-4 h-4 text-gray-300 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
        </RouterLink>
        <IconButton variant="danger" @click="deletePatient(p.id)">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
        </IconButton>
      </div>
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
          <BaseButton variant="secondary" @click="showForm = false" class="flex-1">Cancelar</BaseButton>
          <BaseButton @click="savePatient" :disabled="!form.name || !form.lastName" :loading="saving" class="flex-1">Guardar</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

import { RouterLink } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import BaseButton from '@/components/BaseButton.vue'
import IconButton from '@/components/IconButton.vue'

const store = usePatientsStore()
const query = ref('')
const showForm = ref(false)

const form = reactive({
  name: '', lastName: '', birthDate: '', dni: '', phone: '', email: '', medicalHistory: '',
})

const filtered = computed(() =>
  query.value ? store.search(query.value) : store.patients
)

const saving = ref(false)

async function deletePatient(id: string) {
  if (!confirm('¿Eliminar este paciente? Se borrarán también todas sus sesiones.')) return
  try {
    await store.remove(id)
  } catch {
    alert('Error al eliminar el paciente')
  }
}

async function savePatient() {
  saving.value = true
  try {
    await store.add({ ...form, photos: [], pathologies: '', observations: '', billingRate: 0, billingMethod: '', billingNotes: '' })
    showForm.value = false
    Object.assign(form, { name: '', lastName: '', birthDate: '', dni: '', phone: '', email: '', medicalHistory: '' })
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
      alert('Ya existe un paciente con ese email')
    } else {
      alert('Error al guardar el paciente')
    }
  } finally {
    saving.value = false
  }
}
</script>
