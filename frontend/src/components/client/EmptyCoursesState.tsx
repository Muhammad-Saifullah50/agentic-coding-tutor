'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const EmptyCoursesState = () => {
    return (
        <div className="text-center py-12 border rounded-xl bg-card/50 border-border/50">
            <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                    <BookOpen className="w-8 h-8 text-primary" />
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">You haven't created any courses yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get started by creating your first AI-powered course. It only takes a few minutes!
            </p>
            <Link href="/courses/create">
                <Button className="btn-hero rounded-xl">
                    Create Your First Course
                </Button>
            </Link>
        </div>
    );
};
