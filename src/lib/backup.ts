import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { useSessionsStore } from '@/stores/sessions'
import { useExercisesStore } from '@/stores/exercises'
import { useAppSettingsStore } from '@/stores/appSettings'

export interface BackupFile {
  app: 'fisio-app'
  version: 1
  exportedAt: string
  counts: {
    patients: number
    appointments: number
    sessions: number
    exerciseFolders: number
    exercises: number
  }
  data: {
    patients: unknown[]
    appointments: unknown[]
    sessions: unknown[]
    exerciseFolders: unknown[]
    exercises: unknown[]
    settings: unknown
  }
}

/** Construye el objeto de copia de seguridad a partir de los stores cargados. */
export function buildBackup(): BackupFile {
  const patients = usePatientsStore()
  const appointments = useAppointmentsStore()
  const sessions = useSessionsStore()
  const exercises = useExercisesStore()
  const settings = useAppSettingsStore()

  return {
    app: 'fisio-app',
    version: 1,
    exportedAt: new Date().toISOString(),
    counts: {
      patients: patients.patients.length,
      appointments: appointments.appointments.length,
      sessions: sessions.sessions.length,
      exerciseFolders: exercises.folders.length,
      exercises: exercises.exercises.length,
    },
    data: {
      patients: patients.patients,
      appointments: appointments.appointments,
      sessions: sessions.sessions,
      exerciseFolders: exercises.folders,
      exercises: exercises.exercises,
      settings: settings.data,
    },
  }
}

/** Genera y descarga la copia de seguridad como archivo JSON. */
export function downloadBackup(): void {
  const backup = buildBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `fisioapp-backup-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
