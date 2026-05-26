<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0 bg-slate-50">
    <header class="bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Configuración</h1>
      <p class="text-xs text-slate-400 mt-0.5">Ajustes de la clínica y protección de datos</p>
    </header>

    <div class="p-4 max-w-2xl mx-auto space-y-5">

      <!-- Physio consent -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            :class="settings.data.physioConsentSignedAt ? 'bg-emerald-50' : 'bg-amber-50'">
            <svg class="w-5 h-5" :class="settings.data.physioConsentSignedAt ? 'text-emerald-600' : 'text-amber-500'"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Tu consentimiento (fisioterapeuta)</h2>
            <p class="text-xs text-slate-400">Debes aceptar también como responsable del tratamiento</p>
          </div>
        </div>

        <div v-if="settings.data.physioConsentSignedAt" class="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
          <div class="flex items-center gap-2 text-emerald-700">
            <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Firmado por {{ settings.data.physioName }}</span>
          </div>
          <p class="text-xs text-emerald-600">{{ formatDateTime(settings.data.physioConsentSignedAt) }}</p>
          <button @click="settings.revokePhysioConsent()" class="text-xs text-red-400 hover:text-red-600 transition-colors mt-1">
            Revocar firma
          </button>
        </div>

        <div v-else class="space-y-3">
          <div class="rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-700">
            Aún no has firmado el consentimiento como responsable del tratamiento.
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Tu nombre completo</label>
            <input v-model="physioName" type="text" placeholder="Nombre y apellidos del fisioterapeuta"
              class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <label class="flex items-start gap-2.5 cursor-pointer">
            <input v-model="physioChecked" type="checkbox" class="mt-0.5 w-4 h-4 text-primary-600 rounded" />
            <span class="text-sm text-slate-600">He leído y acepto actuar como responsable del tratamiento de datos de los pacientes según la normativa LOPD/RGPD</span>
          </label>
          <button @click="signPhysio" :disabled="!physioChecked || !physioName.trim()"
            class="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="physioChecked && physioName.trim() ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
            Firmar como responsable
          </button>
        </div>
      </div>

      <!-- Consent text editor -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-slate-900">Texto del consentimiento</h2>
            <p class="text-xs text-slate-400 mt-0.5">Este texto se mostrará a cada paciente para que lo acepte</p>
          </div>
          <button @click="saveText" :disabled="!textChanged"
            class="text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            :class="textChanged ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
            Guardar
          </button>
        </div>
        <textarea v-model="consentDraft" rows="18"
          class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono leading-relaxed" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppSettingsStore } from '@/stores/appSettings'
import { formatDateES } from '@/utils/format'

const settings = useAppSettingsStore()

const physioName = ref(settings.data.physioName)
const physioChecked = ref(false)
const consentDraft = ref(settings.data.consentText)

const textChanged = computed(() => consentDraft.value !== settings.data.consentText)

function signPhysio() {
  if (!physioChecked.value || !physioName.value.trim()) return
  settings.signPhysioConsent(physioName.value.trim())
}

function saveText() {
  settings.updateConsentText(consentDraft.value)
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${formatDateES(iso.slice(0, 10))} a las ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h`
}
</script>
