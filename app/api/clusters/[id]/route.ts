import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// get update delete cluster

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const cluster = await prisma.cluster.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        documents: true,
        link: true,
      },
    });
    if (!cluster) {
      return NextResponse.json(
        { error: "Cluster not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cluster Fetched!", cluster },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cluster:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const body: { name: string } = await request.json();
    const { name } = body;
    const cluster = await prisma.cluster.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    if (!cluster) {
      return NextResponse.json(
        { error: "Cluster not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cluster Updated!", cluster },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cluster:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const cluster = await prisma.cluster.delete({
      where: {
        id,
      },
    });
    if (!cluster) {
      return NextResponse.json(
        { error: "Cluster not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Cluster Deleted!", cluster },
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
