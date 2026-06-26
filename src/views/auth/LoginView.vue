<template>
  <div class="min-h-screen flex">
    <!-- Left panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-slate-800 flex-col justify-between p-12">
      <div></div>
      <div class="flex flex-col items-center">
        <BrandLogo class-name="w-64 text-white" />
        <p class="text-primary-200 text-lg leading-relaxed mt-6 text-center">Pacientes, citas y sesiones<br/>en un solo lugar.</p>
      </div>
      <p class="text-primary-300 text-sm">© 2025 Carlos Rodríguez Fisioterapia</p>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center bg-slate-50 p-8">
      <div class="w-full max-w-sm">
        <!-- Mobile logo -->
        <div class="lg:hidden mb-8">
          <BrandLogo class-name="w-48 text-slate-800" />
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
import BrandLogo from '@/components/BrandLogo.vue'
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
