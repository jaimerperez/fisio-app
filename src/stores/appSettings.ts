import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY = 'fisioapp_settings'

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

function load(): Settings {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') ?? {
      consentText: DEFAULT_CONSENT,
      physioName: '',
    }
  } catch {
    return { consentText: DEFAULT_CONSENT, physioName: '' }
  }
}

export const useAppSettingsStore = defineStore('appSettings', () => {
  const data = ref<Settings>(load())

  function save() {
    localStorage.setItem(KEY, JSON.stringify(data.value))
  }

  function updateConsentText(text: string) {
    data.value.consentText = text
    save()
  }

  function signPhysioConsent(name: string) {
    data.value.physioName = name
    data.value.physioConsentSignedAt = new Date().toISOString()
    save()
  }

  function revokePhysioConsent() {
    data.value.physioConsentSignedAt = undefined
    save()
  }

  return { data, updateConsentText, signPhysioConsent, revokePhysioConsent }
})
