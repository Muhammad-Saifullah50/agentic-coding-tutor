import { getUserDetails } from "@/actions/user.actions";
import { getUserCourses } from "@/actions/course.actions";
import Profile from "@/components/Profile";
import { FullCourseData } from "@/types/course";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserProfilePage = async ({ params }: PageProps) => {

  const usableParams = await params;
  const userProfile = await getUserDetails(usableParams.userId);
  const courses = await getUserCourses(usableParams.userId) as FullCourseData[] | null;

  // Calculate real progress data
  let totalLessons = 0;
  let completedLessons = 0;

  if (courses) {
    courses.forEach(course => {
      course.course_data.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          totalLessons++;
          if (lesson.completed) {
            completedLessons++;
          }
        });
      });
    });
  }

  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const progressData = {
    totalCourses: courses?.length || 0,
    completedLessons,
    totalLessons,
    completionPercentage,
  };

  return <Profile userProfile={userProfile} progressData={progressData} />;
};

export default UserProfilePage;