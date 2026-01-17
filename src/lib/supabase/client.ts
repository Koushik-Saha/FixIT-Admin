// lib/supabase/client.ts
// Client-side Supabase client (for browser)

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: true,
                storageKey: 'fixit-admin-auth',
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
            cookieOptions: {
                name: 'fixit-admin-auth',
                maxAge: 86400, // 1 day in seconds
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    )
}
