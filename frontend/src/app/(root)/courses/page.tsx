
import { getUserCourses } from '@/actions/course.actions'
import Courses from '@/components/Courses'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const MyCoursesPage = async () => {
  const user = await currentUser()

  if (!user) redirect('/login')
  const courses = await getUserCourses(user?.id)
  return (
    <Courses courses={courses} />
  )
}

export default MyCoursesPage