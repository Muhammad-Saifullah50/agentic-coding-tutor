"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CourseBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isCoursePage = pathname.startsWith("/courses/");

  if (!isCoursePage) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push("/courses")}
      className="gap-2"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="sr-only">Back to Courses</span>
    </Button>
  );
}
