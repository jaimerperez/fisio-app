<template>
  <div class="flex-1 overflow-auto pb-32 md:pb-0 bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Ejercicios</h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ store.exercises.length }} archivo{{ store.exercises.length !== 1 ? 's' : '' }}</p>
        </div>
        <label class="cursor-pointer">
          <input type="file" multiple accept=".pdf,image/*" class="hidden" @change="handleUpload" />
          <span class="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:bg-primary-700 transition-colors">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Subir
          </span>
        </label>
      </div>
    </header>

    <!-- Folder tabs -->
    <div class="bg-white border-b border-slate-100 px-4 py-2.5 flex gap-2 overflow-x-auto" style="scrollbar-width:none">
      <button
        @click="selectedFolder = 'all'"
        :class="selectedFolder === 'all' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        class="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
        Todas
      </button>
      <div v-for="folder in store.folders" :key="folder.id" class="shrink-0 flex items-center gap-1">
        <button
          @click="selectedFolder = folder.id"
          :class="selectedFolder === folder.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
          {{ folder.name }}
        </button>
        <button @click="deleteFolder(folder.id)" class="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none -ml-1">×</button>
      </div>
      <button @click="showNewFolder = true"
        class="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
        + Carpeta
      </button>
    </div>

    <!-- New folder input -->
    <div v-if="showNewFolder" class="bg-white border-b border-slate-100 px-4 py-3 flex gap-2">
      <input v-model="newFolderName" type="text" placeholder="Nombre de la carpeta"
        @keyup.enter="createFolder" @keyup.esc="cancelNewFolder"
        class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      <button @click="createFolder" class="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium">Crear</button>
      <button @click="cancelNewFolder" class="text-slate-400 px-3 py-2 rounded-xl text-sm hover:bg-slate-100">Cancelar</button>
    </div>

    <!-- Upload progress -->
    <div v-if="uploading" class="px-4 py-2.5 bg-primary-50 border-b border-primary-100 text-sm text-primary-700 flex items-center gap-2">
      <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Subiendo archivos...
    </div>

    <!-- Grid -->
    <div class="p-4 max-w-4xl mx-auto">
      <div v-if="filteredExercises.length === 0" class="text-center py-16 text-slate-400">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-30" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p class="font-semibold text-slate-500">Sin ejercicios</p>
        <p class="text-sm mt-1">Sube PDFs o imágenes con el botón "Subir"</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="ex in filteredExercises" :key="ex.id"
          @click="toggleSelect(ex.id)"
          :class="selected.has(ex.id) ? 'ring-2 ring-primary-500 bg-primary-50' : 'bg-white hover:shadow-md'"
          class="rounded-2xl border border-slate-100 shadow-sm p-3 cursor-pointer transition-all relative select-none">

          <!-- Checkbox -->
          <div :class="selected.has(ex.id) ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'"
            class="absolute top-2.5 right-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-colors">
            <svg v-if="selected.has(ex.id)" class="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Preview -->
          <div class="aspect-square rounded-xl overflow-hidden mb-2.5 bg-slate-100 flex items-center justify-center">
            <img v-if="previews.get(ex.id)" :src="previews.get(ex.id)" class="w-full h-full object-cover" />
            <div v-else class="flex flex-col items-center justify-center">
              <svg class="w-10 h-10 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
              <span class="text-xs text-slate-400 mt-1 font-medium">PDF</span>
            </div>
          </div>

          <!-- Info -->
          <p class="text-sm font-medium text-slate-800 truncate leading-tight">{{ ex.name }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ formatSize(ex.size) }}</p>

          <!-- Delete -->
          <button @click.stop="confirmDelete(ex.id)"
            class="absolute bottom-2.5 right-2.5 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors text-lg leading-none">
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Send bar -->
    <div v-if="selected.size > 0"
      class="fixed bottom-20 md:bottom-6 left-4 right-4 max-w-lg mx-auto bg-slate-900 text-white rounded-2xl shadow-xl px-5 py-4 flex items-center justify-between z-40">
      <span class="text-sm font-medium">{{ selected.size }} seleccionado{{ selected.size !== 1 ? 's' : '' }}</span>
      <div class="flex items-center gap-3">
        <button @click="selected.clear()" class="text-slate-400 text-sm hover:text-white transition-colors">Cancelar</button>
        <button @click="showPatientPicker = true"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.999 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.273a.75.75 0 0 0 .92.92l5.455-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.626 0 12 0zm0 21.75a9.721 9.721 0 0 1-4.964-1.36l-.357-.212-3.697.993.997-3.62-.232-.372A9.72 9.72 0 0 1 2.25 12c0-5.376 4.374-9.75 9.75-9.75s9.75 4.374 9.75 9.75-4.374 9.75-9.75 9.75z"/>
          </svg>
          Enviar por WhatsApp
        </button>
      </div>
    </div>

    <!-- Patient picker modal -->
    <div v-if="showPatientPicker" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4" @click.self="showPatientPicker = false">
      <div class="bg-white rounded-3xl w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl">
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">Seleccionar paciente</h3>
          <p class="text-xs text-slate-400 mt-0.5">Los archivos se descargarán automáticamente</p>
          <input v-model="patientSearch" type="text" placeholder="Buscar por nombre..."
            class="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div class="overflow-y-auto flex-1 p-3 space-y-1">
          <button v-for="p in filteredPatients" :key="p.id"
            @click="sendViaWhatsApp(p)"
            class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left">
            <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
              {{ p.name[0] }}{{ p.lastName[0] }}
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">{{ p.name }} {{ p.lastName }}</p>
              <p class="text-xs text-slate-400">{{ p.phone || 'Sin teléfono' }}</p>
            </div>
          </button>
          <p v-if="filteredPatients.length === 0" class="text-center text-slate-400 text-sm py-6">Sin resultados</p>
        </div>
        <div class="p-4 border-t border-gray-100">
          <button @click="showPatientPicker = false" class="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useExercisesStore } from '@/stores/exercises'
import { usePatientsStore } from '@/stores/patients'
import { getFile } from '@/db/exerciseFiles'
import type { Patient } from '@/types'

const store = useExercisesStore()
const patientsStore = usePatientsStore()

const selectedFolder = ref<string>('all')
const selected = ref<Set<string>>(new Set())
const uploading = ref(false)
const showNewFolder = ref(false)
const newFolderName = ref('')
const showPatientPicker = ref(false)
const patientSearch = ref('')
const previews = ref<Map<string, string>>(new Map())

const filteredExercises = computed(() => {
  if (selectedFolder.value === 'all') return store.exercises
  return store.exercises.filter(e => e.folderId === selectedFolder.value)
})

const filteredPatients = computed(() => {
  const q = patientSearch.value.toLowerCase().trim()
  if (!q) return patientsStore.patients
  return patientsStore.patients.filter(p =>
    `${p.name} ${p.lastName}`.toLowerCase().includes(q)
  )
})

watch(filteredExercises, async (list) => {
  for (const ex of list) {
    if (ex.mimeType.startsWith('image/') && !previews.value.has(ex.id)) {
      const blob = await getFile(ex.id)
      if (blob) {
        const url = URL.createObjectURL(blob)
        previews.value = new Map(previews.value.set(ex.id, url))
      }
    }
  }
}, { immediate: true })

onUnmounted(() => {
  previews.value.forEach(url => URL.revokeObjectURL(url))
})

function toggleSelect(id: string) {
  const next = new Set(selected.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selected.value = next
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true
  const folderId = selectedFolder.value === 'all' ? null : selectedFolder.value
  for (const file of Array.from(input.files)) {
    await store.addExercise(file, folderId)
  }
  uploading.value = false
  input.value = ''
}

function createFolder() {
  const name = newFolderName.value.trim()
  if (!name) return
  store.addFolder(name)
  newFolderName.value = ''
  showNewFolder.value = false
}

function cancelNewFolder() {
  newFolderName.value = ''
  showNewFolder.value = false
}

function deleteFolder(id: string) {
  if (!confirm('¿Eliminar esta carpeta? Los ejercicios se moverán a "Todas".')) return
  if (selectedFolder.value === id) selectedFolder.value = 'all'
  store.removeFolder(id)
}

async function confirmDelete(id: string) {
  if (!confirm('¿Eliminar este ejercicio?')) return
  selected.value.delete(id)
  await store.removeExercise(id)
  previews.value.delete(id)
}

async function sendViaWhatsApp(patient: Patient) {
  showPatientPicker.value = false
  const selectedList = store.exercises.filter(e => selected.value.has(e.id))

  for (const ex of selectedList) {
    const blob = await getFile(ex.id)
    if (!blob) continue
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ext = ex.mimeType.includes('pdf') ? '.pdf'
      : ex.mimeType.includes('png') ? '.png'
      : ex.mimeType.includes('jpg') || ex.mimeType.includes('jpeg') ? '.jpg'
      : ''
    a.download = ex.name + ext
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    await new Promise(r => setTimeout(r, 400))
  }

  const names = selectedList.map(e => `• ${e.name}`).join('\n')
  const message = `Hola ${patient.name}, te envío los siguientes ejercicios:\n${names}\n\nAdjunta los archivos descargados en este chat.`
  const phone = patient.phone.replace(/[\s\-().+]/g, '')
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')

  selected.value = new Set()
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
