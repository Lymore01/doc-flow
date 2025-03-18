import { Type } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// get post update delete a document

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
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
    });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found!" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Document Fetched!", document },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const id = params.id;

  try {
    const body: { name: string; clusterId: string; type: Type; url: string } =
      await request.json();
    const { name, clusterId, type, url } = body;
    const document = await prisma.document.update({
      where: {
        id,
      },
      data: {
        name,
        clusterId,
        type,
        url,
      },
    });
    if (!document) {
      return NextResponse.json(
        { error: "Document not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Document Updated!", document },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating a document:", error);
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
  const id = params.id;
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const clusterId = searchParams.get("clusterId");

  try {
    // Validate clusterId
    if (!clusterId) {
      return NextResponse.json(
        { error: "Cluster ID is required" },
        { status: 400 }
      );
    }

    // Delete the ClusterDocument entry
    const clusterDocument = await prisma.clusterDocument.deleteMany({
      where: {
        clusterId,
        documentId: id,
      },
    });

    if (!clusterDocument.count) {
      return NextResponse.json(
        { error: "ClusterDocument not found or not deleted!" },
        { status: 404 }
      );
    }

    // Check if there are any remaining ClusterDocument references
    const remainingReferences = await prisma.clusterDocument.findMany({
      where: {
        documentId: id,
      },
    });

    // If no references exist, delete the document itself
    if (remainingReferences.length === 0) {
      const document = await prisma.document.delete({
        where: {
          id,
        },
      });

      if (!document) {
        return NextResponse.json(
          { error: "Document not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Document and associated ClusterDocument deleted!", document },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "ClusterDocument deleted, but Document retained due to other references!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

