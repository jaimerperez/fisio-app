export interface Patient {
  id: string
  name: string
  lastName: string
  birthDate: string
  phone: string
  email: string
  dni: string
  medicalHistory: string
  pathologies: string       // patologías del paciente
  observations: string      // observaciones generales
  billingRate: number       // tarifa por sesión (€)
  billingMethod: string     // forma de pago
  billingNotes: string      // notas de facturación
  photos: string[]          // base64 o URLs
  consentSignedAt?: string  // fecha y hora de firma del consentimiento LOPD
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  patientId: string
  date: string
  duration: number          // minutos
  treatment: string
  symptoms: string          // síntomas en esta consulta
  inspection: string        // inspección en esta consulta
  observations: string      // observaciones de esta consulta
  notes: string
  photos: string[]          // fotos tomadas en esta consulta (base64)
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

export interface ExerciseFolder {
  id: string
  name: string
  createdAt: string
}

export interface Exercise {
  id: string
  folderId: string | null
  name: string
  mimeType: string
  size: number
  createdAt: string
}
