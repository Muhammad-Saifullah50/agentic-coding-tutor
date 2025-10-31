'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import { updateUserProfile } from './profile.actions'


export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, error: error.message }

  }

  revalidatePath('/', 'layout')
  return { success: true }
}



export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Perform Supabase signup
  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { success: false, error: error.message }
  }

  const profileData = {
    username: data.name,
    email: data.email,
  }
  const updatedProfile =await updateUserProfile(profileData)

  if (updatedProfile) {
  return { success: true }
  }
}
