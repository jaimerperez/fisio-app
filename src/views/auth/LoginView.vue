<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold text-primary-700 mb-2 text-center">FisioApp</h1>
      <p class="text-gray-500 text-center mb-8 text-sm">Inicia sesión para continuar</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <p v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await authStore.signIn(email.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
