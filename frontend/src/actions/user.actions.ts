'use server'

import { createClient } from '@/utils/supabase/server'

export const getCurrentUser = async () => {
  const supabase = await createClient()

  // ✅ Get session (contains the access token)
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    console.error('No session found:', sessionError)
    return null
  }

  // ✅ Get Auth user info
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('No user found:', userError)
    return null
  }

  // ✅ Fetch profile using user's ID + session token
  const res = await fetch(
    `https://xxcqpwddpfrspgqtxvrb.supabase.co/rest/v1/UserProfile?id=eq.${user.id}&select=*`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }
    }
  )

  const data = await res.json()
  console.log('Fetched profile:', data)

  return data?.[0] || null
}
