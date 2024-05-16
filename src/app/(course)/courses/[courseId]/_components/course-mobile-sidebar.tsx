import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import React from "react";
import CourseSidebar from "./course-sidebar";

type CourseMobileSidebarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
};

const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent
        className="w-72 bg-background p-0"
        draggable={true}
        side={"left"}
      >
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
