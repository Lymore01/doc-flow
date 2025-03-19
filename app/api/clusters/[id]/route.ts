import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { deleteDocument } from "../../../../supabase/storage/client";

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
        documents: {
          include: {
            document: true
          }
        },
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

  if (!id) {
    return NextResponse.json(
      { error: "Cluster ID is required!" },
      { status: 400 }
    );
  }

  try {
    // Get all documents in the cluster
    const clusterToDelete = await prisma.cluster.findUnique({
      where: { id },
      select: {
        documents: {
          select: {
            document: {
              select: { url: true },
            }
          }
        },
      },
    });

    if (!clusterToDelete) {
      return NextResponse.json(
        { error: "Cluster not found!" },
        { status: 404 }
      );
    }

    // Delete documents from Supabase only if they exist
    if (clusterToDelete.documents.length > 0) {
      await Promise.all(
        clusterToDelete.documents.map(async (doc) => {
          if (doc.document.url) {
            try {
              await deleteDocument({ fileUrl: doc.document.url });
              //delete document
              await prisma.document.deleteMany({
                where: {
                  url: doc.document.url 
                }
              })
              console.log(`Successfully deleted document: ${doc.document.url}`);
            } catch (error) {
              console.error("Error deleting document from Supabase:", error);
            }
          }
        })
      );
    }

    // Delete the cluster from Prisma
    const cluster = await prisma.cluster.delete({
      where: { id },
    });

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

