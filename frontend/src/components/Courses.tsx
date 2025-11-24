import { BookOpen } from "lucide-react";
import { FullCourseData } from "@/types/course";
import { CourseCard } from "./shared/CourseCard";
import { EmptyCoursesState } from "./client/EmptyCoursesState";

// Helper: Get total lessons
const getTotalLessons = (course: FullCourseData) =>
  course.course_data.modules.reduce((sum, m) => sum + m.lessons.length, 0);

// Helper: Calculate total duration (string sum)
const getTotalDuration = (course: FullCourseData) => {
  const durations = course.course_data.modules
    .flatMap((m) => m.lessons.map((l) => parseInt(l.duration)))
    .filter(Boolean);

  const totalMinutes = durations.reduce((a, b) => a + b, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
};

// Helper: Calculate progress %
const getProgress = (course: FullCourseData) => {
  const lessons = course.course_data.modules.flatMap(m => m.lessons);
  const completed = lessons.filter(l => l.completed).length;
  return lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
};

const Courses = ({ courses }: { courses: FullCourseData[] }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Explore <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a course and start your learning journey
          </p>
        </div>

        {/* Course Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            My Courses
          </h2>

          {courses.length === 0 ? (
            <EmptyCoursesState />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const totalLessons = getTotalLessons(course);
                const totalDuration = getTotalDuration(course);
                const progress = getProgress(course);

                return (
                  <CourseCard
                    key={course.slug}
                    course={course}
                    totalLessons={totalLessons}
                    totalDuration={totalDuration}
                    progress={progress}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

