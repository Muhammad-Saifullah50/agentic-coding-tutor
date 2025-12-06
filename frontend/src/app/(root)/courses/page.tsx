import { getUserCourses } from '@/actions/course.actions'
import Courses from '@/components/Courses'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My Courses | CodeQuora",
  description: "View and manage your AI-generated programming courses. Continue your learning journey with personalized lessons.",
  robots: { index: false, follow: false }, // Private page
};

const MyCoursesPage = async () => {
  const user = await currentUser()

  if (!user) redirect('/sign-in')
  const courses = await getUserCourses(user?.id)
  return (
    <Courses courses={courses} />
  )
}

export default MyCoursesPage