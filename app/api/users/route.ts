/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// post, put, delete

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error getting users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: { email: string; id: string; name: string; image?: string } =
      await request.json();
    const { email, id, name, image } = body;

    // validate
    if (!email || !id || !name) {
      return NextResponse.json(
        { error: "Failed Webhook Response!" },
        { status: 404 }
      );
    }

    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
        image,
      },
    });

    return NextResponse.json(
      { message: "User Created Successfully!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error posting a user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// update a user
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  try {
    const body: { image: string } = await request.json();
    const { image } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    // check if the user is available
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image,
      },
    });

    if (!image) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User Image Updated!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating a user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "User Deleted!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cluster:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
