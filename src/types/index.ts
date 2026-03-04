export interface Patient {
  id: string
  name: string
  lastName: string
  birthDate: string
  phone: string
  email: string
  dni: string
  medicalHistory: string
  photos: string[]  // base64 o URLs
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  patientId: string
  date: string
  duration: number  // minutos
  notes: string
  treatment: string
  nextSession?: string
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  date: string       // ISO date string
  time: string       // HH:mm
  duration: number   // minutos
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}
