import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Patient } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

type DbRow = {
  id: string
  user_id: string
  name: string
  last_name: string
  birth_date: string | null
  phone: string | null
  email: string | null
  dni: string | null
  medical_history: string | null
  pathologies: string | null
  observations: string | null
  billing_rate: number | null
  billing_method: string | null
  billing_notes: string | null
  consent_signed_at: string | null
  avatar_path: string | null
  photos: string[]
  created_at: string
  updated_at: string
}

function fromDb(row: DbRow): Patient {
  return {
    id: row.id,
    name: row.name,
    lastName: row.last_name,
    birthDate: row.birth_date ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    dni: row.dni ?? '',
    medicalHistory: row.medical_history ?? '',
    pathologies: row.pathologies ?? '',
    observations: row.observations ?? '',
    billingRate: row.billing_rate ?? 0,
    billingMethod: row.billing_method ?? '',
    billingNotes: row.billing_notes ?? '',
    consentSignedAt: row.consent_signed_at ?? undefined,
    avatarPath: row.avatar_path ?? undefined,
    photos: row.photos ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref<Patient[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const total = computed(() => patients.value.length)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('patients')
      .select('*')
      .order('last_name')
    if (err) { error.value = err.message; loading.value = false; return }
    patients.value = (data as DbRow[]).map(fromDb)
    loading.value = false
  }

  async function add(data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    if (data.email) {
      const emailLower = data.email.toLowerCase()
      if (patients.value.some(p => p.email?.toLowerCase() === emailLower)) {
        throw new Error('EMAIL_TAKEN')
      }
    }
    const authStore = useAuthStore()
    const { data: row, error: err } = await supabase
      .from('patients')
      .insert({
        user_id: authStore.userId,
        name: data.name,
        last_name: data.lastName,
        birth_date: data.birthDate || null,
        phone: data.phone || null,
        email: data.email || null,
        dni: data.dni || null,
        medical_history: data.medicalHistory || null,
        pathologies: data.pathologies || null,
        observations: data.observations || null,
        billing_rate: data.billingRate || null,
        billing_method: data.billingMethod || null,
        billing_notes: data.billingNotes || null,
        consent_signed_at: data.consentSignedAt || null,
        avatar_path: data.avatarPath || null,
        photos: data.photos ?? [],
      })
      .select()
      .single()
    if (err) throw err
    const patient = fromDb(row as DbRow)
    patients.value.push(patient)
    return patient
  }

  async function update(id: string, data: Partial<Patient>) {
    if (data.email) {
      const emailLower = data.email.toLowerCase()
      if (patients.value.some(p => p.id !== id && p.email?.toLowerCase() === emailLower)) {
        throw new Error('EMAIL_TAKEN')
      }
    }
    const dbData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.name !== undefined) dbData.name = data.name
    if (data.lastName !== undefined) dbData.last_name = data.lastName
    if (data.birthDate !== undefined) dbData.birth_date = data.birthDate || null
    if (data.phone !== undefined) dbData.phone = data.phone || null
    if (data.email !== undefined) dbData.email = data.email || null
    if (data.dni !== undefined) dbData.dni = data.dni || null
    if (data.medicalHistory !== undefined) dbData.medical_history = data.medicalHistory || null
    if (data.pathologies !== undefined) dbData.pathologies = data.pathologies || null
    if (data.observations !== undefined) dbData.observations = data.observations || null
    if (data.billingRate !== undefined) dbData.billing_rate = data.billingRate || null
    if (data.billingMethod !== undefined) dbData.billing_method = data.billingMethod || null
    if (data.billingNotes !== undefined) dbData.billing_notes = data.billingNotes || null
    if (data.consentSignedAt !== undefined) dbData.consent_signed_at = data.consentSignedAt || null
    if (data.avatarPath !== undefined) dbData.avatar_path = data.avatarPath || null
    if (data.photos !== undefined) dbData.photos = data.photos

    const { data: row, error: err } = await supabase
      .from('patients')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = patients.value.findIndex(p => p.id === id)
    if (idx !== -1) patients.value[idx] = fromDb(row as DbRow)
  }

  async function remove(id: string) {
    const { error: err } = await supabase.from('patients').delete().eq('id', id)
    if (err) throw err
    patients.value = patients.value.filter(p => p.id !== id)
  }

  function getById(id: string) {
    return patients.value.find(p => p.id === id)
  }

  function search(query: string) {
    const q = query.toLowerCase()
    return patients.value.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.dni?.toLowerCase().includes(q)
    )
  }

  return { patients, loading, error, total, fetchAll, add, update, remove, getById, search }
})
