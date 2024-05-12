import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
    const { url } = await request.json();
    if (!userId) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const courseOwnner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwnner) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });
    return NextResponse.json(attachment, {
      status: 201,
      statusText: "Created",
    });
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return NextResponse.json("Internal Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
