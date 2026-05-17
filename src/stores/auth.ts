import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const loading = ref(true)

  const userId = computed(() => session.value?.user?.id ?? null)
  const isAuthenticated = computed(() => !!session.value)

  // Promise que se resuelve cuando el auth está listo
  let _resolveReady!: () => void
  const ready = new Promise<void>(resolve => { _resolveReady = resolve })

  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    loading.value = false
    _resolveReady()

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
    })
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    session.value = null
  }

  return { session, loading, ready, userId, isAuthenticated, init, signIn, signOut }
})
