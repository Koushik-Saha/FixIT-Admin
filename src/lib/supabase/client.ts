// lib/supabase/client.ts
// Client-side Supabase client (for browser)

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            auth: {
                persistSession: true,
                storageKey: 'sb-fixit-admin-auth-token',
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: 'pkce'
            },
            cookieOptions: {
                name: 'sb-fixit-admin-auth-token',
                domain: undefined, // Will use current domain
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    )
}
