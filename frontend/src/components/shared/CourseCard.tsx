import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";
import { FullCourseData } from "@/types/course";

interface CourseCardProps {
    course: FullCourseData;
    totalLessons: number;
    totalDuration: string;
    progress: number;
}

export const CourseCard = ({ course, totalLessons, totalDuration, progress }: CourseCardProps) => {
    return (
        <Card className="border-border/50 hover:shadow-lg transition-all">
            <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Lesson count + duration */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{totalDuration}</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Modules Display */}
                <div className="text-sm text-muted-foreground">
                    <strong>Modules:</strong>
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                        {course.course_data.modules.map((mod, i) => (
                            <li key={i}>
                                {mod.title} ({mod.lessons.length} lessons)
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>

            <CardFooter>
                <Link href={`/courses/${course.course_id}`} className="w-full">
                    <Button className="btn-hero w-full rounded-xl">
                        Continue Learning
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};
