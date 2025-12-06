import { getCurrentUserWithProfile } from "@/actions/profile.actions";
import Onboarding from "@/components/Onboarding"
import { redirect } from "next/navigation";


const OnboardingPage = async () => {
  const user = await getCurrentUserWithProfile()

  if (user?.onBoarded) redirect('/dashboard');

  return (

      <Onboarding userId={user?.userId!} />
  )
}

export default OnboardingPage

