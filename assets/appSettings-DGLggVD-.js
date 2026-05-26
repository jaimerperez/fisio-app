import{E as c,r as l}from"./index-x06F7nKi.js";const n="fisioapp_settings",t=`CONSENTIMIENTO INFORMADO PARA EL TRATAMIENTO DE DATOS PERSONALES

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

El/la abajo firmante declara haber sido informado/a y CONSIENTE expresamente el tratamiento de sus datos para las finalidades descritas.`;function d(){try{return JSON.parse(localStorage.getItem(n)||"null")??{consentText:t,physioName:""}}catch{return{consentText:t,physioName:""}}}const p=c("appSettings",()=>{const e=l(d());function a(){localStorage.setItem(n,JSON.stringify(e.value))}function s(o){e.value.consentText=o,a()}function i(o){e.value.physioName=o,e.value.physioConsentSignedAt=new Date().toISOString(),a()}function r(){e.value.physioConsentSignedAt=void 0,a()}return{data:e,updateConsentText:s,signPhysioConsent:i,revokePhysioConsent:r}});export{p as u};
