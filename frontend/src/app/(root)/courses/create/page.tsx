import { getCurrentUserWithProfile } from '@/actions/profile.actions'
import CreateCourse from '@/components/CreateCourse'
import { redirect } from 'next/navigation'

const CreateCoursePage = async () => {
        const userProfile = await getCurrentUserWithProfile()

        if (!userProfile) {
            redirect('/sign-in')
        }
    return (
        <CreateCourse userProfile={userProfile}/>
        
    )
}

export default CreateCoursePage