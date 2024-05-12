import { db } from "@/lib/db";
import { utapi } from "@/app/server/uploadthing";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      courseId: string;
      attachmentId: string;
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
    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });
    await utapi.deleteFiles(`${attachment.url}.pdf`);
    return NextResponse.json(attachment, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return NextResponse.json("Internal Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
