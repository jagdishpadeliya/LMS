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
    const { courseId } = params;
    const values = await request.json();
    if (!userId) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course, { status: 200, statusText: "OK" });
  } catch (error) {
    return NextResponse.json("Something went wrong", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
