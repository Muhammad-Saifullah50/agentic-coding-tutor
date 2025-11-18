import { getUserCourses } from "@/actions/course.actions";
import Dashboard from "@/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const user = await currentUser();
  
  if (!user) redirect('/login') 

  const  courses = await getUserCourses(user.id);
  return <Dashboard courses={courses} />;
};

export default DashboardPage;