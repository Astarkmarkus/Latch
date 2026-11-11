import type { Lang } from './i18n';
export type LegalPage='privacy'|'terms'|'cookies';
export const legal:Record<Lang,Record<LegalPage,{title:string;sections:{heading:string;body:string}[]}>>={
en:{
 privacy:{title:'Privacy notice · draft',sections:[
 {heading:'Who operates Latch?',body:'Operator name, registration details, contact address and data protection contact MUST be added before public launch. This draft does not identify a legally responsible controller.'},
 {heading:'What we process',body:'When you register: email and authentication data; your private birth date for an 18+ gate; profile name, approximate city/country, text, interests and photos if you choose to publish them; likes, matches, messages, reports, blocks, notification settings and consent choices. We do not publish your date of birth or exact coordinates.'},
 {heading:'Purpose and legal basis',body:'Account creation and messaging are provided as part of the service; safety and fraud prevention require separate assessment; non-essential analytics require opt-in. Dating preferences that reveal sensitive personal data require explicit consent before being collected. Consent must be withdrawable.'},
 {heading:'Visibility and recipients',body:'Visible profile information is shown only to signed-in users subject to discovery and blocking controls. Supabase hosts service data in the EU West (Ireland) region, but international access and subprocessors need a transfer and vendor review.'},
 {heading:'Retention and rights',body:'Before launch, set retention periods and a secure deletion process, including storage files and backups. Users may request access, correction, deletion, restriction, export or objection. Contact details and response channels are not configured yet.'},
 {heading:'Children and safety',body:'Latch is intended only for adults aged 18+. Entered birth dates alone do not verify age. Production launch requires robust age assurance and moderation.'}
 ]},
 terms:{title:'Terms of service · draft',sections:[
 {heading:'Eligibility',body:'You must be 18 or older. Only create a profile for yourself. Do not impersonate others or share unlawful content.'},
 {heading:'Respect and safety',body:'No harassment, hate, scams, solicitation, non-consensual sexual content, threats or attempts to evade blocks. Report suspected abuse through the in-app control.'},
 {heading:'User content',body:'You are responsible for the photos and text you upload and must have rights to share them. Sharing a profile is voluntary and can be disabled.'},
 {heading:'Service and liability',body:'Latch is a development preview, not a guarantee of identity, compatibility, safety, delivery or availability. Complete governing law, dispute, complaint, liability and operator clauses are required before launch.'}
 ]},
 cookies:{title:'Cookie & storage notice · draft',sections:[
 {heading:'Strictly necessary',body:'Authentication sessions and essential preferences are stored locally to keep you signed in and remember privacy and language choices.'},
 {heading:'Optional analytics',body:'Optional analytics are OFF by default and no analytics SDK is bundled in this preview. Opt-in saves a preference only; no tracking activates until a separately documented, configured service exists.'},
 {heading:'Control',body:'You can change your optional choice in Settings → Cookie settings at any time. Browser storage can also be cleared through your browser.'}
 ]}
},
sv:{
 privacy:{title:'Integritetsinformation · utkast',sections:[
 {heading:'Personuppgiftsansvarig',body:'Ansvarigt företag, organisationsnummer, kontaktadress och dataskyddskontakt MÅSTE anges före offentlig lansering. Detta utkast anger inte en juridiskt ansvarig part.'},
 {heading:'Vilka uppgifter behandlas?',body:'Vid registrering: e-post och inloggningsuppgifter, privat födelsedatum för 18-årsgräns, valfritt profilnamn, ungefärlig stad/land, text, intressen och bilder samt likes, matchningar, meddelanden, anmälningar, blockeringar och integritetsval. Vi publicerar inte ditt födelsedatum eller exakta koordinater.'},
 {heading:'Syfte och rättslig grund',body:'Konton och meddelanden är en del av tjänsten. Säkerhet och missbruksbekämpning behöver egen bedömning. Frivillig analys kräver samtycke. Känsliga dejtingpreferenser får bara samlas in med giltigt uttryckligt samtycke som går att återkalla.'},
 {heading:'Synlighet och mottagare',body:'Synliga profiler delas enbart med inloggade användare enligt sekretess- och blockeringsregler. Supabase-projektet ligger i EU West (Irland), men internationella åtkomster och underleverantörer måste granskas.'},
 {heading:'Lagring och dina rättigheter',body:'Lagringstider och säker kontoradering inklusive filer och säkerhetskopior måste fastställas. Du kan begära tillgång, rättelse, radering, begränsning, dataportabilitet och invända. Kontaktväg måste konfigureras.'},
 {heading:'Barn och säkerhet',body:'Latch är endast för vuxna över 18 år. Ett angivet födelsedatum verifierar inte åldern; robust ålderskontroll och moderering krävs för lansering.'}
 ]},
 terms:{title:'Användarvillkor · utkast',sections:[
 {heading:'Behörighet',body:'Du måste ha fyllt 18 år. Skapa endast konto åt dig själv. Identitetsstöld och olagligt innehåll är förbjudet.'},
 {heading:'Respekt och trygghet',body:'Trakasserier, hat, bedrägerier, hot, oönskat sexuellt innehåll och kringgående av blockeringar tillåts inte. Anmäl missbruk i appen.'},
 {heading:'Ditt innehåll',body:'Du ansvarar för bilder och texter du delar och måste ha rätt att publicera dem. Synlighet kan stängas av.'},
 {heading:'Tjänsten',body:'Latch är en utvecklingsversion och garanterar inte identitet, kompatibilitet eller tillgänglighet. Innan lansering krävs fullständiga regler om ansvarig part, tillämplig lag, tvister och klagomål.'}
 ]},
 cookies:{title:'Cookieinformation · utkast',sections:[
 {heading:'Nödvändig lagring',body:'Inloggningssessioner och viktiga inställningar sparas lokalt för att hålla dig inloggad och komma ihåg språk- och integritetsval.'},
 {heading:'Frivillig analys',body:'Frivillig analys är AV som standard. Ingen analystjänst finns i förhandsversionen. Ett ja sparar endast ett val tills en särskilt redovisad och konfigurerad tjänst finns.'},
 {heading:'Dina val',body:'Du kan ändra ditt val i Inställningar → Cookieinställningar när som helst. Du kan också rensa webbläsarens lagring.'}
 ]}
},
es:{
 privacy:{title:'Aviso de privacidad · borrador',sections:[
 {heading:'Responsable',body:'Antes del lanzamiento se DEBEN indicar la entidad responsable, sus datos de registro, dirección y contacto de privacidad. Este borrador todavía no identifica al responsable jurídico.'},
 {heading:'Datos tratados',body:'Al registrarte: correo y autenticación, fecha de nacimiento privada para el límite de 18 años, nombre, ciudad/país aproximados, textos, intereses y fotos que decidas mostrar; también me gusta, conexiones, mensajes, denuncias, bloqueos y preferencias. No publicamos tu fecha de nacimiento ni coordenadas precisas.'},
 {heading:'Finalidad y base legal',body:'Las cuentas y la mensajería forman parte del servicio; la seguridad requiere evaluación independiente; la analítica no esencial requiere consentimiento. Las preferencias que revelan datos sensibles requieren consentimiento explícito y revocable antes de recogerse.'},
 {heading:'Visibilidad y destinatarios',body:'Los perfiles visibles se comparten solo con usuarios autenticados, sujetos a los controles de privacidad y bloqueos. Supabase aloja los datos en EU West (Irlanda); se deben revisar transferencias internacionales y proveedores.'},
 {heading:'Conservación y derechos',body:'Antes del lanzamiento hay que definir plazos de conservación y eliminación segura de cuentas, imágenes y copias. Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oposición. Falta configurar el canal de contacto.'},
 {heading:'Menores y seguridad',body:'Latch es solo para mayores de 18 años. Declarar la fecha de nacimiento no verifica la edad; hacen falta controles adecuados y moderación.'}
 ]},
 terms:{title:'Condiciones de uso · borrador',sections:[
 {heading:'Requisitos',body:'Debes tener al menos 18 años. Crea solo cuentas para ti. Se prohíben las suplantaciones y el contenido ilícito.'},
 {heading:'Respeto y seguridad',body:'No se permite el acoso, odio, fraude, amenazas, contenido sexual no consentido ni eludir bloqueos. Denuncia posibles abusos.'},
 {heading:'Tu contenido',body:'Eres responsable de las fotos y textos que subes y debes tener derecho a compartirlos. Puedes desactivar la visibilidad.'},
 {heading:'Servicio',body:'Latch es una versión preliminar sin garantías de identidad, compatibilidad o disponibilidad. Faltan cláusulas sobre responsable, ley aplicable, disputas y reclamaciones.'}
 ]},
 cookies:{title:'Aviso de cookies y almacenamiento · borrador',sections:[
 {heading:'Almacenamiento necesario',body:'Las sesiones de autenticación y preferencias esenciales se almacenan localmente para mantener la sesión y recordar idioma y privacidad.'},
 {heading:'Analítica opcional',body:'La analítica está DESACTIVADA por defecto. Esta vista previa no incluye SDK de analítica. Aceptar solo guarda tu preferencia hasta configurar y documentar un proveedor.'},
 {heading:'Tu control',body:'Puedes cambiar tu elección en Ajustes → Opciones de cookies en cualquier momento, o borrar el almacenamiento del navegador.'}
 ]}
}
};
