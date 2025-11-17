'use server';

import { supabaseAdmin } from '@/utils/supabase/admin'; // Import the existing admin client

export async function getCourseByCourseId(courseId: string) {
  

  const { data, error } = await supabaseAdmin
    .from('Course') // Assuming your table name is 'Course'
    .select('*')
    .eq('course_id', courseId)
    .single(); // Expecting a single course

  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }

  return data;
}
