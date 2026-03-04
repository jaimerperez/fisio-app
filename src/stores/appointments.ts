import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Appointment } from '@/types'

const STORAGE_KEY = 'fisio_appointments'

function load(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(items: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>(load())

  function add(data: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const item: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    appointments.value.push(item)
    save(appointments.value)
    return item
  }

  function update(id: string, data: Partial<Appointment>) {
    const idx = appointments.value.findIndex(a => a.id === id)
    if (idx === -1) return
    appointments.value[idx] = { ...appointments.value[idx], ...data }
    save(appointments.value)
  }

  function remove(id: string) {
    appointments.value = appointments.value.filter(a => a.id !== id)
    save(appointments.value)
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

  return { appointments, add, update, remove, byDate, byPatient }
})
