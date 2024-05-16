import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseMobileSidebar from "./course-mobile-sidebar";

type CourseNavbarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
