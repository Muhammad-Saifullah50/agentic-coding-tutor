'use server';

import { supabaseAdmin } from "../utils/supabase/admin";

export const getUserDetails = async (userId: string) => {
  if (!userId) return null;

  const { data, error } = await supabaseAdmin
    .from('UserProfile')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();

  if (error) {
  }
  return data;


}
