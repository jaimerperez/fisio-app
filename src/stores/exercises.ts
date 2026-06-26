import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Exercise, ExerciseFolder } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const BUCKET = 'exercises'

type FolderRow = { id: string; user_id: string; name: string; created_at: string }
type ExerciseRow = {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  mime_type: string
  size: number
  path: string
  created_at: string
}

function folderFromDb(r: FolderRow): ExerciseFolder {
  return { id: r.id, name: r.name, createdAt: r.created_at }
}

function exerciseFromDb(r: ExerciseRow): Exercise {
  return {
    id: r.id,
    folderId: r.folder_id,
    name: r.name,
    mimeType: r.mime_type,
    size: r.size,
    path: r.path,
    createdAt: r.created_at,
  }
}

export const useExercisesStore = defineStore('exercises', () => {
  const folders = ref<ExerciseFolder[]>([])
  const exercises = ref<Exercise[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const [foldersRes, exercisesRes] = await Promise.all([
      supabase.from('exercise_folders').select('*').order('name'),
      supabase.from('exercises').select('*').order('created_at', { ascending: false }),
    ])
    if (foldersRes.error) error.value = foldersRes.error.message
    else folders.value = (foldersRes.data as FolderRow[]).map(folderFromDb)
    if (exercisesRes.error) error.value = exercisesRes.error.message
    else exercises.value = (exercisesRes.data as ExerciseRow[]).map(exerciseFromDb)
    loading.value = false
  }

  async function addFolder(name: string): Promise<ExerciseFolder> {
    const auth = useAuthStore()
    const { data, error: err } = await supabase
      .from('exercise_folders')
      .insert({ user_id: auth.userId, name })
      .select()
      .single()
    if (err) throw err
    const folder = folderFromDb(data as FolderRow)
    folders.value.push(folder)
    return folder
  }

  async function removeFolder(id: string) {
    // Mover ejercicios de la carpeta a "sin carpeta"
    const { error: updErr } = await supabase
      .from('exercises')
      .update({ folder_id: null })
      .eq('folder_id', id)
    if (updErr) throw updErr
    const { error: err } = await supabase.from('exercise_folders').delete().eq('id', id)
    if (err) throw err
    exercises.value.forEach(e => { if (e.folderId === id) e.folderId = null })
    folders.value = folders.value.filter(f => f.id !== id)
  }

  async function addExercise(file: File, folderId: string | null): Promise<Exercise> {
    const auth = useAuthStore()
    const uid = auth.userId
    if (!uid) throw new Error('No autenticado')
    const extMatch = file.name.match(/\.[^.]+$/)
    const ext = extMatch ? extMatch[0].toLowerCase() : ''
    const path = `${uid}/${crypto.randomUUID()}${ext}`
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })
    if (upErr) throw upErr

    const { data, error: err } = await supabase
      .from('exercises')
      .insert({
        user_id: uid,
        folder_id: folderId,
        name: file.name.replace(/\.[^.]+$/, ''),
        mime_type: file.type || 'application/octet-stream',
        size: file.size,
        path,
      })
      .select()
      .single()
    if (err) {
      // rollback del archivo subido si falla la fila
      await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
      throw err
    }
    const exercise = exerciseFromDb(data as ExerciseRow)
    exercises.value.unshift(exercise)
    return exercise
  }

  async function removeExercise(id: string) {
    const ex = exercises.value.find(e => e.id === id)
    const { error: err } = await supabase.from('exercises').delete().eq('id', id)
    if (err) throw err
    if (ex) await supabase.storage.from(BUCKET).remove([ex.path]).catch(() => {})
    exercises.value = exercises.value.filter(e => e.id !== id)
  }

  /** URL firmada para previsualizar un ejercicio (válida 1h). */
  async function fileUrl(path: string): Promise<string | null> {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60)
    return data?.signedUrl ?? null
  }

  /** Descarga el archivo de un ejercicio como Blob. */
  async function downloadBlob(path: string): Promise<Blob | null> {
    const { data } = await supabase.storage.from(BUCKET).download(path)
    return data ?? null
  }

  return {
    folders, exercises, loading, error,
    fetchAll, addFolder, removeFolder, addExercise, removeExercise, fileUrl, downloadBlob,
  }
})
