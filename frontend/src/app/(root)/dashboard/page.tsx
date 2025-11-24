import { getUserCourses } from "@/actions/course.actions";
import { getUserDetails } from "@/actions/user.actions";
import Dashboard from "@/components/Dashboard";
import { PaymentSuccessHandler } from "@/components/client/PaymentSuccessHandler";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) redirect('/login')

  const courses = (await getUserCourses(user.id)) || [];
  const userProfile = await getUserDetails(user.id);

  return (
    <>
      <PaymentSuccessHandler />
      <Dashboard courses={courses as any} userProfile={userProfile} />
    </>
  );
};

export default DashboardPage;