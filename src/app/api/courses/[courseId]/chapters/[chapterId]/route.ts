import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
      chapterId: string;
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
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if (!chapter) {
      return NextResponse.json("Chapter not found", {
        status: 404,
        statusText: "Not Found",
      });
    }
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    return NextResponse.json(deletedChapter, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("[COURSES_ID_DELETE", error);
    return NextResponse.json("Internal Error", {
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
      chapterId: string;
    };
  },
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await request.json();
    console.log(values);

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
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });
      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }
    if (values.videoUrl) {
      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });
      if (asset) {
        await db.muxData.create({
          data: {
            assetId: asset.id,
            chapterId: params.chapterId,
            playbackId: asset.playback_ids?.[0]?.id || "",
          },
        });
      }
    }
    return NextResponse.json(chapter, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID", JSON.stringify(error?.error?.messages));
    return NextResponse.json("Internal Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
