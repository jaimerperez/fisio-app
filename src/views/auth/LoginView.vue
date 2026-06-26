<template>
  <div class="min-h-screen flex">
    <!-- Left panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-slate-800 flex-col justify-between p-12">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">F</div>
        <span class="text-2xl font-bold text-white tracking-tight">FisioApp</span>
      </div>
      <div>
        <h2 class="text-4xl font-bold text-white leading-tight mb-4">Gestiona tu clínica<br/>de forma eficiente</h2>
        <p class="text-primary-200 text-lg leading-relaxed">Pacientes, citas y sesiones<br/>en un solo lugar.</p>
      </div>
      <p class="text-primary-300 text-sm">© 2025 FisioApp</p>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center bg-slate-50 p-8">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <div class="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">F</div>
          <span class="text-xl font-bold text-slate-800">FisioApp</span>
        </div>

        <h1 class="text-2xl font-bold text-slate-900 mb-1">Bienvenido</h1>
        <p class="text-slate-500 text-sm mb-8">Inicia sesión para continuar</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          <p v-if="errorMsg" class="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{{ errorMsg }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const loginEmail = import.meta.env.VITE_LOGIN_EMAIL as string
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.signIn(loginEmail, password.value)
    router.push('/')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
