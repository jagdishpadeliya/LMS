import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
export async function DELETE(
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return NextResponse.json("Course not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
        await db.muxData.delete({
          where: {
            id: chapter.muxData.id,
          },
        });
      }
    }
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });
    return NextResponse.json(deletedCourse, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("[COURSE_ID_DELETE", error);
    return NextResponse.json("Internal Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

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
