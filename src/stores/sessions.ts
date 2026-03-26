import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

type DbRow = {
  id: string
  user_id: string
  patient_id: string
  date: string
  duration: number | null
  notes: string | null
  treatment: string | null
  next_session: string | null
  created_at: string
}

function fromDb(row: DbRow): Session {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.date,
    duration: row.duration ?? 0,
    notes: row.notes ?? '',
    treatment: row.treatment ?? '',
    nextSession: row.next_session ?? undefined,
    createdAt: row.created_at,
  }
}

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const total = computed(() => sessions.value.length)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false })
    if (err) { error.value = err.message; loading.value = false; return }
    sessions.value = (data as DbRow[]).map(fromDb)
    loading.value = false
  }

  async function add(data: Omit<Session, 'id' | 'createdAt'>): Promise<Session> {
    const authStore = useAuthStore()
    const { data: row, error: err } = await supabase
      .from('sessions')
      .insert({
        user_id: authStore.userId,
        patient_id: data.patientId,
        date: data.date,
        duration: data.duration || null,
        notes: data.notes || null,
        treatment: data.treatment || null,
        next_session: data.nextSession || null,
      })
      .select()
      .single()
    if (err) throw err
    const session = fromDb(row as DbRow)
    sessions.value.unshift(session)
    return session
  }

  async function update(id: string, data: Partial<Session>) {
    const dbData: Record<string, unknown> = {}
    if (data.patientId !== undefined) dbData.patient_id = data.patientId
    if (data.date !== undefined) dbData.date = data.date
    if (data.duration !== undefined) dbData.duration = data.duration || null
    if (data.notes !== undefined) dbData.notes = data.notes || null
    if (data.treatment !== undefined) dbData.treatment = data.treatment || null
    if (data.nextSession !== undefined) dbData.next_session = data.nextSession || null

    const { data: row, error: err } = await supabase
      .from('sessions')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = sessions.value.findIndex(s => s.id === id)
    if (idx !== -1) sessions.value[idx] = fromDb(row as DbRow)
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('sessions').delete().eq('id', id)
    if (err) throw err
    sessions.value = sessions.value.filter(s => s.id !== id)
  }

  function byPatient(patientId: string) {
    return sessions.value
      .filter(s => s.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return { sessions, loading, error, total, fetchAll, add, update, remove, byPatient }
})
