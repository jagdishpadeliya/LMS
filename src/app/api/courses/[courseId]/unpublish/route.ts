import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!course) {
      return NextResponse.json("Course not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
    const updatedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(updatedCourse, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH", error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
