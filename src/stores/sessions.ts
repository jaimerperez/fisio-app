import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session } from '@/types'

const STORAGE_KEY = 'fisio_sessions'

function load(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>(load())

  const total = computed(() => sessions.value.length)

  function add(data: Omit<Session, 'id' | 'createdAt'>): Session {
    const session: Session = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    sessions.value.push(session)
    save(sessions.value)
    return session
  }

  function update(id: string, data: Partial<Session>) {
    const idx = sessions.value.findIndex(s => s.id === id)
    if (idx === -1) return
    sessions.value[idx] = { ...sessions.value[idx], ...data }
    save(sessions.value)
  }

  function remove(id: string) {
    sessions.value = sessions.value.filter(s => s.id !== id)
    save(sessions.value)
  }

  function byPatient(patientId: string) {
    return sessions.value
      .filter(s => s.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return { sessions, total, add, update, remove, byPatient }
})
