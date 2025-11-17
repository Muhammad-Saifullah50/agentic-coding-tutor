import Course from "@/components/Course"
import { getCourseByCourseId } from "@/actions/course.actions";

const IndividualCoursePage = async ({ params }: { params: { courseId: string } }) => {

  const usableParams = await params;

  const course = await getCourseByCourseId(usableParams.courseId);
  
  return (
    <Course courseData={course}/>
  )
}

export default IndividualCoursePage