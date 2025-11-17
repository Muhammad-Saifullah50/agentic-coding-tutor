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

export async function getUserCourses(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('Course')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user courses:', error);
    return null;
  }

  return data;
}

export async function updateCourseProgress(courseId: string, courseData: any) {
  const { data, error } = await supabaseAdmin
    .from('Course')
    .update({ course_data: courseData })
    .eq('course_id', courseId);

  if (error) {
    console.error('Error updating course progress:', error);
    return null;
  }

  return data;
}
