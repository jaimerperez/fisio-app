import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Patient } from '@/types'

const STORAGE_KEY = 'fisio_patients'

function load(): Patient[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(patients: Patient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
}

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref<Patient[]>(load())

  const total = computed(() => patients.value.length)

  function add(data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const now = new Date().toISOString()
    const patient: Patient = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    patients.value.push(patient)
    save(patients.value)
    return patient
  }

  function update(id: string, data: Partial<Patient>) {
    const idx = patients.value.findIndex(p => p.id === id)
    if (idx === -1) return
    patients.value[idx] = { ...patients.value[idx], ...data, updatedAt: new Date().toISOString() }
    save(patients.value)
  }

  function remove(id: string) {
    patients.value = patients.value.filter(p => p.id !== id)
    save(patients.value)
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

  return { patients, total, add, update, remove, getById, search }
})
