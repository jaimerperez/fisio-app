import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Appointment } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

type DbRow = {
  id: string
  user_id: string
  patient_id: string
  date: string
  time: string
  duration: number | null
  notes: string | null
  status: string
  created_at: string
}

function fromDb(row: DbRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.date,
    time: row.time,
    duration: row.duration ?? 0,
    notes: row.notes ?? '',
    status: row.status as Appointment['status'],
    createdAt: row.created_at,
  }
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('appointments')
      .select('*')
      .order('date')
    if (err) { error.value = err.message; loading.value = false; return }
    appointments.value = (data as DbRow[]).map(fromDb)
    loading.value = false
  }

  async function add(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const authStore = useAuthStore()
    const { data: row, error: err } = await supabase
      .from('appointments')
      .insert({
        user_id: authStore.userId,
        patient_id: data.patientId,
        date: data.date,
        time: data.time,
        duration: data.duration || null,
        notes: data.notes || null,
        status: data.status,
      })
      .select()
      .single()
    if (err) throw err
    const item = fromDb(row as DbRow)
    appointments.value.push(item)
    return item
  }

  async function update(id: string, data: Partial<Appointment>) {
    const dbData: Record<string, unknown> = {}
    if (data.patientId !== undefined) dbData.patient_id = data.patientId
    if (data.date !== undefined) dbData.date = data.date
    if (data.time !== undefined) dbData.time = data.time
    if (data.duration !== undefined) dbData.duration = data.duration || null
    if (data.notes !== undefined) dbData.notes = data.notes || null
    if (data.status !== undefined) dbData.status = data.status

    const { data: row, error: err } = await supabase
      .from('appointments')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = appointments.value.findIndex(a => a.id === id)
    if (idx !== -1) appointments.value[idx] = fromDb(row as DbRow)
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('appointments').delete().eq('id', id)
    if (err) throw err
    appointments.value = appointments.value.filter(a => a.id !== id)
  }

  function byDate(date: string) {
    return appointments.value
      .filter(a => a.date === date)
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  function byPatient(patientId: string) {
    return appointments.value
      .filter(a => a.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  return { appointments, loading, error, fetchAll, add, update, remove, byDate, byPatient }
})
