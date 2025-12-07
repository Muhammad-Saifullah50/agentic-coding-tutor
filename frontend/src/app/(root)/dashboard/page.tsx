import { getUserCourses } from "@/actions/course.actions";
import { getUserDetails } from "@/actions/user.actions";
import Dashboard from "@/components/Dashboard";
import { PaymentSuccessHandler } from "@/components/client/PaymentSuccessHandler";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CodeQuora",
  description: "Track your learning progress, manage your courses, and view your achievements on your personalized dashboard.",
    robots: { index: false, follow: false },
};

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) redirect('/sign-in')

  const courses = (await getUserCourses(user.id)) || [];
  const userProfile = await getUserDetails(user.id);

  if (!userProfile?.onBoarded) {
    redirect('/onboarding');
  }
  
  return (
    <>
      <PaymentSuccessHandler />
      <Dashboard courses={courses as any} userProfile={userProfile} />
    </>
  );
};

export default DashboardPage;