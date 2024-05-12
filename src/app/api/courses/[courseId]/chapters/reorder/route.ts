import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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
    //assign type { id: string; position: number }[] to list
    const {
      list,
    }: {
      list: { id: string; position: number }[];
    } = await request.json();
    const ownerCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!ownerCourse) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }
    return NextResponse.json("OK", {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("[REORDER]", error);
    return NextResponse.json("Internal Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
