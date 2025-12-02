import { getCurrentUserWithProfile } from '@/actions/profile.actions'
import CreateCourse from '@/components/CreateCourse'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Create Course | CodeQuora",
    description: "Generate your personalized AI-powered coding course tailored to your learning goals and experience level.",
    robots: { index: false, follow: false },
};

const CreateCoursePage = async () => {
    const userProfile = await getCurrentUserWithProfile()

    if (!userProfile) {
        redirect('/sign-in')
    }
    return (
        <CreateCourse userProfile={userProfile} />
    )
}

export default CreateCoursePage