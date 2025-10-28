import Courses from '@/components/Courses'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'


const MyCoursesPage = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return (
    <Courses />
  )
}

export default MyCoursesPage