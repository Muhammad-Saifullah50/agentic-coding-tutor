import { getUserCourses } from "@/actions/course.actions";
import { getUserDetails } from "@/actions/user.actions";
import Dashboard from "@/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) redirect('/login')

  const courses = (await getUserCourses(user.id)) || [];
  const userProfile = await getUserDetails(user.id);

  return <Dashboard courses={courses as any} userProfile={userProfile} />;
};

export default DashboardPage;