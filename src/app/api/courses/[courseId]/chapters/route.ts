import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
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
    const { title } = await request.json();
    if (!userId) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 0;
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });
    return NextResponse.json(chapter, {
      status: 201,
      statusText: "Created",
    });
  } catch (error) {
    console.log("COURSE", error);
  }
}
