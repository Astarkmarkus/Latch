import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Bell, BookOpen, Camera, Check, ChevronRight,
  Compass, Cookie, Download, Film, Gamepad2, Globe2, Heart, HeartHandshake, Info,
  LockKeyhole, LogOut, MapPin, MessageCircle, Music2, Plus, Search, Send,
  Settings2, ShieldCheck, Sparkles, Trash2, UtensilsCrossed,
  UserRound, X, Flag, Plane, LoaderCircle, Eye, EyeOff
} from 'lucide-react';
import { supabase } from './lib/supabase';
import type { Profile, LatchMatch, LatchMessage, LatchNotification } from './lib/supabase';
import { t, type Lang, type Key } from './lib/i18n';
import { legal, type LegalPage } from './lib/legal';

type Page = 'discover' | 'likes' | 'matches' | 'profile' | 'settings';
type Candidate = Profile & { demo?: boolean; artwork?: number };
type Draft = Pick<Profile,'display_name'|'city'|'country'|'bio'|'prompt_question'|'prompt_answer'|'archetypes'|'interests'|'worldwide'|'visible'|'language'>;
type Toast = { msg: string; bad?: boolean };
const emptyDraft = (language:Lang):Draft => ({
 display_name:'',city:'',country:'',bio:'',prompt_question:'The quickest way to win me over?',
 prompt_answer:'',archetypes:[],interests:[],worldwide:false,visible:false,language
});
const categories = [
 {id:'game',icon:Gamepad2,emoji:'🎮',label:'The Gamer',tint:'#E1D8FA'},
 {id:'film',icon:Film,emoji:'🎞️',label:'The Cinephile',tint:'#F9DCCF'},
 {id:'music',icon:Music2,emoji:'🎵',label:'Music Lover',tint:'#F6D4E6'},
 {id:'explorer',icon:Plane,emoji:'🌍',label:'The Explorer',tint:'#CBE5DE'},
 {id:'book',icon:BookOpen,emoji:'📚',label:'Bookworm',tint:'#F1E4C8'},
 {id:'food',icon:UtensilsCrossed,emoji:'🍓',label:'Foodie',tint:'#FFE4C8'}
] as const;
const interests = ['World of Warcraft','SMITE','Stardew Valley','Minecraft','Baldur’s Gate 3','The Witcher 3','Interstellar','Spirited Away','La La Land','The Dark Knight','The Weeknd','Bad Bunny','Taylor Swift','Live music','Travel','Hiking','Photography','Cooking','Dogs','Street food'];
const countries=['All countries','Sweden','Spain','United Kingdom','Germany','France','Portugal','Italy','United States','Mexico','Argentina'];
const examples:Candidate[]=[
 {user_id:'example-1',demo:true,artwork:0,display_name:'Sofia',age:26,city:'Barcelona',country:'Spain',bio:'Slow mornings, big playlists and the person who always says yes to a last-minute adventure.',prompt_question:'A hill I will die on',prompt_answer:'Interstellar is better every time you watch it.',archetypes:['film','music','explorer'],interests:['Interstellar','Bad Bunny','Travel','Photography'],photos:[],language:'es',worldwide:true,visible:true,verification_status:'unverified'},
 {user_id:'example-2',demo:true,artwork:1,display_name:'Alex',age:27,city:'Stockholm',country:'Sweden',bio:'Half gamer, half outdoorsy. I promise those can coexist.',prompt_question:'My perfect Sunday',prompt_answer:'Coffee, a long walk and an unpredictable co-op adventure.',archetypes:['game','explorer','food'],interests:['World of Warcraft','SMITE','Hiking','Street food'],photos:[],language:'en',worldwide:true,visible:true,verification_status:'unverified'},
 {user_id:'example-3',demo:true,artwork:2,display_name:'Lucía',age:25,city:'Madrid',country:'Spain',bio:'Romanticising the ordinary one good song at a time.',prompt_question:'We should definitely',prompt_answer:'Find a tiny restaurant with no online reviews.',archetypes:['music','book','food'],interests:['Live music','La La Land','Cooking','Travel'],photos:[],language:'es',worldwide:true,visible:true,verification_status:'unverified'},
 {user_id:'example-4',demo:true,artwork:3,display_name:'Maya',age:28,city:'London',country:'United Kingdom',bio:'A book in my bag, a camera in my hand, and no real weekend plans.',prompt_question:'The way to my heart',prompt_answer:'Tell me about the last thing that made you genuinely excited.',archetypes:['film','book','explorer'],interests:['Spirited Away','Dogs','Photography','Travel'],photos:[],language:'en',worldwide:true,visible:true,verification_status:'unverified'}
];
const words = {
 en:{eyebrow:'A better way to connect',headline:'Find your kind of',headlineAccent:'connection.',deck:'A little attraction. A lot in common. Meet people through the interests, stories and experiences that make them who they are.',discoverTitle:'People worth getting to know',discoverNote:'Less swiping. More sparks.',real:'Real profiles',preview:'Illustrative profiles · not real users',previewExplain:'These profile cards demonstrate the experience. Sign up to find genuine profiles when the beta community grows.',noProfiles:'No profiles match those filters just yet.',noProfilesText:'Try another country or explore other interests. You can be one of the first to join Latch.',introTitle:'What if the first message wrote itself?',introSub:'Your favourite games, films and music are the start of something.',myInterests:'Your interests',browse:'Explore people',yourSpace:'Your little corner of Latch',accountSub:'Set up a profile that feels like you.',yourChats:'Your conversations',chatEmpty:'When two people like each other, their connection appears here.',likeEmpty:'Your sent likes will appear here.',interestCard:'Real chemistry starts somewhere.',getStarted:'Create an account',signIn:'Welcome back',signUp:'Join Latch',signedOut:'Discover more, together.',birthdayInfo:'Your birth date stays private. We only show your age.',ageCheck:'I confirm that I am 18 or older.',agree:'I agree to the Terms and acknowledge the Privacy Notice.',sensitive:'I explicitly agree to the processing of dating preferences I choose to disclose (if applicable).',profileHidden:'Your profile is hidden from Discover.',profileVisible:'Your profile is discoverable by other signed-in members.',profileNeeds:'Complete your name, city, country and birthday.',askFirst:'Tell us a little about you.',profileSuccess:'Your Latch profile is ready.',saved:'Changes saved.',likeSent:'Like sent. A match appears when they like you back.',mutual:'Looks like a connection!',openChat:'Open conversation',compose:'Say something thoughtful…',newHere:'New around here?',alreadyHere:'Already a member?',memberOnly:'Sign in to connect with real people.',unverified:'Verification is coming later; no example account is verified.',filters:'Discovery filters',cityOnly:'Nearby uses a city match (no exact location or GPS tracking).',worldOnly:'Worldwide includes profiles that opted in to international discovery.',notifications:'Enable browser notifications',notificationsInfo:'In-browser activity alerts work while Latch is open. Background push is not active yet.',language:'Display language',safety:'Privacy and safety',data:'Your information',download:'Download my data',delete:'Account deletion',deleteInfo:'Secure self-service deletion is not yet available. Do not publicly launch without an operator contact and deletion workflow.',blocked:'User blocked.',reported:'Report submitted for review.',reportNote:'Use this for spam, impersonation, harassment or suspected underage profiles.',done:'Done',select:'Select',change:'Change',photoAlt:'Portrait illustration, not a real photo',photoHint:'JPEG, PNG or WebP · 5MB maximum · 6 photos',cookieTitle:'Your privacy comes first.',cookieSub:'Essential storage keeps sign-in and preferences working. No analytics tracker is installed; any optional future analytics require your choice.',all:'Allow optional',essential:'Only essential',legal:'Legal drafts',view:'View',terms:'Terms of service',privacy:'Privacy notice',cookies:'Cookies & storage',previewMode:'Private beta preview',beFirst:'Be part of the beginning',invite:'Join the community',notifyTitle:'Activity',noActivity:'All quiet here for now.',report:'Report this profile',why:'Reason',save:'Save changes',you:'You',exploreOnly:'The beta shows illustrative profiles until real members join.',gender:'',showProfile:'Show me in Discover',international:'Open to worldwide connections',matchesCount:'Connections',logOut:'Sign out',sentLikes:'Likes you sent',noPhotos:'Add a real photo for a more personal profile.',created:'Your account was created. Please confirm your email.',loginNeeded:'Please log in first.',warning:'Latch is an early development build: robust age/photo checks and active moderation are not live. Not ready for unrestricted public dating.',close:'Close',legalBanner:'Draft: operator identity, retention periods, age assurance, and local legal review are required before launch.'},
 sv:{eyebrow:'Ett bättre sätt att mötas',headline:'Hitta någon du verkligen',headlineAccent:'klickar med.',deck:'Lite attraktion. Mycket gemensamt. Upptäck människor genom intressen, berättelser och upplevelser som faktiskt betyder något.',discoverTitle:'Människor värda att lära känna',discoverNote:'Mindre swipande. Mer kontakt.',real:'Riktiga profiler',preview:'Illustrativa profiler · inte riktiga användare',previewExplain:'Profilkorten visar hur Latch fungerar. Registrera dig för att träffa riktiga personer när betan växer.',noProfiles:'Inga profiler matchar filtren ännu.',noProfilesText:'Prova ett annat land eller nya intressen. Du kan bli en av de första på Latch.',introTitle:'Tänk om första meddelandet kom naturligt?',introSub:'Dina favoritspel, filmer och låtar kan vara början på något.',myInterests:'Dina intressen',browse:'Upptäck personer',yourSpace:'Din egen del av Latch',accountSub:'Skapa en profil som verkligen känns som du.',yourChats:'Dina konversationer',chatEmpty:'När två personer gillar varandra visas matchningen här.',likeEmpty:'Gilla-markeringarna du skickat visas här.',interestCard:'Riktig kemi börjar någonstans.',getStarted:'Skapa konto',signIn:'Välkommen tillbaka',signUp:'Gå med i Latch',signedOut:'Upptäck mer tillsammans.',birthdayInfo:'Födelsedatumet är privat. Vi visar bara din ålder.',ageCheck:'Jag bekräftar att jag har fyllt 18 år.',agree:'Jag godkänner villkoren och har läst integritetsinformationen.',sensitive:'Jag ger uttryckligt samtycke till behandling av känsliga dejtingpreferenser jag själv väljer att dela, när det är tillämpligt.',profileHidden:'Din profil är dold från Upptäck.',profileVisible:'Andra inloggade användare kan hitta din profil.',profileNeeds:'Fyll i namn, stad, land och födelsedatum.',askFirst:'Berätta lite om dig själv.',profileSuccess:'Din Latch-profil är klar.',saved:'Ändringarna har sparats.',likeSent:'Gilla-markeringen är skickad. Det blir en match när personen gillar tillbaka.',mutual:'Ni har en match!',openChat:'Öppna chatten',compose:'Skriv något personligt…',newHere:'Ny här?',alreadyHere:'Har du redan ett konto?',memberOnly:'Logga in för att få kontakt med riktiga användare.',unverified:'Verifiering kommer senare; inga exempelkonton är verifierade.',filters:'Sökfilter',cityOnly:'Nära dig matchar stad (ingen exakt position eller GPS-spårning).',worldOnly:'Hela världen visar profiler som valt internationell upptäckt.',notifications:'Tillåt webbläsaraviseringar',notificationsInfo:'Aviseringar fungerar när Latch är öppet. Push i bakgrunden är inte aktivt ännu.',language:'Visningsspråk',safety:'Integritet och säkerhet',data:'Dina uppgifter',download:'Hämta mina uppgifter',delete:'Radera konto',deleteInfo:'Säker självbetjänad kontoradering saknas fortfarande. Offentlig lansering kräver kontaktuppgifter till ansvarig och fungerande raderingsflöde.',blocked:'Personen har blockerats.',reported:'Anmälan har skickats in.',reportNote:'Anmäl spam, falska profiler, trakasserier eller misstänkt minderåriga.',done:'Klart',select:'Välj',change:'Ändra',photoAlt:'Porträttillustration, inte ett riktigt foto',photoHint:'JPEG, PNG eller WebP · max 5 MB · 6 bilder',cookieTitle:'Din integritet kommer först.',cookieSub:'Nödvändig lagring håller igång inloggning och inställningar. Ingen analystjänst används ännu; eventuellt framtida analys kräver ditt val.',all:'Tillåt frivilligt',essential:'Bara nödvändigt',legal:'Juridiska utkast',view:'Visa',terms:'Användarvillkor',privacy:'Integritet',cookies:'Cookies och lagring',previewMode:'Privat betaförhandsvisning',beFirst:'Var med från början',invite:'Bli medlem',notifyTitle:'Aktivitet',noActivity:'Inga nya händelser just nu.',report:'Anmäl profil',why:'Anledning',save:'Spara ändringar',you:'Du',exploreOnly:'Betan visar exempelprofiler tills riktiga användare går med.',gender:'',showProfile:'Visa mig i Upptäck',international:'Öppen för internationella kontakter',matchesCount:'Matchningar',logOut:'Logga ut',sentLikes:'Gilla-markeringar du skickat',noPhotos:'Lägg till en riktig bild för en mer personlig profil.',created:'Kontot har skapats. Bekräfta din e-post.',loginNeeded:'Du behöver logga in.',warning:'Latch är en tidig utvecklingsversion: säker ålders-/fotoverifiering och aktiv moderering är inte igång. Inte redo för öppen publik dejting.',close:'Stäng',legalBanner:'Utkast: ansvarig juridisk person, lagringstider, ålderskontroll och lokal juridisk granskning krävs före lansering.'},
 es:{eyebrow:'Una forma mejor de conectar',headline:'Encuentra tu tipo de',headlineAccent:'conexión.',deck:'Un poco de atracción. Mucho en común. Conoce a personas a través de intereses, historias y experiencias que de verdad importan.',discoverTitle:'Personas que vale la pena conocer',discoverNote:'Menos deslizar. Más conexión.',real:'Perfiles reales',preview:'Perfiles ilustrativos · no son usuarios reales',previewExplain:'Estas tarjetas muestran cómo funciona Latch. Regístrate para descubrir personas reales a medida que crece la beta.',noProfiles:'Todavía no hay perfiles con estos filtros.',noProfilesText:'Prueba otro país u otros intereses. Puedes ser de los primeros en Latch.',introTitle:'¿Y si el primer mensaje saliera solo?',introSub:'Tus juegos, películas y canciones favoritos pueden ser el principio de algo.',myInterests:'Tus intereses',browse:'Descubrir personas',yourSpace:'Tu rincón en Latch',accountSub:'Crea un perfil que refleje quién eres.',yourChats:'Tus conversaciones',chatEmpty:'Cuando dos personas se gustan, la conexión aparece aquí.',likeEmpty:'Aquí aparecen los me gusta que envíes.',interestCard:'La química empieza en algún lugar.',getStarted:'Crear cuenta',signIn:'Qué bueno verte',signUp:'Únete a Latch',signedOut:'Descubre más, juntos.',birthdayInfo:'Tu fecha de nacimiento es privada. Solo mostramos tu edad.',ageCheck:'Confirmo que tengo 18 años o más.',agree:'Acepto los Términos y he leído el Aviso de Privacidad.',sensitive:'Consiento expresamente el tratamiento de preferencias sensibles de citas que decida compartir, cuando corresponda.',profileHidden:'Tu perfil está oculto en Descubrir.',profileVisible:'Otros usuarios conectados pueden descubrir tu perfil.',profileNeeds:'Completa nombre, ciudad, país y fecha de nacimiento.',askFirst:'Cuéntanos un poco sobre ti.',profileSuccess:'Tu perfil de Latch está listo.',saved:'Cambios guardados.',likeSent:'Me gusta enviado. Habrá conexión cuando la otra persona te corresponda.',mutual:'¡Hay conexión!',openChat:'Abrir chat',compose:'Escribe algo especial…',newHere:'¿Eres nuevo?',alreadyHere:'¿Ya tienes cuenta?',memberOnly:'Inicia sesión para conocer personas reales.',unverified:'La verificación llegará después; ningún ejemplo está verificado.',filters:'Filtros de búsqueda',cityOnly:'Cerca de ti usa la ciudad (sin GPS ni ubicación exacta).',worldOnly:'Todo el mundo incluye perfiles que aceptan conexiones internacionales.',notifications:'Permitir notificaciones',notificationsInfo:'Los avisos funcionan con Latch abierto. Aún no hay notificaciones push en segundo plano.',language:'Idioma',safety:'Privacidad y seguridad',data:'Tu información',download:'Descargar mis datos',delete:'Eliminar cuenta',deleteInfo:'Todavía no hay eliminación de cuenta por autoservicio. Antes del lanzamiento se necesita un responsable y un proceso de eliminación.',blocked:'Perfil bloqueado.',reported:'Denuncia enviada.',reportNote:'Denuncia spam, suplantación, acoso o perfiles de menores.',done:'Listo',select:'Seleccionar',change:'Cambiar',photoAlt:'Ilustración de retrato, no es una foto real',photoHint:'JPEG, PNG o WebP · máx. 5 MB · 6 fotos',cookieTitle:'Tu privacidad es lo primero.',cookieSub:'El almacenamiento esencial mantiene tu sesión y preferencias. No hay analítica instalada; cualquier uso futuro requiere tu elección.',all:'Permitir opcionales',essential:'Solo necesarias',legal:'Borradores legales',view:'Ver',terms:'Términos del servicio',privacy:'Privacidad',cookies:'Cookies y almacenamiento',previewMode:'Vista previa beta privada',beFirst:'Forma parte del comienzo',invite:'Únete a la comunidad',notifyTitle:'Actividad',noActivity:'Aún no hay actividad.',report:'Denunciar perfil',why:'Motivo',save:'Guardar cambios',you:'Tú',exploreOnly:'La beta muestra perfiles ilustrativos hasta que se registren personas reales.',gender:'',showProfile:'Mostrarme en Descubrir',international:'Abierto a conexiones internacionales',matchesCount:'Conexiones',logOut:'Cerrar sesión',sentLikes:'Me gusta enviados',noPhotos:'Añade una foto real para personalizar tu perfil.',created:'Tu cuenta se creó. Confirma tu correo.',loginNeeded:'Primero inicia sesión.',warning:'Latch está en desarrollo: aún no hay verificación robusta de edad/fotos ni moderación activa. No apto para lanzamiento público abierto.',close:'Cerrar',legalBanner:'Borrador: se necesita identificar al responsable, los periodos de conservación, la verificación de edad y la revisión legal local antes de lanzar.'}
} as const;

function Logo(){return <span className="logo"><span className="logo-sign">L<span/></span><span className="logo-text">latch<span>.</span></span></span>}
function AppPortrait({p,urls}:{p:Candidate;urls:Record<string,string>}){
 const image=p.photos?.[0] && urls[p.photos[0]];
 if(image)return <img className="portrait-photo" src={image} alt={p.display_name} loading="lazy"/>;
 const n=(p.artwork??(p.display_name.charCodeAt(0)%4));
 const palette=[['#f0d7c8','#d7a0a1','#37232e','#cb8f72','#66516c'],['#d6d7e6','#bcb0cc','#3b354b','#c99772','#5d7291'],['#f7d5ba','#dfb8ac','#382b3f','#d59b77','#8f4b69'],['#c9d8d8','#a9b8af','#39373b','#d5a382','#4b7273']][n%4];
 const seed=p.user_id.replace(/[^a-z0-9]/gi,'').slice(0,20);
 return <svg className="portrait-art" viewBox="0 0 450 530" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated portrait — not a photograph">
 <defs><linearGradient id={'bg'+seed} x2="1" y2="1"><stop stopColor={palette[0]}/><stop offset="1" stopColor={palette[1]}/></linearGradient><linearGradient id={'cl'+seed} x2="0" y2="1"><stop stopColor={palette[4]}/><stop offset="1" stopColor={palette[2]}/></linearGradient></defs>
 <rect width="450" height="530" fill={'url(#bg'+seed+')'}/><circle cx="363" cy="120" r="132" fill="#fff" opacity=".17"/><path d="M-30 355Q140 273 265 364T510 314V530H-30" fill="#fff" opacity=".10"/>
 <ellipse cx="226" cy="574" rx="252" ry="185" fill={'url(#cl'+seed+')'}/><path d="M172 364q54 70 109 0l-5-75h-98Z" fill={palette[3]}/>
 <ellipse cx="226" cy="235" rx="99" ry="128" fill={palette[3]}/>
 <path d={n%4===1?'M123 222q-2-135 104-140 110-1 116 132-36-14-54-67-57 36-166 46Z':'M123 270q-25-176 110-184 125-6 126 174-30-20-27-76-55-50-75-55-53 68-124 73 1 47-10 68Z'} fill={palette[2]}/>
 {n%4!==1&&<path d="M123 233q-17 68-2 160 22-5 29-20-18-62-6-126ZM328 225q22 77 4 171l-26-21q19-65 10-119Z" fill={palette[2]}/>}
 <path d="M177 231q20-12 38 0m28 1q19-13 38-1" stroke="#534243" strokeWidth="4" fill="none" strokeLinecap="round"/>
 <circle cx="196" cy="239" r="3.5" fill="#3e3037"/><circle cx="261" cy="239" r="3.5" fill="#3e3037"/><path d="M226 248q-6 15-5 18l10 2" stroke="#a36e61" strokeWidth="2.6" fill="none" strokeLinecap="round"/><path d="M199 288q27 17 54-1" stroke="#955f5b" strokeWidth="4" fill="none" strokeLinecap="round"/>
 <path d="M171 384q55 56 109 0" stroke="#fff" strokeOpacity=".18" strokeWidth="6" fill="none"/>
 </svg>;
}
function IconTab({page,active,icon:Icon,label,onClick}:{page:Page;active:Page;icon:typeof Compass;label:string;onClick:(tab:Page)=>void}){return <button className={'nav-item'+(active===page?' active':'')} onClick={()=>onClick(page)}><Icon size={20} strokeWidth={active===page?2.4:1.9}/><span>{label}</span>{active===page&&<i className="nav-selected"/>}</button>}

export default function App(){
 const [lang,setLang]=useState<Lang>(()=>{const value=localStorage.getItem('latch-lang');if(value==='en'||value==='sv'||value==='es')return value;return navigator.language.startsWith('sv')?'sv':navigator.language.startsWith('es')?'es':'en'});
 const tr=useCallback((k:Key)=>t(lang,k),[lang]);
 const w=words[lang];
 const [page,setPage]=useState<Page>('discover');
 const [session,setSession]=useState<Session|null>(null);
 const [authOpen,setAuthOpen]=useState(false);
 const [signup,setSignup]=useState(true);
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [signupAdult,setSignupAdult]=useState(false);
 const [signupTerms,setSignupTerms]=useState(false);
 const [onboarding,setOnboarding]=useState(false);
 const [birthday,setBirthday]=useState('');
 const [sensitiveConsent,setSensitiveConsent]=useState(false);
 const [draft,setDraft]=useState<Draft>(emptyDraft(lang));
 const [me,setMe]=useState<Profile|null>(null);
 const [feed,setFeed]=useState<Profile[]>([]);
 const [likes,setLikes]=useState<{receiver_id:string;created_at:string}[]>([]);
 const [matches,setMatches]=useState<LatchMatch[]>([]);
 const [members,setMembers]=useState<Record<string,Profile>>({});
 const [photos,setPhotos]=useState<Record<string,string>>({});
 const [messages,setMessages]=useState<LatchMessage[]>([]);
 const [chatId,setChatId]=useState<string|null>(null);
 const [messageDraft,setMessageDraft]=useState('');
 const [notices,setNotices]=useState<LatchNotification[]>([]);
 const [notifyPrefs,setNotifyPrefs]=useState({notify_matches:true,notify_messages:true});
 const [notificationPermission,setNotificationPermission]=useState(typeof Notification==='undefined'?'unsupported':Notification.permission);
 const [scope,setScope]=useState<'nearby'|'worldwide'>('worldwide');
 const [country,setCountry]=useState('All countries');
 const [filter,setFilter]=useState('');
 const [category,setCategory]=useState('all');
 const [legalPage,setLegalPage]=useState<LegalPage|null>(null);
 const [cookieOpen,setCookieOpen]=useState(!localStorage.getItem('latch-cookie'));
 const [cookieAnalytics,setCookieAnalytics]=useState(localStorage.getItem('latch-cookie')==='analytics');
 const [showActivity,setShowActivity]=useState(false);
 const [showReport,setShowReport]=useState<Candidate|null>(null);
 const [reportReason,setReportReason]=useState('fake');
 const [likeTarget,setLikeTarget]=useState<Candidate|null>(null);
 const [likeNote,setLikeNote]=useState('');
 const [toast,setToast]=useState<Toast|null>(null);
 const [busy,setBusy]=useState(false);
 const [shownIds,setShownIds]=useState<string[]>([]);
 const uid=session?.user.id||'';
 const notice=(msg:string,bad=false)=>setToast({msg,bad});
 useEffect(()=>{if(!toast)return;const tm=setTimeout(()=>setToast(null),4100);return()=>clearTimeout(tm)},[toast]);
 useEffect(()=>{localStorage.setItem('latch-lang',lang);document.documentElement.lang=lang},[lang]);
 useEffect(()=>{
  let mounted=true;
  supabase.auth.getSession().then(({data})=>{if(mounted){setSession(data.session)}}).catch(()=>{});
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>{if(mounted){setSession(s)}});
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
  return()=>{mounted=false;subscription.unsubscribe()};
 },[]);
 const signedUrls=useCallback(async(profiles:Profile[])=>{
  const paths=[...new Set(profiles.flatMap(p=>p.photos||[]))].filter(Boolean);
  if(!paths.length)return;
  const {data}=await supabase.storage.from('latch-photos').createSignedUrls(paths,3600);
  if(!data)return;
  const urlMap:Record<string,string>={};
  data.forEach((v,i)=>{if(v.signedUrl)urlMap[paths[i]]=v.signedUrl});
  setPhotos(old=>({...old,...urlMap}));
 },[]);
 const reload=useCallback(async()=>{
  if(!uid)return;
  const [my,all,likeRes,matchRes,noteRes,settingRes]=await Promise.all([
   supabase.from('latch_profiles').select('*').eq('user_id',uid).maybeSingle(),
   supabase.from('latch_profiles').select('*').eq('visible',true).order('created_at',{ascending:false}).limit(100),
   supabase.from('latch_likes').select('receiver_id,created_at').eq('sender_id',uid).order('created_at',{ascending:false}),
   supabase.from('latch_matches').select('*').order('created_at',{ascending:false}),
   supabase.from('latch_notifications').select('*').order('created_at',{ascending:false}).limit(75),
   supabase.from('latch_settings').select('*').eq('user_id',uid).maybeSingle()
  ]);
  if(my.error){notice(my.error.message,true);return;}
  const own=(my.data||null) as Profile|null;
  setMe(own);setOnboarding(!own);
  const available=(all.data||[]) as Profile[];
  setFeed(available.filter(p=>p.user_id!==uid));
  setLikes((likeRes.data||[]) as {receiver_id:string;created_at:string}[]);
  const linked=(matchRes.data||[]) as LatchMatch[];
  setMatches(linked);
  setNotices((noteRes.data||[]) as LatchNotification[]);
  if(settingRes.data)setNotifyPrefs({notify_matches:settingRes.data.notify_matches,notify_messages:settingRes.data.notify_messages});
  const others=[...new Set(linked.flatMap(m=>[m.user_a,m.user_b]))].filter(id=>id!==uid);
  let related:Profile[]=[];
  if(others.length){const r=await supabase.from('latch_profiles').select('*').in('user_id',others);related=(r.data||[]) as Profile[];}
  const combined=[...available,...related,...(own?[own]:[])];
  setMembers(Object.fromEntries(combined.map(p=>[p.user_id,p])));
  void signedUrls(combined);
 },[uid,signedUrls]);
 useEffect(()=>{if(uid){void reload()}else{setMe(null);setFeed([]);setLikes([]);setMatches([]);setMembers({});setOnboarding(false)}},[uid,reload]);
 useEffect(()=>{
  if(!me)return;
  setDraft({display_name:me.display_name,city:me.city,country:me.country,bio:me.bio,prompt_question:me.prompt_question,prompt_answer:me.prompt_answer,archetypes:me.archetypes||[],interests:me.interests||[],worldwide:me.worldwide,visible:me.visible,language:me.language});
 },[me]);
 useEffect(()=>{
  if(!uid||!chatId)return;
  const fetchMessages=async()=>{const {data}=await supabase.from('latch_messages').select('*').eq('match_id',chatId).order('created_at').limit(200);setMessages((data||[]) as LatchMessage[])};
  void fetchMessages();const interval=setInterval(()=>void fetchMessages(),9000);
  return()=>clearInterval(interval);
 },[uid,chatId]);
 useEffect(()=>{
  if(!uid)return;
  const interval=setInterval(async()=>{
   const {data}=await supabase.from('latch_notifications').select('*').order('created_at',{ascending:false}).limit(75);
   if(!data)return;
   const next=data as LatchNotification[];
   const newItems=next.filter(v=>!v.is_read&&!notices.some(old=>old.id===v.id));
   if(newItems.length&&typeof Notification!=='undefined'&&Notification.permission==='granted'){
    if(newItems.some(v=>(v.category==='match'&&notifyPrefs.notify_matches)||(v.category==='message'&&notifyPrefs.notify_messages))){
     new Notification('Latch',{body:lang==='sv'?'Du har en ny händelse.':lang==='es'?'Tienes una nueva actividad.':'You have new activity.',icon:'./icon.svg'});
    }
   }
   setNotices(next);
  },18000);return()=>clearInterval(interval);
 },[uid,notices,lang,notifyPrefs]);
 const isSigned=Boolean(uid);
 const showDemo=!isSigned;
 const visible=useMemo(()=>{
  let base:Candidate[]=showDemo?examples:feed;
  const sent=new Set(likes.map(v=>v.receiver_id));
  if(!showDemo)base=base.filter(p=>!sent.has(p.user_id)&&!shownIds.includes(p.user_id));
  if(scope==='nearby'&&me?.city)base=base.filter(p=>p.city.trim().toLowerCase()===me.city.trim().toLowerCase());
  if(scope==='worldwide'&&!showDemo)base=base.filter(p=>p.worldwide);
  if(scope==='worldwide'&&country!=='All countries')base=base.filter(p=>p.country.toLowerCase()===country.toLowerCase());
  if(category!=='all')base=base.filter(p=>p.archetypes?.includes(category));
  if(filter.trim()){const q=filter.trim().toLowerCase();base=base.filter(p=>[p.display_name,p.city,p.country,p.bio,...(p.interests||[]),...(p.archetypes||[])].join(' ').toLowerCase().includes(q))}
  return base;
 },[showDemo,feed,likes,shownIds,scope,me?.city,country,category,filter]);
 const mutual=(p:Candidate)=>p.interests.filter(i=>me?.interests?.includes(i)).slice(0,4);
 function changeDraft<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(old=>({...old,[key]:value}))}
 function toggleTag(key:'interests'|'archetypes',value:string,max:number){setDraft(old=>({...old,[key]:old[key].includes(value)?old[key].filter(v=>v!==value):old[key].length<max?[...old[key],value]:old[key]}))}
 async function authenticate(e:FormEvent){
  e.preventDefault();
  if(!email.trim()||password.length<8){notice(lang==='sv'?'Ange e-post och minst 8 tecken i lösenordet.':'Enter email and a password of at least 8 characters.',true);return}
  if(signup&&(!signupAdult||!signupTerms)){notice(tr('required'),true);return}
  setBusy(true);
  const r=signup
   ? await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin+window.location.pathname}})
   : await supabase.auth.signInWithPassword({email:email.trim(),password});
  setBusy(false);
  if(r.error)notice(r.error.message,true);
  else if(signup){notice(w.created);if(r.data.session)setAuthOpen(false)}
  else{setAuthOpen(false);setPage('discover');notice(lang==='sv'?'Välkommen tillbaka!':'Welcome back!')}
 }
 async function saveProfile(e:FormEvent){
  e.preventDefault();
  if(!uid){setAuthOpen(true);return}
  if(draft.display_name.trim().length<2||!draft.city.trim()||!draft.country.trim()){notice(w.profileNeeds,true);return}
  if(!me&&!birthday){notice(w.profileNeeds,true);return}
  if(!me){const date=new Date(birthday+'T12:00:00Z');const now=new Date();let age=now.getUTCFullYear()-date.getUTCFullYear();if(now.getUTCMonth()<date.getUTCMonth()||(now.getUTCMonth()===date.getUTCMonth()&&now.getUTCDate()<date.getUTCDate()))age--;if(!Number.isFinite(age)||age<18||age>110){notice(tr('adultOnly'),true);return}}
  setBusy(true);
  if(!me){
   const {error}=await supabase.from('latch_private_profiles').upsert({user_id:uid,birth_date:birthday,terms_accepted_at:new Date().toISOString(),sensitive_data_consent_at:sensitiveConsent?new Date().toISOString():null});
   if(error){notice(error.message,true);setBusy(false);return}
  }
  const values={...draft,display_name:draft.display_name.trim(),city:draft.city.trim(),country:draft.country.trim(),bio:draft.bio.trim(),prompt_question:draft.prompt_question.trim(),prompt_answer:draft.prompt_answer.trim()};
  const {error}=me?await supabase.from('latch_profiles').update(values).eq('user_id',uid):await supabase.from('latch_profiles').insert({...values,user_id:uid});
  if(!error)await supabase.from('latch_settings').upsert({user_id:uid,locale:lang,worldwide_opt_in:draft.worldwide});
  setBusy(false);
  if(error)notice(error.message,true);else{notice(me?w.saved:w.profileSuccess);setOnboarding(false);setPage('discover');await reload()}
 }
 async function uploadPhoto(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];
  e.target.value='';
  if(!file||!uid||!me)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){notice(tr('invalidFile'),true);return}
  if(me.photos.length>=6){notice(w.photoHint,true);return}
  setBusy(true);
  const extension=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';
  const path=uid+'/'+crypto.randomUUID()+'.'+extension;
  const uploaded=await supabase.storage.from('latch-photos').upload(path,file,{upsert:false,contentType:file.type});
  if(uploaded.error){notice(uploaded.error.message,true);setBusy(false);return}
  const {error}=await supabase.from('latch_profiles').update({photos:[...me.photos,path]}).eq('user_id',uid);
  setBusy(false);if(error)notice(error.message,true);else{notice(tr('saved'));await reload()}
 }
 async function removePhoto(path:string){
  if(!me)return;
  setBusy(true);
  const {error}=await supabase.from('latch_profiles').update({photos:me.photos.filter(v=>v!==path)}).eq('user_id',uid);
  if(!error)await supabase.storage.from('latch-photos').remove([path]);
  setBusy(false);if(error)notice(error.message,true);else await reload();
 }
 async function sendLike(){
  if(!likeTarget)return;
  if(!uid||likeTarget.demo){setLikeTarget(null);setAuthOpen(true);setSignup(true);return}
  setBusy(true);
  const {error}=await supabase.from('latch_likes').insert({sender_id:uid,receiver_id:likeTarget.user_id,note:likeNote.slice(0,280)});
  setBusy(false);setLikeTarget(null);setLikeNote('');
  if(error){notice(error.message,true)}else{notice(w.likeSent);await reload()}
 }
 async function sendMessage(e:FormEvent){
  e.preventDefault();if(!chatId||!messageDraft.trim()||!uid||busy)return;
  setBusy(true);
  const {error}=await supabase.from('latch_messages').insert({match_id:chatId,sender_id:uid,content:messageDraft.trim().slice(0,2000)});
  setBusy(false);
  if(error){notice(error.message,true);return}
  setMessageDraft('');
  const {data}=await supabase.from('latch_messages').select('*').eq('match_id',chatId).order('created_at').limit(200);
  setMessages((data||[]) as LatchMessage[]);
 }
 async function blockPerson(p:Candidate){
  if(!uid||p.demo){notice(w.preview);return}
  const {error}=await supabase.from('latch_blocks').insert({blocker_id:uid,blocked_id:p.user_id});
  if(error)notice(error.message,true);else{notice(w.blocked);setChatId(null);await reload()}
 }
 async function submitReport(){
  if(!uid||!showReport||showReport.demo){setShowReport(null);return}
  setBusy(true);
  const {error}=await supabase.from('latch_reports').insert({reporter_id:uid,reported_id:showReport.user_id,reason:reportReason});
  setBusy(false);setShowReport(null);
  if(error)notice(error.message,true);else notice(w.reported);
 }
 async function saveNotificationPrefs(key:'notify_matches'|'notify_messages',value:boolean){
  const next={...notifyPrefs,[key]:value};setNotifyPrefs(next);
  if(!uid)return;
  const {error}=await supabase.from('latch_settings').upsert({user_id:uid,...next,locale:lang,worldwide_opt_in:me?.worldwide||false});
  if(error)notice(error.message,true);
 }
 async function browserNotifications(){
  if(typeof Notification==='undefined'){notice(tr('notificationPermission'),true);return}
  const result=await Notification.requestPermission();
  setNotificationPermission(result);if(result!=='granted')notice(tr('notificationPermission'),true);
 }
 async function markNotices(){
  setShowActivity(true);
  if(uid&&notices.some(n=>!n.is_read)){
   await supabase.from('latch_notifications').update({is_read:true}).eq('user_id',uid).eq('is_read',false);
   setNotices(old=>old.map(n=>({...n,is_read:true})));
  }
 }
 async function downloadData(){
  if(!uid){setAuthOpen(true);return}
  const data=await Promise.all(['latch_profiles','latch_private_profiles','latch_settings','latch_likes','latch_matches','latch_messages','latch_blocks','latch_notifications'].map(async table=>{
   const res=await supabase.from(table).select('*');
   return [table,res.data||[]];
  }));
  const payload=Object.fromEntries(data);
  const blob=new Blob([JSON.stringify({exported_at:new Date().toISOString(),data:payload},null,2)],{type:'application/json'});
  const objectUrl=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=objectUrl;a.download='latch-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(objectUrl),500);
 }
 function saveCookies(analytics:boolean){setCookieAnalytics(analytics);localStorage.setItem('latch-cookie',analytics?'analytics':'necessary');setCookieOpen(false);notice(tr('cookieSaved'))}
 function goto(p:Page){setPage(p);setChatId(null);setShowActivity(false);window.scrollTo({top:0,behavior:'smooth'})}
 const navItems:[Page,typeof Compass,Key][]=[['discover',Compass,'discover'],['likes',Heart,'likes'],['matches',MessageCircle,'matches'],['profile',UserRound,'profile'],['settings',Settings2,'settings']];
 const unread=notices.filter(n=>!n.is_read).length;
 const activeChat=matches.find(m=>m.id===chatId);
 const chatPartner=activeChat?members[activeChat.user_a===uid?activeChat.user_b:activeChat.user_a]:null;
 function cards(people:Candidate[]){return <div className="profile-grid">{people.map((p,i)=><article className="person-card" key={p.user_id} style={{animationDelay:(i*85)+'ms'}}>
   <div className="person-image">
    <AppPortrait p={p} urls={photos}/>
    <div className="person-image-shade"/>
    {p.demo&&<div className="image-status"><Eye size={13}/> {lang==='sv'?'Exempel':lang==='es'?'Ejemplo':'Example'}</div>}
    {p.verification_status==='verified'&&<span className="verified-image"><BadgeCheck size={15}/> {tr('verified')}</span>}
    <div className="person-title"><h3>{p.display_name}<span>, {p.age}</span></h3><div><MapPin size={13}/>{p.city}, {p.country}</div></div>
   </div>
   <div className="person-content">
    <div className="archetypes-row">{p.archetypes.slice(0,3).map(a=><span className="archetype-chip" key={a}>{categories.find(c=>c.id===a)?.emoji||'✨'} {categories.find(c=>c.id===a)?.label||a}</span>)}</div>
    <p className="person-bio">{p.bio}</p>
    <div className="person-quote"><span className="quote-label">{p.prompt_question||'The little things'}</span><p>{p.prompt_answer||p.bio}</p></div>
    {mutual(p).length>0&&<div className="common-line"><Sparkles size={15}/><strong>{mutual(p).length} {tr('common').toLowerCase()}:</strong> {mutual(p).join(', ')}</div>}
    <div className="interest-pills">{p.interests.slice(0,4).map(i=><span key={i}>{i}</span>)}</div>
    <div className="person-actions">
     <button className="skip-button" aria-label={tr('pass')} onClick={()=>setShownIds(old=>[...old,p.user_id])}><X size={20}/></button>
     <button className="like-button" onClick={()=>{setLikeTarget(p);setLikeNote('')}}><Heart size={18} fill="currentColor"/> {tr('sendLike')} <ArrowRight size={16}/></button>
     <button className="more-button" title={w.report} aria-label={w.report} onClick={()=>{if(p.demo){notice(w.preview);return}setShowReport(p)}}><Flag size={17}/></button>
    </div>
   </div>
  </article>)}</div>}
 function emptyState(title:string,body:string,icon:typeof Heart=Heart){const EmptyIcon=icon;return <div className="empty-state"><span className="empty-icon"><EmptyIcon size={27}/></span><h3>{title}</h3><p>{body}</p>{!isSigned&&<button className="primary-button" onClick={()=>setAuthOpen(true)}>{w.getStarted} <ArrowRight size={17}/></button>}</div>}
 function profileEditor(){
  return <form className="editor" onSubmit={saveProfile}>
   <div className="editor-grid"><label>{tr('name')}<input maxLength={60} required value={draft.display_name} onChange={e=>changeDraft('display_name',e.target.value)} placeholder="Your first name"/></label>
    {!me&&<label>{tr('birthday')} <small>18+</small><input type="date" required max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().slice(0,10)} value={birthday} onChange={e=>setBirthday(e.target.value)}/><small className="hint">{w.birthdayInfo}</small></label>}
    <label>{tr('city')}<input maxLength={100} required value={draft.city} onChange={e=>changeDraft('city',e.target.value)} placeholder="Stockholm / Barcelona"/></label>
    <label>{tr('country')}<select required value={draft.country} onChange={e=>changeDraft('country',e.target.value)}><option value="">{w.select}…</option>{countries.slice(1).map(c=><option key={c} value={c}>{c}</option>)}</select></label></div>
   <label>{tr('bio')}<textarea rows={3} maxLength={500} value={draft.bio} onChange={e=>changeDraft('bio',e.target.value)} placeholder={w.askFirst}/></label>
   <div className="editor-grid"><label>{tr('promptQuestion')}<input maxLength={160} value={draft.prompt_question} onChange={e=>changeDraft('prompt_question',e.target.value)}/></label><label>{tr('promptAnswer')}<input maxLength={500} value={draft.prompt_answer} onChange={e=>changeDraft('prompt_answer',e.target.value)}/></label></div>
   <div className="editor-section"><div className="section-kicker"><Sparkles size={17}/>{tr('selectArchetypes')} <span>{draft.archetypes.length}/8</span></div><div className="tag-picker">{categories.map(c=><button type="button" key={c.id} className={'choice-tag'+(draft.archetypes.includes(c.id)?' checked':'')} onClick={()=>toggleTag('archetypes',c.id,8)}>{c.emoji} {c.label}{draft.archetypes.includes(c.id)&&<Check size={14}/>}</button>)}</div></div>
   <div className="editor-section"><div className="section-kicker"><HeartHandshake size={17}/>{tr('selectInterests')} <span>{draft.interests.length}/30</span></div><div className="tag-picker">{interests.map(i=><button type="button" key={i} className={'choice-tag'+(draft.interests.includes(i)?' checked':'')} onClick={()=>toggleTag('interests',i,30)}>{i}{draft.interests.includes(i)&&<Check size={14}/>}</button>)}</div></div>
   {me&&<div className="editor-section"><div className="section-kicker"><Camera size={17}/>{tr('photos')} <span>{me.photos.length}/6</span></div><div className="photo-manager">{me.photos.map(path=><div className="uploaded-thumb" key={path}>{photos[path]?<img src={photos[path]} alt="Profile upload"/>:<Camera size={20}/>}<button type="button" aria-label="Remove photo" onClick={()=>void removePhoto(path)}><X size={13}/></button></div>)}{me.photos.length<6&&<label className="add-photo"><Plus size={24}/><span>{tr('chooseFile')}</span><input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto}/></label>}</div><small className="hint">{w.photoHint}</small></div>}
   <div className="editor-section toggles"><label className="switch-row"><span><strong>{w.showProfile}</strong><small>{draft.visible?w.profileVisible:w.profileHidden}</small></span><input type="checkbox" role="switch" checked={draft.visible} onChange={e=>changeDraft('visible',e.target.checked)}/></label>
   <label className="switch-row"><span><strong>{w.international}</strong><small>{w.worldOnly}</small></span><input type="checkbox" role="switch" checked={draft.worldwide} onChange={e=>changeDraft('worldwide',e.target.checked)}/></label></div>
   {!me&&<label className="check-row"><input type="checkbox" checked={sensitiveConsent} onChange={e=>setSensitiveConsent(e.target.checked)}/><span>{w.sensitive}</span></label>}
   <button className="primary-button wide" disabled={busy} type="submit">{busy?<LoaderCircle size={18} className="spin"/>:<Check size={17}/>} {me?w.save:tr('createProfile')}</button>
  </form>
 }
 const pageHeader=(eyebrow:string,title:string,note:string)=><div className="page-header"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{note}</p></div>;
 return <div className="app-shell">
  <aside className="desktop-sidebar"><div className="sidebar-inner"><button className="logo-button" onClick={()=>goto('discover')}><Logo/></button><div className="sidebar-intro">{tr('subtitle')}</div><nav className="side-nav">{navItems.map(([id,Icon,label])=><IconTab key={id} page={id} active={page} icon={Icon} label={tr(label)} onClick={goto}/>)}</nav>
   <div className="sidebar-card"><div className="sidebar-heart"><Heart size={19} fill="currentColor"/></div><strong>{w.introTitle}</strong><p>{w.introSub}</p><div className="sidebar-card-orbit">✳</div></div>
   <div className="sidebar-bottom"><span className="status-dot"/>{w.previewMode}<div className="sidebar-legal"><button onClick={()=>setLegalPage('privacy')}>{tr('privacy')}</button><span>·</span><button onClick={()=>setLegalPage('terms')}>{tr('terms')}</button></div></div>
  </div></aside>
  <div className="main-area"><header className="topbar"><button className="mobile-logo-button" onClick={()=>goto('discover')} aria-label="Latch"><Logo/></button><div className="topbar-subtitle"><span className="topbar-asterisk">✳</span>{w.previewMode}</div><div className="topbar-actions"><div className="language-select"><Globe2 size={16}/><select value={lang} aria-label={w.language} onChange={e=>setLang(e.target.value as Lang)}><option value="en">EN</option><option value="sv">SV</option><option value="es">ES</option></select></div>
   <button className="top-icon-button notification-button" aria-label={w.notifyTitle} onClick={()=>void markNotices()}><Bell size={19}/>{unread>0&&<span className="notification-count">{unread>9?'9+':unread}</span>}</button>
   {isSigned?<button className="header-avatar" onClick={()=>goto('profile')} title={tr('profile')}>{me?.display_name?.slice(0,1).toUpperCase()||'L'}</button>:<button className="header-login" onClick={()=>{setSignup(false);setAuthOpen(true)}}>{tr('login')} <ArrowRight size={15}/></button>}
  </div></header>
  <main className="page-container">
  {page==='discover'&&<>
   <section className="hero"><div className="hero-copy"><div className="hero-eyebrow"><span className="mini-spark">✳</span> {w.eyebrow}</div><h1>{w.headline} <em>{w.headlineAccent}</em></h1><p>{w.deck}</p><div className="hero-action-row">{!isSigned?<button className="primary-button" onClick={()=>{setSignup(true);setAuthOpen(true)}}>{tr('join')} <ArrowRight size={18}/></button>:<button className="primary-button" onClick={()=>document.getElementById('discover-feed')?.scrollIntoView({behavior:'smooth'})}>{w.browse} <ArrowRight size={18}/></button>}<div className="hero-social"><span className="mini-avatars"><span>✦</span><span>♡</span><span>✳</span></span><small>{w.introSub}</small></div></div></div><div className="hero-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/><div className="hero-heart"><Heart size={64} strokeWidth={1.5} fill="rgba(255,255,255,.14)"/></div><div className="hero-note note-top"><span>🎵</span> You both love music</div><div className="hero-note note-bottom"><span>✦</span> Common ground</div><div className="floating-symbol">✳</div></div></section>
   <section className="discovery-section" id="discover-feed"><div className="heading-flex"><div><div className="eyebrow">{w.browse}</div><h2>{w.discoverTitle}<span className="title-dot">.</span></h2><p>{w.discoverNote}</p></div><div className="member-counter"><span/> {showDemo?w.preview:w.real}</div></div>
   <div className="filters-panel"><div className="filter-top"><div className="scope-toggle"><button className={scope==='nearby'?'selected':''} onClick={()=>setScope('nearby')}><MapPin size={16}/> {tr('nearby')}</button><button className={scope==='worldwide'?'selected':''} onClick={()=>setScope('worldwide')}><Globe2 size={16}/> {tr('worldwide')}</button></div><div className="filter-search"><Search size={17}/><input aria-label={tr('search')} placeholder={tr('search')} value={filter} onChange={e=>setFilter(e.target.value)}/>{filter&&<button onClick={()=>setFilter('')} aria-label="Clear search"><X size={14}/></button>}</div></div>
   <div className="filter-bottom"><div className="filter-chips"><button className={'filter-chip'+(category==='all'?' chosen':'')} onClick={()=>setCategory('all')}>{tr('all')}</button>{categories.map(c=><button key={c.id} className={'filter-chip'+(category===c.id?' chosen':'')} onClick={()=>setCategory(c.id)}>{c.emoji} {c.label}</button>)}</div>{scope==='worldwide'&&<div className="country-select"><Globe2 size={16}/><select value={country} onChange={e=>setCountry(e.target.value)} aria-label={tr('country')}>{countries.map(c=><option key={c}>{c}</option>)}</select></div>}</div>
   <div className="filter-caption"><Info size={14}/> {scope==='nearby'?w.cityOnly:w.worldOnly}</div>
   </div>
   {(showDemo||!me)&&<div className="preview-notice"><Eye size={17}/><span>{w.preview}</span><button onClick={()=>setAuthOpen(true)}>{tr('join')} <ChevronRight size={15}/></button></div>}
   {visible.length?cards(visible):emptyState(w.noProfiles,w.noProfilesText,Compass)}
   {!isSigned&&<div className="below-feed-cta"><span>✳</span><h2>{w.beFirst}</h2><p>{w.previewExplain}</p><button className="light-button" onClick={()=>{setSignup(true);setAuthOpen(true)}}>{w.invite}<ArrowRight size={17}/></button></div>}
   </section>
  </>}
  {page==='likes'&&<section className="inner-section">{pageHeader('01 / LATCH',tr('likes'),w.likeEmpty)}{!isSigned?emptyState(w.signedOut,w.memberOnly,Heart):likes.length?<div className="simple-list">{likes.map(item=><div className="list-row" key={item.receiver_id}><span className="list-round"><Heart size={19}/></span><span><strong>{members[item.receiver_id]?.display_name||'Member'}</strong><small>{w.sentLikes} · {new Date(item.created_at).toLocaleDateString(lang)}</small></span><Check className="list-right" size={18}/></div>)}</div>:emptyState(tr('noLikes'),w.likeEmpty,Heart)}</section>}
  {page==='matches'&&<section className="inner-section">{pageHeader('02 / LATCH',tr('matches'),w.chatEmpty)}{!isSigned?emptyState(w.signedOut,w.memberOnly,MessageCircle):chatId?<div className="chat-shell"><div className="chat-header"><button className="icon-button" onClick={()=>setChatId(null)} aria-label="Back"><ArrowLeft size={19}/></button><div className="chat-partner-avatar">{chatPartner?.display_name.slice(0,1)||'♡'}</div><div><strong>{chatPartner?.display_name||'Connection'}</strong><small>{w.yourChats}</small></div></div><div className="message-scroll">{messages.length?messages.map(m=><div key={m.id} className={'chat-message'+(m.sender_id===uid?' mine':'')}><span>{m.content}</span><small>{new Date(m.created_at).toLocaleTimeString(lang,{hour:'2-digit',minute:'2-digit'})}</small></div>):<div className="first-message"><Sparkles size={25}/><h3>{w.introTitle}</h3><p>{tr('noMessages')}</p></div>}</div><form className="message-form" onSubmit={sendMessage}><input required value={messageDraft} maxLength={2000} onChange={e=>setMessageDraft(e.target.value)} placeholder={w.compose}/><button disabled={!messageDraft.trim()||busy} type="submit" aria-label={tr('send')}><Send size={19}/></button></form></div>:matches.length?<div className="simple-list">{matches.map(m=>{const id=m.user_a===uid?m.user_b:m.user_a;const other=members[id];return <button className="list-row list-button" key={m.id} onClick={()=>setChatId(m.id)}><span className="list-round pink">{other?.display_name?.slice(0,1)||'♡'}</span><span><strong>{other?.display_name||'Connection'}</strong><small>{w.openChat}</small></span><ChevronRight className="list-right" size={19}/></button>})}</div>:emptyState(tr('noMatches'),w.chatEmpty,MessageCircle)}</section>}
  {page==='profile'&&<section className="inner-section">{pageHeader('03 / LATCH',tr('yourProfile'),w.accountSub)}{!isSigned?emptyState(w.yourSpace,w.memberOnly,UserRound):<div className="content-card">{me&&<div className="profile-banner"><span className="profile-initial">{me.display_name.slice(0,1).toUpperCase()}</span><div><h3>{me.display_name}, {me.age}</h3><p><MapPin size={14}/>{me.city}, {me.country}</p><small>{me.visible?w.profileVisible:w.profileHidden}</small></div></div>}{profileEditor()}</div>}</section>}
  {page==='settings'&&<section className="inner-section">{pageHeader('04 / LATCH',tr('settings'),w.safety)}<div className="settings-stack">
   <div className="setting-card"><div className="setting-title"><Globe2 size={20}/><h3>{w.language}</h3></div><div className="language-buttons">{(['en','sv','es'] as const).map(code=><button key={code} className={lang===code?'chosen':''} onClick={()=>setLang(code)}>{code==='en'?'English':code==='sv'?'Svenska':'Español'}{lang===code&&<Check size={15}/>}</button>)}</div></div>
   <div className="setting-card"><div className="setting-title"><Bell size={20}/><h3>{tr('notifications')}</h3></div><p className="setting-sub">{w.notificationsInfo}</p><button className="secondary-button" onClick={()=>void browserNotifications()}><Bell size={17}/>{w.notifications} {notificationPermission==='granted'&&<Check size={16}/>}</button>{isSigned&&<div className="setting-toggles"><label className="switch-row"><span>{tr('notificationToggle')} — {tr('matches')}</span><input type="checkbox" role="switch" checked={notifyPrefs.notify_matches} onChange={e=>void saveNotificationPrefs('notify_matches',e.target.checked)}/></label><label className="switch-row"><span>{tr('notificationToggle')} — {tr('message')}</span><input type="checkbox" role="switch" checked={notifyPrefs.notify_messages} onChange={e=>void saveNotificationPrefs('notify_messages',e.target.checked)}/></label></div>}</div>
   <div className="setting-card"><div className="setting-title"><LockKeyhole size={20}/><h3>{w.safety}</h3></div><button className="setting-link" onClick={()=>setLegalPage('privacy')}><ShieldCheck size={17}/>{tr('privacy')}<ChevronRight size={17}/></button><button className="setting-link" onClick={()=>setLegalPage('terms')}><BookOpen size={17}/>{tr('terms')}<ChevronRight size={17}/></button><button className="setting-link" onClick={()=>setCookieOpen(true)}><Cookie size={17}/>{tr('cookieSettings')}<ChevronRight size={17}/></button><div className="cookie-status"><Check size={14}/>{cookieAnalytics?w.all:w.essential}</div></div>
   {isSigned&&<div className="setting-card"><div className="setting-title"><Download size={20}/><h3>{w.data}</h3></div><button className="setting-link" onClick={()=>void downloadData()}><Download size={17}/>{w.download}<ChevronRight size={17}/></button><div className="delete-note"><Trash2 size={17}/><span><strong>{w.delete}</strong><small>{w.deleteInfo}</small></span></div><button className="secondary-button signout" onClick={async()=>{await supabase.auth.signOut();setPage('discover')}}><LogOut size={17}/>{w.logOut}</button></div>}
   <div className="setting-card disclaimer"><Info size={18}/><p>{w.warning}</p></div>
  </div></section>}
  <footer className="site-footer"><span><Logo/></span><div>{w.previewMode}</div><nav><button onClick={()=>setLegalPage('privacy')}>{tr('privacy')}</button><button onClick={()=>setLegalPage('terms')}>{tr('terms')}</button><button onClick={()=>setLegalPage('cookies')}>{tr('cookies')}</button></nav><small>© {new Date().getFullYear()} Latch · {tr('subtitle')}</small></footer>
  </main>
  </div>
  <nav className="mobile-bottom-nav">{navItems.map(([id,Icon,label])=><button key={id} className={page===id?'active':''} onClick={()=>goto(id)}><Icon size={21}/><span>{tr(label)}</span></button>)}</nav>
  {toast&&<div role="status" className={'toast'+(toast.bad?' error':'')}><span>{toast.bad?'!':'✓'}</span>{toast.msg}<button aria-label="Close" onClick={()=>setToast(null)}><X size={14}/></button></div>}
  {showActivity&&<div className="modal-backdrop" onClick={()=>setShowActivity(false)}><section className="activity-modal modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowActivity(false)} aria-label="Close"><X/></button><div className="modal-asterisk">✳</div><h2>{w.notifyTitle}</h2>{!isSigned?<p>{w.memberOnly}</p>:notices.length?notices.map(n=><div className="activity-row" key={n.id}><span><Bell size={17}/></span><div><strong>{n.category==='match'?tr('matches'):tr('message')}</strong><small>{new Date(n.created_at).toLocaleString(lang)}</small></div></div>):<p>{w.noActivity}</p>}</section></div>}
  {authOpen&&<div className="modal-backdrop" onClick={()=>setAuthOpen(false)}><section className="modal auth-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setAuthOpen(false)} aria-label="Close"><X/></button><div className="modal-asterisk">✳</div><div className="eyebrow">{w.previewMode}</div><h2>{signup?w.signUp:w.signIn}</h2><p className="modal-desc">{w.signedOut}</p><form onSubmit={authenticate}><label>{tr('email')}<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>{tr('password')}<input type="password" required minLength={8} autoComplete={signup?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>{signup&&<><label className="check-row"><input type="checkbox" required checked={signupAdult} onChange={e=>setSignupAdult(e.target.checked)}/>{w.ageCheck}</label><label className="check-row"><input type="checkbox" required checked={signupTerms} onChange={e=>setSignupTerms(e.target.checked)}/>{w.agree}</label><div className="policy-inline"><button type="button" onClick={()=>setLegalPage('terms')}>{tr('terms')}</button><button type="button" onClick={()=>setLegalPage('privacy')}>{tr('privacy')}</button></div></>}<button className="primary-button wide" disabled={busy} type="submit">{busy?<LoaderCircle size={18} className="spin"/>:<ArrowRight size={18}/>} {signup?tr('signUp'):tr('signIn')}</button></form><p className="auth-switch">{signup?w.alreadyHere:w.newHere} <button onClick={()=>setSignup(!signup)}>{signup?tr('signIn'):tr('signUp')}</button></p><div className="auth-note"><ShieldCheck size={16}/>{tr('signUpAge')}</div></section></div>}
  {onboarding&&isSigned&&!authOpen&&page!=='profile'&&<div className="modal-backdrop onboarding-backdrop"><section className="modal onboarding-modal"><div className="modal-asterisk">✳</div><div className="eyebrow">{w.previewMode}</div><h2>{tr('onboarding')}</h2><p className="modal-desc">{tr('onboardingDesc')}</p>{profileEditor()}<button className="text-button" onClick={async()=>{await supabase.auth.signOut();setPage('discover')}}>{tr('logout')}</button></section></div>}
  {likeTarget&&<div className="modal-backdrop" onClick={()=>setLikeTarget(null)}><section className="modal like-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setLikeTarget(null)} aria-label="Close"><X/></button><div className="modal-heart"><Heart fill="currentColor" size={22}/></div><h2>{tr('sendLike')}</h2><p>{likeTarget.display_name} · {likeTarget.interests.slice(0,2).join(' · ')}</p>{likeTarget.demo&&<div className="preview-small">{w.preview}</div>}<textarea rows={3} maxLength={280} value={likeNote} onChange={e=>setLikeNote(e.target.value)} placeholder={w.compose}/><button className="primary-button wide" disabled={busy} onClick={()=>void sendLike()}><Heart size={17} fill="currentColor"/>{likeTarget.demo?w.getStarted:tr('sendLike')}</button></section></div>}
  {showReport&&<div className="modal-backdrop" onClick={()=>setShowReport(null)}><section className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowReport(null)} aria-label="Close"><X/></button><div className="eyebrow">{w.safety}</div><h2>{w.report}</h2><p>{w.reportNote}</p><label>{w.why}<select value={reportReason} onChange={e=>setReportReason(e.target.value)}>{(['fake','harassment','underage','spam','other'] as const).map(r=><option value={r} key={r}>{tr(r)}</option>)}</select></label><button className="primary-button wide" disabled={busy} onClick={()=>void submitReport()}><Flag size={16}/>{tr('submit')}</button><button className="secondary-button wide" onClick={()=>void blockPerson(showReport)}><EyeOff size={16}/>{tr('block')}</button></section></div>}
  {legalPage&&<div className="modal-backdrop legal-backdrop" onClick={()=>setLegalPage(null)}><section className="modal legal-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setLegalPage(null)} aria-label="Close"><X/></button><div className="eyebrow">LATCH / LEGAL</div><h2>{legal[lang][legalPage].title}</h2><p className="legal-warning"><Info size={16}/>{w.legalBanner}</p>{legal[lang][legalPage].sections.map(s=><div className="legal-section" key={s.heading}><h3>{s.heading}</h3><p>{s.body}</p></div>)}<button className="primary-button" onClick={()=>setLegalPage(null)}>{w.done}</button></section></div>}
  {cookieOpen&&<div className="cookie-banner"><div className="cookie-icon"><Cookie size={24}/></div><div className="cookie-copy"><strong>{w.cookieTitle}</strong><p>{w.cookieSub}</p><button onClick={()=>setLegalPage('cookies')}>{tr('cookies')} <ChevronRight size={14}/></button></div><div className="cookie-actions"><button className="secondary-button" onClick={()=>saveCookies(false)}>{w.essential}</button><button className="primary-button" onClick={()=>saveCookies(true)}>{w.all}</button></div></div>}
 </div>;
}
