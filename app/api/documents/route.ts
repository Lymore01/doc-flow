import { Type } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

interface Filters {
  id?: string;
  name?: string;
  clusterId?: string;
  type?: Type;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = url.searchParams.get("id"); // id
    const name = searchParams.get("name"); //file.pdf
    const clusterId = searchParams.get("clusterId");
    const type = searchParams.get("type"); // pdf
    const userId = searchParams.get("userId");

    let filters: Filters = {};

    if (id) {
      filters["id"] = id;
    } else if (name) {
      filters["name"] = name;
    } else if (clusterId) {
      const documents = await prisma.clusterDocument.findMany({
        where: {
          clusterId,
        },
        include: {
          document: true
        }
      });
      if (!documents) {
        return NextResponse.json(
          {
            message: "Document not found!",
          },
          {
            status: 400,
          }
        );
      }

      return NextResponse.json({
        message: `Document from cluster ${clusterId} Fetched!`, documents
      }, {
        status: 200
      })

    } else if (type) {
      filters["type"] = type as Type;
    } else if (userId) {
      const clusters = await prisma.cluster.findMany({
        where: {
          userId: userId,
        },
        include: {
          documents: true,
          link: true,
        },
      });

      return NextResponse.json(
        {
          message: "Documents fetched!",

          documents: clusters.map((cluster) => cluster.documents)[0],
        },
        { status: 200 }
      );
    } else {
      filters = {};
    }

    const documents = await prisma.document.findMany({
      where: filters,
      orderBy: {
        name: "asc",
      },
    });

    console.log(filters);

    return NextResponse.json(
      { message: "Documents Fetched!", documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: {
      id: string;
      name: string;
      clusterId: string;
      type: Type;
      url: string;
    } = await request.json();
    const { id, name, clusterId, type, url } = body;

    if (!id || !clusterId) {
      return NextResponse.json(
        { message: "Id and clusterId are required!" },
        { status: 400 }
      );
    }

    const doesDocumentExist = await prisma.document.findUnique({
      where: {
        id,
      },
    });

    if (!doesDocumentExist) {
      const document = await prisma.document.create({
        data: {
          id,
          name,
          type,
          url,
        },
      });

      if (!document) {
        return NextResponse.json(
          { message: "Document creation failed!" },
          { status: 400 }
        );
      }
    }

    const doesClusterDocumentExist = await prisma.clusterDocument.findFirst({
      where: {
        clusterId,
        documentId: id,
      },
    });

    if (!doesClusterDocumentExist) {
      const clusterDocument = await prisma.clusterDocument.create({
        data: {
          clusterId,
          documentId: id, // FK linking to the document
        },
      });

      if (!clusterDocument) {
        return NextResponse.json(
          { message: "ClusterDocument creation failed!" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Document and/or ClusterDocument created successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error posting a document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

