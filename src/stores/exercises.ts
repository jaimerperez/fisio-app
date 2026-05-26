import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Exercise, ExerciseFolder } from '@/types'
import { saveFile, deleteFile } from '@/db/exerciseFiles'

const FOLDERS_KEY = 'fisioapp_exercise_folders'
const EXERCISES_KEY = 'fisioapp_exercises'

export const useExercisesStore = defineStore('exercises', () => {
  const folders = ref<ExerciseFolder[]>(JSON.parse(localStorage.getItem(FOLDERS_KEY) || '[]'))
  const exercises = ref<Exercise[]>(JSON.parse(localStorage.getItem(EXERCISES_KEY) || '[]'))

  function saveFolders() {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders.value))
  }

  function saveExercises() {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises.value))
  }

  function addFolder(name: string): ExerciseFolder {
    const folder: ExerciseFolder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }
    folders.value.push(folder)
    saveFolders()
    return folder
  }

  function removeFolder(id: string) {
    exercises.value.forEach(e => { if (e.folderId === id) e.folderId = null })
    folders.value = folders.value.filter(f => f.id !== id)
    saveFolders()
    saveExercises()
  }

  async function addExercise(file: File, folderId: string | null): Promise<Exercise> {
    const exercise: Exercise = {
      id: crypto.randomUUID(),
      folderId,
      name: file.name.replace(/\.[^.]+$/, ''),
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      createdAt: new Date().toISOString(),
    }
    await saveFile(exercise.id, file)
    exercises.value.push(exercise)
    saveExercises()
    return exercise
  }

  async function removeExercise(id: string) {
    await deleteFile(id)
    exercises.value = exercises.value.filter(e => e.id !== id)
    saveExercises()
  }

  return { folders, exercises, addFolder, removeFolder, addExercise, removeExercise }
})
