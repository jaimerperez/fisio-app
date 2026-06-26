import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const BUCKET = 'patient-photos'
const MAX_DIMENSION = 1600   // px — lado mayor tras redimensionar
const QUALITY = 0.8          // calidad JPEG
const SIGN_TTL = 60 * 60     // segundos de validez de la URL firmada

// Caché de URLs firmadas para no re-firmar en cada render
const urlCache = new Map<string, { url: string; expires: number }>()

/**
 * Valores "heredados" que no son rutas de Storage:
 * base64 (data:), URLs absolutas o blobs. Se muestran tal cual
 * y no se intentan borrar/firmar (compatibilidad con fotos antiguas).
 */
function isLegacy(value: string): boolean {
  return (
    value.startsWith('data:') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:')
  )
}

/** Redimensiona y comprime una imagen a JPEG antes de subirla. */
export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // formato no soportado por el navegador → subir original
  }
  let { width, height } = bitmap
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) { bitmap.close?.(); return file }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', QUALITY)
  })
}

/**
 * Sube una foto al bucket privado y devuelve su ruta (path) de Storage.
 * El primer segmento de la ruta es el user_id (requerido por las políticas RLS).
 * @param subfolder p.ej. `patients/<id>` o `sessions`
 */
export async function uploadPhoto(file: File, subfolder: string): Promise<string> {
  const auth = useAuthStore()
  const uid = auth.userId
  if (!uid) throw new Error('No autenticado')
  const blob = await compressImage(file)
  const path = `${uid}/${subfolder}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  return path
}

/** Borra una foto del Storage (no-op para valores heredados base64/URL). */
export async function deletePhoto(value: string): Promise<void> {
  if (!value || isLegacy(value)) return
  urlCache.delete(value)
  await supabase.storage.from(BUCKET).remove([value])
}

/** Devuelve una URL mostrable para una ruta de Storage (o el propio valor si es heredado). */
export async function getPhotoUrl(value: string): Promise<string> {
  if (!value || isLegacy(value)) return value
  const now = Date.now()
  const cached = urlCache.get(value)
  if (cached && cached.expires > now) return cached.url
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(value, SIGN_TTL)
  if (error || !data) throw error ?? new Error('No se pudo obtener la URL de la foto')
  // Renovar 60s antes de que caduque realmente
  urlCache.set(value, { url: data.signedUrl, expires: now + (SIGN_TTL - 60) * 1000 })
  return data.signedUrl
}
