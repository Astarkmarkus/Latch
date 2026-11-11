import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL || 'https://lzcuhmszshahknmdmezl.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_wVSpaHvBwUL2hsLmOIxpww_sxQzCMGm';
export const supabase = createClient(url,key,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
export type Profile={
 user_id:string;display_name:string;age:number;city:string;country:string;bio:string;
 prompt_question:string;prompt_answer:string;archetypes:string[];interests:string[];
 photos:string[];language:'en'|'sv'|'es';worldwide:boolean;visible:boolean;
 verification_status:'unverified'|'pending'|'verified';created_at?:string
};
export type LatchMatch={id:string;user_a:string;user_b:string;created_at:string};
export type LatchMessage={id:string;match_id:string;sender_id:string;content:string;created_at:string};
export type LatchNotification={id:string;user_id:string;actor_id:string|null;category:'match'|'message';match_id:string|null;is_read:boolean;created_at:string};
