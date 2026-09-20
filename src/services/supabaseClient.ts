import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://spnjgwucysxmidcersve.supabase.co';
const SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || 'mock-anon-key-12345';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SITE_URL = metaEnv.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
