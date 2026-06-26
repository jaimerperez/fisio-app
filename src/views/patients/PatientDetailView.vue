<template>
  <div class="flex-1 overflow-auto pb-20 md:pb-0">
    <header class="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
      <button @click="router.back()" class="p-2 rounded-xl hover:bg-gray-100">
        <svg class="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
      </button>
      <h1 class="flex-1 text-lg font-bold text-gray-900">{{ patient?.name }} {{ patient?.lastName }}</h1>
      <BaseButton v-if="activeTab === 'ficha'" variant="ghost" size="sm" @click="editing = !editing">
        {{ editing ? 'Cancelar' : 'Editar' }}
      </BaseButton>
    </header>

    <div v-if="!patient" class="text-center py-20 text-gray-400">Paciente no encontrado</div>

    <div v-else>
      <!-- Tabs -->
      <div class="bg-white border-b border-gray-200 px-4 flex gap-1">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'">
          {{ tab.label }}
          <span v-if="tab.id === 'sessions'" class="ml-1.5 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{{ patientSessions.length }}</span>
        </button>
      </div>

      <!-- Tab: Ficha -->
      <div v-if="activeTab === 'ficha'" class="p-4 mx-auto space-y-4">

        <!-- Info card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div class="flex items-center gap-4">
            <!-- Avatar with profile photo -->
            <div class="relative shrink-0">
              <div @click="showAvatarMenu = !showAvatarMenu"
                class="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl cursor-pointer overflow-hidden ring-2 ring-transparent hover:ring-primary-300 transition-all">
                <img v-if="profilePhotoUrl" :src="profilePhotoUrl" class="w-full h-full object-cover" />
                <span v-else>{{ patient.name[0] }}{{ patient.lastName[0] }}</span>
              </div>
              <!-- Camera icon badge -->
              <div @click="showAvatarMenu = !showAvatarMenu"
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow">
                <svg class="w-3.5 h-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/></svg>
              </div>
              <!-- Avatar menu -->
              <div v-if="showAvatarMenu" class="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden w-44">
                <label class="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/></svg>
                  Sacar foto
                  <input type="file" accept="image/*" capture="user" class="hidden" @change="setProfilePhoto" />
                </label>
                <label class="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-t border-gray-50">
                  <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
                  Elegir de galería
                  <input type="file" accept="image/*" class="hidden" @change="setProfilePhoto" />
                </label>
                <button v-if="profilePhotoUrl" @click="removeProfilePhoto" class="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 border-t border-gray-50">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                  Eliminar foto
                </button>
              </div>
              <!-- Click-outside overlay -->
              <div v-if="showAvatarMenu" class="fixed inset-0 z-10" @click="showAvatarMenu = false" />
            </div>
            <div>
              <p class="text-xl font-bold text-gray-900">{{ patient.name }} {{ patient.lastName }}</p>
              <p v-if="patient.birthDate" class="text-sm text-gray-500">{{ age }} años · {{ formatDateES(patient.birthDate) }}</p>
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
            <div v-if="patient.pathologies" class="pt-1">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Patologías</p>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ patient.pathologies }}</p>
            </div>
            <div v-if="patient.observations" class="pt-1">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Observaciones</p>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ patient.observations }}</p>
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
                <textarea v-model="editForm.medicalHistory" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Patologías</label>
                <textarea v-model="editForm.pathologies" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Ej: Lumbalgia crónica, escoliosis..." />
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Observaciones</label>
                <textarea v-model="editForm.observations" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <BaseButton @click="saveEdit" :loading="saving" loading-text="Guardando..." class="w-full">Guardar cambios</BaseButton>
            </div>
          </template>
        </div>

        <!-- Billing card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold text-gray-900">Facturación</h2>
            <BaseButton v-if="!editingBilling" variant="ghost" size="sm" @click="editingBilling = true">Editar</BaseButton>
          </div>
          <template v-if="!editingBilling">
            <div class="space-y-2">
              <div class="flex justify-between text-sm" v-if="patient.billingRate">
                <span class="text-gray-500">Tarifa por sesión</span>
                <span class="font-medium text-gray-900">{{ patient.billingRate }} €</span>
              </div>
              <div class="flex justify-between text-sm" v-if="patient.billingMethod">
                <span class="text-gray-500">Forma de pago</span>
                <span class="font-medium text-gray-900">{{ patient.billingMethod }}</span>
              </div>
              <div v-if="patient.billingNotes" class="pt-1">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Notas</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ patient.billingNotes }}</p>
              </div>
              <p v-if="!patient.billingRate && !patient.billingMethod && !patient.billingNotes" class="text-sm text-gray-400 text-center py-2">Sin datos de facturación</p>
            </div>
          </template>
          <template v-else>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-sm font-medium text-gray-700">Tarifa por sesión (€)</label>
                  <input v-model.number="billingForm.billingRate" type="number" min="0" step="0.5" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="0" />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Forma de pago</label>
                  <select v-model="billingForm.billingMethod" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Sin especificar</option>
                    <option>Efectivo</option>
                    <option>Tarjeta</option>
                    <option>Transferencia</option>
                    <option>Mutua / seguro</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Notas de facturación</label>
                <textarea v-model="billingForm.billingNotes" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div class="flex gap-2">
                <BaseButton variant="secondary" @click="editingBilling = false" class="flex-1">Cancelar</BaseButton>
                <BaseButton @click="saveBilling" :loading="saving" class="flex-1">Guardar</BaseButton>
              </div>
            </div>
          </template>
        </div>

        <!-- Photos section -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold text-gray-900">Fotos</h2>
            <PhotoPickerButtons @pick="onPatientPhotoPick" />
          </div>
          <div v-if="patient.photos.length === 0" class="text-sm text-gray-400 text-center py-6">Sin fotos</div>
          <div v-else class="grid grid-cols-3 gap-2">
            <PhotoThumbnail v-for="(photo, i) in patient.photos" :key="i"
              :src="photo" removable @remove="removePhoto(i)" @click="openPhoto(photo)" />
          </div>
        </div>
      </div>

      <!-- Tab: Sesiones -->
      <div v-if="activeTab === 'sessions'" class="p-4 mx-auto space-y-3">
        <!-- Filters -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 text-sm">Filtros</h2>
            <button @click="clearSessionFilters" v-if="hasSessionFilters" class="text-xs text-primary-600 hover:underline">Limpiar</button>
          </div>
          <input v-model="sessionFilterTreatment" type="text" placeholder="Buscar por tratamiento..." class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Desde</label>
              <input v-model="sessionFilterFrom" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Hasta</label>
              <input v-model="sessionFilterTo" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">{{ filteredSessions.length }} sesión(es)</p>
          <BaseButton variant="ghost" size="sm" @click="openNewSessionForm">+ Nueva sesión</BaseButton>
        </div>

        <div v-if="filteredSessions.length === 0" class="text-center py-10 text-gray-400 text-sm">
          {{ hasSessionFilters ? 'Sin resultados para los filtros aplicados' : 'Sin sesiones registradas' }}
        </div>
        <div v-else class="space-y-3">
          <div v-for="s in filteredSessions" :key="s.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-medium text-gray-900 text-sm">{{ formatDateES(s.date) }}</span>
                  <span class="text-gray-400 text-sm">·</span>
                  <span class="text-gray-500 text-sm">{{ s.duration }} min</span>
                  <span v-if="s.treatment" class="text-xs bg-primary-50 text-primary-700 rounded-full px-2 py-0.5 font-medium">{{ s.treatment }}</span>
                </div>
              </div>
              <div class="flex gap-1">
                <IconButton @click="openEditSession(s)">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/></svg>
                </IconButton>
                <IconButton variant="danger" @click="deleteSession(s.id)">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>
                </IconButton>
              </div>
            </div>
            <!-- Fields -->
            <div v-if="s.symptoms || s.inspection || s.observations || s.notes" class="space-y-2 border-t border-gray-50 pt-3">
              <div v-if="s.symptoms">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Síntomas</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ s.symptoms }}</p>
              </div>
              <div v-if="s.inspection">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Inspección</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ s.inspection }}</p>
              </div>
              <div v-if="s.observations">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Observaciones</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ s.observations }}</p>
              </div>
              <div v-if="s.notes">
                <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Notas</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ s.notes }}</p>
              </div>
            </div>
            <!-- Session photos -->
            <div v-if="s.photos && s.photos.length > 0" class="border-t border-gray-50 pt-3">
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Fotos de la consulta</p>
              <div class="grid grid-cols-4 gap-1.5">
                <PhotoThumbnail v-for="(photo, i) in s.photos" :key="i"
                  :src="photo" rounded="lg" @click="openPhoto(photo)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Informe -->
      <div v-if="activeTab === 'report'" class="p-4 mx-auto space-y-4">
        <!-- Date filter -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 text-sm">Filtrar período</h2>
            <button @click="clearReportFilters" v-if="hasReportFilters" class="text-xs text-primary-600 hover:underline">Limpiar</button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Desde</label>
              <input v-model="reportFilterFrom" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Hasta</label>
              <input v-model="reportFilterTo" type="date" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p class="text-3xl font-bold text-primary-600">{{ reportSessions.length }}</p>
            <p class="text-xs text-gray-500 mt-1">Sesiones</p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p class="text-3xl font-bold text-green-600">{{ reportTotalMinutes }}</p>
            <p class="text-xs text-gray-500 mt-1">Minutos</p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p class="text-xl font-bold text-orange-500">{{ reportLastSession ?? '—' }}</p>
            <p class="text-xs text-gray-500 mt-1">Última sesión</p>
          </div>
        </div>

        <!-- Session list -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="font-semibold text-gray-900 mb-3">Detalle de sesiones</h2>
          <div v-if="reportSessions.length === 0" class="text-sm text-gray-400 text-center py-4">
            {{ hasReportFilters ? 'Sin sesiones en este período' : 'Sin sesiones registradas' }}
          </div>
          <div v-else class="space-y-2">
            <div v-for="s in reportSessions" :key="s.id" class="border border-gray-100 rounded-xl p-3">
              <div class="flex justify-between text-sm">
                <span class="font-medium text-gray-900">{{ formatDateES(s.date) }}</span>
                <span class="text-gray-500">{{ s.duration }} min</span>
              </div>
              <p v-if="s.treatment" class="text-sm text-primary-700 mt-0.5">{{ s.treatment }}</p>
              <p v-if="s.notes" class="text-sm text-gray-500 mt-0.5">{{ s.notes }}</p>
            </div>
          </div>
        </div>

        <BaseButton variant="ghost" @click="printReport" :disabled="reportSessions.length === 0" class="w-full">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"/></svg>
          Imprimir informe
        </BaseButton>
      </div>

      <!-- Tab: LOPD -->
      <div v-if="activeTab === 'consent'" class="p-4 mx-auto max-w-2xl space-y-4">

        <!-- Physio warning -->
        <div v-if="!appSettings.data.physioConsentSignedAt"
          class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-amber-800">Tú aún no has firmado el consentimiento</p>
            <RouterLink to="/settings" class="text-xs text-amber-600 underline mt-0.5 inline-block">Ir a Configuración para firmarlo</RouterLink>
          </div>
        </div>

        <!-- Patient status: signed -->
        <div v-if="patient.consentSignedAt" class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-2">
          <div class="flex items-center gap-2 text-emerald-700">
            <svg class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold">Consentimiento firmado</span>
          </div>
          <p class="text-sm text-emerald-700">{{ patient.name }} {{ patient.lastName }}</p>
          <p class="text-xs text-emerald-600">{{ formatConsentDate(patient.consentSignedAt) }}</p>
          <button @click="revokeConsent"
            class="text-xs text-red-400 hover:text-red-600 transition-colors mt-2">
            Revocar consentimiento
          </button>
        </div>

        <!-- Patient status: unsigned -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div class="flex items-center gap-2 text-amber-600">
            <svg class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span class="text-sm font-medium">Pendiente de firma</span>
          </div>

          <!-- Consent text preview -->
          <div class="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <pre class="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">{{ appSettings.data.consentText }}</pre>
          </div>

          <label class="flex items-start gap-2.5 cursor-pointer">
            <input v-model="consentChecked" type="checkbox" class="mt-0.5 w-4 h-4 text-primary-600 rounded" />
            <span class="text-sm text-slate-700">
              <strong>{{ patient.name }} {{ patient.lastName }}</strong> ha leído y acepta la política de protección de datos
            </span>
          </label>

          <button @click="signConsent" :disabled="!consentChecked"
            class="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
            :class="consentChecked ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'">
            Registrar consentimiento
          </button>
        </div>
      </div>
    </div>

    <!-- Session form modal (new + edit) -->
    <div v-if="showSessionForm" class="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">{{ editingSessionId ? 'Editar sesión' : 'Nueva sesión' }}</h2>
          <button @click="closeSessionForm" class="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="overflow-y-auto px-6 py-4 space-y-4">
          <!-- Fecha + Duración -->
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
          <!-- Tratamiento -->
          <div>
            <label class="text-sm font-medium text-gray-700">Tratamiento</label>
            <input v-model="sessionForm.treatment" type="text" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Ej: Masaje terapéutico, ejercicios..." />
          </div>
          <!-- Síntomas -->
          <div>
            <label class="text-sm font-medium text-gray-700">Síntomas</label>
            <textarea v-model="sessionForm.symptoms" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Síntomas referidos por el paciente..." />
          </div>
          <!-- Inspección -->
          <div>
            <label class="text-sm font-medium text-gray-700">Inspección</label>
            <textarea v-model="sessionForm.inspection" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Hallazgos en la exploración..." />
          </div>
          <!-- Observaciones -->
          <div>
            <label class="text-sm font-medium text-gray-700">Observaciones</label>
            <textarea v-model="sessionForm.observations" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Observaciones de la consulta..." />
          </div>
          <!-- Notas -->
          <div>
            <label class="text-sm font-medium text-gray-700">Notas</label>
            <textarea v-model="sessionForm.notes" rows="2" class="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <!-- Fotos de la consulta -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700">Fotos de la consulta</label>
              <PhotoPickerButtons size="sm" @pick="onSessionPhotoPick" />
            </div>
            <div v-if="sessionForm.photos.length === 0" class="text-sm text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-xl">Sin fotos</div>
            <div v-else class="grid grid-cols-4 gap-1.5">
              <PhotoThumbnail v-for="(photo, i) in sessionForm.photos" :key="i"
                :src="photo" removable rounded="lg" @remove="removeSessionPhoto(i)" />
            </div>
          </div>
        </div>
        <div class="flex gap-3 px-6 py-4 border-t border-gray-100">
          <BaseButton variant="secondary" @click="closeSessionForm" class="flex-1">Cancelar</BaseButton>
          <BaseButton @click="saveSession" :disabled="!sessionForm.date" :loading="saving" class="flex-1">Guardar</BaseButton>
        </div>
      </div>
    </div>

    <!-- Photo lightbox -->
    <div v-if="lightboxPhoto" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" @click="lightboxPhoto = null">
      <img :src="lightboxPhoto" class="max-w-full max-h-full rounded-xl object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useSessionsStore } from '@/stores/sessions'
import type { Session } from '@/types'
import BaseButton from '@/components/BaseButton.vue'
import IconButton from '@/components/IconButton.vue'
import PhotoPickerButtons from '@/components/PhotoPickerButtons.vue'
import PhotoThumbnail from '@/components/PhotoThumbnail.vue'
import { formatDateES } from '@/utils/format'
import { useAppSettingsStore } from '@/stores/appSettings'
import { uploadPhoto, deletePhoto, getPhotoUrl } from '@/lib/photos'

const route = useRoute()
const router = useRouter()
const patientsStore = usePatientsStore()
const sessionsStore = useSessionsStore()
const appSettings = useAppSettingsStore()

const consentChecked = ref(false)

async function signConsent() {
  if (!consentChecked.value || !patient.value) return
  await patientsStore.update(patient.value.id, { consentSignedAt: new Date().toISOString() })
  consentChecked.value = false
}

async function revokeConsent() {
  if (!patient.value) return
  if (!confirm('¿Revocar el consentimiento de este paciente?')) return
  await patientsStore.update(patient.value.id, { consentSignedAt: undefined })
}

function formatConsentDate(iso: string) {
  const d = new Date(iso)
  return `${formatDateES(iso.slice(0, 10))} a las ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h`
}

const editing = ref(false)
const editingBilling = ref(false)
const showSessionForm = ref(false)
const editingSessionId = ref<string | null>(null)
const saving = ref(false)
const validTabs = ['ficha', 'sessions', 'report', 'consent'] as const
const activeTab = ref<typeof validTabs[number]>(
  validTabs.includes(route.query.tab as typeof validTabs[number]) ? (route.query.tab as typeof validTabs[number]) : 'ficha'
)
const lightboxPhoto = ref<string | null>(null)
const showAvatarMenu = ref(false)

const profilePhotoUrl = ref<string | null>(null)

// Resolver la URL firmada del avatar cuando cambia el paciente
watch(() => patient.value?.avatarPath, async (path) => {
  if (!path) { profilePhotoUrl.value = null; return }
  try {
    profilePhotoUrl.value = await getPhotoUrl(path)
  } catch {
    profilePhotoUrl.value = null
  }
}, { immediate: true })

async function setProfilePhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !patient.value) return
  showAvatarMenu.value = false
  try {
    // Borrar avatar anterior si existe
    if (patient.value.avatarPath) {
      await deletePhoto(patient.value.avatarPath).catch(() => {})
    }
    const path = await uploadPhoto(file, `avatars/${patient.value.id}`)
    await patientsStore.update(patient.value.id, { avatarPath: path })
    profilePhotoUrl.value = await getPhotoUrl(path)
  } catch {
    alert('Error al guardar la foto de perfil')
  }
}

async function removeProfilePhoto() {
  if (!patient.value) return
  showAvatarMenu.value = false
  try {
    if (patient.value.avatarPath) {
      await deletePhoto(patient.value.avatarPath).catch(() => {})
    }
    await patientsStore.update(patient.value.id, { avatarPath: undefined })
    profilePhotoUrl.value = null
  } catch {
    alert('Error al eliminar la foto de perfil')
  }
}

const tabs = [
  { id: 'ficha', label: 'Ficha' },
  { id: 'sessions', label: 'Sesiones' },
  { id: 'report', label: 'Informe' },
  { id: 'consent', label: 'LOPD' },
] as const

const patient = computed(() => patientsStore.getById(route.params.id as string))

// ── Patient edit form ────────────────────────────────────────────
const editForm = reactive({
  name: '', lastName: '', phone: '', email: '', medicalHistory: '', pathologies: '', observations: '',
})

watch(patient, (p) => {
  if (p) Object.assign(editForm, {
    name: p.name, lastName: p.lastName, phone: p.phone, email: p.email,
    medicalHistory: p.medicalHistory, pathologies: p.pathologies, observations: p.observations,
  })
}, { immediate: true })

const age = computed(() => {
  if (!patient.value?.birthDate) return ''
  const diff = Date.now() - new Date(patient.value.birthDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
})

async function saveEdit() {
  saving.value = true
  try {
    await patientsStore.update(patient.value!.id, { ...editForm })
    editing.value = false
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
      alert('Ya existe otro paciente con ese email')
    } else {
      alert('Error al guardar los cambios')
    }
  } finally {
    saving.value = false
  }
}

// ── Billing form ─────────────────────────────────────────────────
const billingForm = reactive({ billingRate: 0, billingMethod: '', billingNotes: '' })

watch(patient, (p) => {
  if (p) Object.assign(billingForm, {
    billingRate: p.billingRate, billingMethod: p.billingMethod, billingNotes: p.billingNotes,
  })
}, { immediate: true })

async function saveBilling() {
  saving.value = true
  try {
    await patientsStore.update(patient.value!.id, { ...billingForm })
    editingBilling.value = false
  } catch {
    alert('Error al guardar la facturación')
  } finally {
    saving.value = false
  }
}

// ── Patient photos ───────────────────────────────────────────────
const uploadingPhoto = ref(false)

async function onPatientPhotoPick(files: FileList) {
  if (!patient.value) return
  uploadingPhoto.value = true
  try {
    const subfolder = `patients/${patient.value.id}`
    const paths = await Promise.all(
      Array.from(files).map(file => uploadPhoto(file, subfolder))
    )
    await patientsStore.update(patient.value.id, { photos: [...patient.value.photos, ...paths] })
  } catch {
    alert('Error al guardar la foto')
  } finally {
    uploadingPhoto.value = false
  }
}

async function removePhoto(index: number) {
  const removed = patient.value!.photos[index]
  const photos = [...patient.value!.photos]
  photos.splice(index, 1)
  try {
    await patientsStore.update(patient.value!.id, { photos })
    await deletePhoto(removed).catch(() => {})
  } catch {
    alert('Error al eliminar la foto')
  }
}

// ── Sessions ─────────────────────────────────────────────────────
const patientSessions = computed(() => sessionsStore.byPatient(route.params.id as string))

const sessionFilterTreatment = ref('')
const sessionFilterFrom = ref('')
const sessionFilterTo = ref('')

const hasSessionFilters = computed(() =>
  sessionFilterTreatment.value !== '' || sessionFilterFrom.value !== '' || sessionFilterTo.value !== ''
)

const filteredSessions = computed(() =>
  patientSessions.value.filter(s => {
    if (sessionFilterTreatment.value && !s.treatment?.toLowerCase().includes(sessionFilterTreatment.value.toLowerCase())) return false
    if (sessionFilterFrom.value && s.date < sessionFilterFrom.value) return false
    if (sessionFilterTo.value && s.date > sessionFilterTo.value) return false
    return true
  })
)

function clearSessionFilters() {
  sessionFilterTreatment.value = ''
  sessionFilterFrom.value = ''
  sessionFilterTo.value = ''
}

const emptySessionForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  duration: 45,
  treatment: '',
  symptoms: '',
  inspection: '',
  observations: '',
  notes: '',
  photos: [] as string[],
})

const sessionForm = reactive(emptySessionForm())

function openNewSessionForm() {
  editingSessionId.value = null
  Object.assign(sessionForm, emptySessionForm())
  showSessionForm.value = true
}

function openEditSession(s: Session) {
  editingSessionId.value = s.id
  Object.assign(sessionForm, {
    date: s.date,
    duration: s.duration,
    treatment: s.treatment,
    symptoms: s.symptoms,
    inspection: s.inspection,
    observations: s.observations,
    notes: s.notes,
    photos: [...s.photos],
  })
  showSessionForm.value = true
}

function closeSessionForm() {
  showSessionForm.value = false
  editingSessionId.value = null
}

let openedSessionFromQuery = false
watch(patientSessions, (list) => {
  if (openedSessionFromQuery || !route.query.session) return
  const target = list.find(s => s.id === route.query.session)
  if (target) {
    openEditSession(target)
    openedSessionFromQuery = true
  }
}, { immediate: true })

async function onSessionPhotoPick(files: FileList) {
  uploadingPhoto.value = true
  try {
    const paths = await Promise.all(
      Array.from(files).map(file => uploadPhoto(file, 'sessions'))
    )
    sessionForm.photos.push(...paths)
  } catch {
    alert('Error al subir la foto')
  } finally {
    uploadingPhoto.value = false
  }
}

async function removeSessionPhoto(index: number) {
  const [removed] = sessionForm.photos.splice(index, 1)
  await deletePhoto(removed).catch(() => {})
}

async function saveSession() {
  saving.value = true
  try {
    if (editingSessionId.value) {
      await sessionsStore.update(editingSessionId.value, { ...sessionForm })
    } else {
      await sessionsStore.add({ patientId: patient.value!.id, ...sessionForm })
    }
    closeSessionForm()
  } catch {
    alert('Error al guardar la sesión')
  } finally {
    saving.value = false
  }
}

async function deleteSession(id: string) {
  if (!confirm('¿Eliminar esta sesión?')) return
  try {
    const photos = sessionsStore.sessions.find(s => s.id === id)?.photos ?? []
    await sessionsStore.remove(id)
    await Promise.all(photos.map(p => deletePhoto(p).catch(() => {})))
  } catch {
    alert('Error al eliminar la sesión')
  }
}

async function openPhoto(src: string) {
  try {
    lightboxPhoto.value = await getPhotoUrl(src)
  } catch {
    lightboxPhoto.value = src
  }
}

// ── Report ───────────────────────────────────────────────────────
const reportFilterFrom = ref('')
const reportFilterTo = ref('')

const hasReportFilters = computed(() => reportFilterFrom.value !== '' || reportFilterTo.value !== '')

const reportSessions = computed(() =>
  patientSessions.value.filter(s => {
    if (reportFilterFrom.value && s.date < reportFilterFrom.value) return false
    if (reportFilterTo.value && s.date > reportFilterTo.value) return false
    return true
  })
)

const reportTotalMinutes = computed(() => reportSessions.value.reduce((acc, s) => acc + s.duration, 0))
const reportLastSession = computed(() => reportSessions.value[0]?.date ?? null)

function clearReportFilters() {
  reportFilterFrom.value = ''
  reportFilterTo.value = ''
}

function printReport() {
  const p = patient.value!
  const sessions = reportSessions.value
  const periodLine = reportFilterFrom.value || reportFilterTo.value
    ? `Período: ${reportFilterFrom.value || '—'} al ${reportFilterTo.value || '—'}`
    : 'Período: completo'
  const lines = [
    `INFORME DE PACIENTE`,
    `===================`,
    `Nombre: ${p.name} ${p.lastName}`,
    `DNI: ${p.dni || '—'}`,
    `Teléfono: ${p.phone || '—'}`,
    `Antecedentes: ${p.medicalHistory || '—'}`,
    `Patologías: ${p.pathologies || '—'}`,
    ``,
    periodLine,
    `Sesiones: ${sessions.length} | Tiempo total: ${reportTotalMinutes.value} min`,
    ``,
    `DETALLE DE SESIONES`,
    `-------------------`,
    ...sessions.flatMap(s => [
      `${s.date} | ${s.duration}min | ${s.treatment || ''}`,
      s.symptoms    ? `  Síntomas: ${s.symptoms}` : '',
      s.inspection  ? `  Inspección: ${s.inspection}` : '',
      s.observations ? `  Observaciones: ${s.observations}` : '',
      s.notes       ? `  Notas: ${s.notes}` : '',
      '',
    ].filter(Boolean)),
  ]
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<pre style="font-family:monospace;padding:2rem;white-space:pre-wrap">${lines.join('\n')}</pre>`)
  win.document.close()
  win.print()
}
</script>
