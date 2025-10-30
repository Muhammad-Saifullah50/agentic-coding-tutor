'use client'

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'


export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true

    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!isMounted) return

      if (error) {
        console.error('Error fetching user:', error.message)
      }

      setUser(data?.user ?? null)
      setLoading(false)
    }

    getUser()

    // Listen for auth state changes (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
