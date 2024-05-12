import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    const { title } = await request.json();
    if (!userId) {
      return NextResponse.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    console.log(course);

    return NextResponse.json(course, {
      status: 201,
      statusText: "Created",
    });
  } catch (error) {
    console.log("[COURSES]", error);
    return NextResponse.json("Internal Error", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
