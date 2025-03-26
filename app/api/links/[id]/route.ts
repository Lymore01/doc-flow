import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// get update delete a document

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    const link = await prisma.link.findUnique({
      where: {
        id,
      },
    });
    if(!link){
      return NextResponse.json
    }
    return NextResponse.json(
      { message: "Link Fetched!", link },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//! fix remove the update and delete routes
export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    const { profileDescription, backgroundColor } = await request.json();
    const link = await prisma.link.update({
      where: {
        id,
      },
      data: {
        profileDescription,
        backgroundColor
      },
    });
    return NextResponse.json({ message: "Link Updated!", link }, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const id = params.id;
    await prisma.link.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "Link Deleted!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
