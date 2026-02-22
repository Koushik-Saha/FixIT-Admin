// lib/supabase/middleware.ts
// Fallback middleware since Supabase is removed
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Since Supabase env vars are gone, return a mock user if MOCK_AUTH is enabled, 
  // or simple bypass.
  const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'

  const mockUser = isMockAuth ? {
    id: "mock_user_id",
    email: "admin@fixitup.com",
    role: "admin"
  } : null

  return { response, user: mockUser }
}
