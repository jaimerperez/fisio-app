import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const DEFAULT_CONSENT = `CONSENTIMIENTO INFORMADO PARA EL TRATAMIENTO DE DATOS PERSONALES

De acuerdo con el Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPD-GDD), le informamos:

RESPONSABLE DEL TRATAMIENTO
Los datos personales recabados serán tratados por el/la fisioterapeuta responsable de esta clínica.

FINALIDAD
La gestión de su historial clínico, seguimiento de tratamientos fisioterapéuticos y comunicaciones relacionadas con su atención sanitaria.

BASE LEGAL
Consentimiento expreso del interesado y ejecución de la relación contractual de servicios sanitarios.

CONSERVACIÓN
Sus datos se conservarán durante la vigencia de la relación terapéutica y el plazo legalmente exigido (mínimo 5 años).

DESTINATARIOS
Sus datos no serán cedidos a terceros salvo obligación legal o consentimiento expreso.

DERECHOS
Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición contactando directamente con el responsable del tratamiento.

El/la abajo firmante declara haber sido informado/a y CONSIENTE expresamente el tratamiento de sus datos para las finalidades descritas.`

interface Settings {
  consentText: string
  physioName: string
  physioConsentSignedAt?: string
}

type DbRow = {
  id: string
  user_id: string
  consent_text: string
  physio_name: string
  physio_consent_signed_at: string | null
}

function fromDb(row: DbRow): Settings {
  return {
    consentText: row.consent_text,
    physioName: row.physio_name,
    physioConsentSignedAt: row.physio_consent_signed_at ?? undefined,
  }
}

const defaults: Settings = { consentText: DEFAULT_CONSENT, physioName: '' }

export const useAppSettingsStore = defineStore('appSettings', () => {
  const data = ref<Settings>({ ...defaults })
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    const { data: rows, error } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
    if (!error && rows) {
      data.value = fromDb(rows as DbRow)
    }
    loading.value = false
  }

  /** Crea o actualiza la fila de settings del usuario. */
  async function save(partial: Partial<{
    consent_text: string
    physio_name: string
    physio_consent_signed_at: string | null
  }>) {
    const auth = useAuthStore()
    const { data: existing } = await supabase
      .from('app_settings')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('app_settings')
        .update(partial)
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('app_settings')
        .insert({
          user_id: auth.userId,
          consent_text: data.value.consentText,
          physio_name: data.value.physioName,
          physio_consent_signed_at: data.value.physioConsentSignedAt || null,
          ...partial,
        })
      if (error) throw error
    }
  }

  async function updateConsentText(text: string) {
    await save({ consent_text: text })
    data.value.consentText = text
  }

  async function signPhysioConsent(name: string) {
    const now = new Date().toISOString()
    await save({ physio_name: name, physio_consent_signed_at: now })
    data.value.physioName = name
    data.value.physioConsentSignedAt = now
  }

  async function revokePhysioConsent() {
    await save({ physio_consent_signed_at: null })
    data.value.physioConsentSignedAt = undefined
  }

  return { data, loading, fetchAll, updateConsentText, signPhysioConsent, revokePhysioConsent }
})
