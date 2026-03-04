<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
      <button @click="router.back()" class="p-2 rounded-xl hover:bg-gray-100">
        <svg class="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
      </button>
      <h1 class="flex-1 text-lg font-bold text-gray-900">{{ patient?.name }} {{ patient?.lastName }}</h1>
      <button @click="editing = !editing" class="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100">
        {{ editing ? 'Cancelar' : 'Editar' }}
      </button>
    </header>

    <div v-if="!patient" class="text-center py-20 text-gray-400">Paciente no encontrado</div>

    <div v-else class="p-4 max-w-2xl mx-auto space-y-4">
      <!-- Info card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
            {{ patient.name[0] }}{{ patient.lastName[0] }}
          </div>
          <div>
            <p class="text-xl font-bold text-gray-900">{{ patient.name }} {{ patient.lastName }}</p>
            <p v-if="patient.birthDate" class="text-sm text-gray-500">{{ age }} años · {{ patient.birthDate }}</p>
          </div>
        </div>

        <template v-if="!editing">
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div v-if="patient.phone">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Teléfono</p>
              <a :href="`tel:${patient.phone}`" class="text-sm text-primary-600 font-medium">{{ patient.phone }}</a>
            </div>
            <div v-if="patient.email">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
              <p class="text-sm text-gray-700">{{ patient.email }}</p>
            </div>
            <div v-if="patient.dni">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">DNI</p>
              <p class="text-sm text-gray-700">{{ patient.dni }}</p>
            </div>
          </div>
          <div v-if="patient.medicalHistory" class="pt-1">
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Antecedentes médicos</p>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ patient.medicalHistory }}</p>
          </div>
        </template>

        <!-- Edit form -->
        <template v-else>
          <div class="space-y-3 pt-2">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-sm font-medium text-gray-700">Nombre</label>
                <input v-model="editForm.name" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Apellidos</label>
                <input v-model="editForm.lastName" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-sm font-medium text-gray-700">Teléfono</label>
                <input v-model="editForm.phone" type="tel" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Email</label>
                <input v-model="editForm.email" type="email" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Antecedentes médicos</label>
              <textarea v-model="editForm.medicalHistory" rows="3" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <button @click="saveEdit" class="w-full py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">Guardar cambios</button>
          </div>
        </template>
      </div>

      <!-- Photos section -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold text-gray-900">Fotos</h2>
          <label class="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 cursor-pointer">
            Añadir foto
            <input type="file" accept="image/*" capture="environment" class="hidden" @change="addPhoto" multiple />
          </label>
        </div>
        <div v-if="patient.photos.length === 0" class="text-sm text-gray-400 text-center py-6">Sin fotos</div>
        <div v-else class="grid grid-cols-3 gap-2">
          <div v-for="(photo, i) in patient.photos" :key="i" class="relative aspect-square">
            <img :src="photo" class="w-full h-full object-cover rounded-xl" />
            <button @click="removePhoto(i)" class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Sessions -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold text-gray-900">Sesiones ({{ patientSessions.length }})</h2>
          <button @click="showSessionForm = true" class="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100">+ Nueva</button>
        </div>
        <div v-if="patientSessions.length === 0" class="text-sm text-gray-400 text-center py-4">Sin sesiones registradas</div>
        <div v-else class="space-y-2">
          <div v-for="s in patientSessions" :key="s.id" class="border border-gray-100 rounded-xl p-3">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-gray-900">{{ s.date }}</span>
              <span class="text-gray-500">{{ s.duration }} min</span>
            </div>
            <p v-if="s.treatment" class="text-sm text-primary-700 mt-0.5">{{ s.treatment }}</p>
            <p v-if="s.notes" class="text-sm text-gray-500 mt-0.5">{{ s.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New session modal -->
    <div v-if="showSessionForm" class="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
        <h2 class="text-lg font-bold text-gray-900">Nueva sesión</h2>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Fecha *</label>
              <input v-model="sessionForm.date" type="date" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Duración (min)</label>
              <input v-model.number="sessionForm.duration" type="number" min="15" step="15" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Tratamiento</label>
            <input v-model="sessionForm.treatment" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: Masaje terapéutico, ejercicios..." />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Notas de la sesión</label>
            <textarea v-model="sessionForm.notes" rows="3" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
        </div>
        <div class="flex gap-3 pt-1">
          <button @click="showSessionForm = false" class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancelar</button>
          <button @click="saveSession" :disabled="!sessionForm.date"
            class="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useSessionsStore } from '@/stores/sessions'

const route = useRoute()
const router = useRouter()
const patientsStore = usePatientsStore()
const sessionsStore = useSessionsStore()

const editing = ref(false)
const showSessionForm = ref(false)

const patient = computed(() => patientsStore.getById(route.params.id as string))

const editForm = reactive({ name: '', lastName: '', phone: '', email: '', medicalHistory: '' })

watch(patient, (p) => {
  if (p) Object.assign(editForm, { name: p.name, lastName: p.lastName, phone: p.phone, email: p.email, medicalHistory: p.medicalHistory })
}, { immediate: true })

const age = computed(() => {
  if (!patient.value?.birthDate) return ''
  const diff = Date.now() - new Date(patient.value.birthDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
})

const patientSessions = computed(() => sessionsStore.byPatient(route.params.id as string))

const sessionForm = reactive({ date: new Date().toISOString().slice(0, 10), duration: 45, treatment: '', notes: '' })

function saveEdit() {
  patientsStore.update(patient.value!.id, { ...editForm })
  editing.value = false
}

function addPhoto(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = ev.target?.result as string
      const current = patient.value!.photos
      patientsStore.update(patient.value!.id, { photos: [...current, data] })
    }
    reader.readAsDataURL(file)
  })
}

function removePhoto(index: number) {
  const photos = [...patient.value!.photos]
  photos.splice(index, 1)
  patientsStore.update(patient.value!.id, { photos })
}

function saveSession() {
  sessionsStore.add({
    patientId: patient.value!.id,
    ...sessionForm,
  })
  showSessionForm.value = false
  Object.assign(sessionForm, { date: new Date().toISOString().slice(0, 10), duration: 45, treatment: '', notes: '' })
}
</script>
