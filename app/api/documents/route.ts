import { Type } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

interface Filters {
  id?: string;
  name?: string;
  clusterId?: string;
  type?: Type;
}

//! Fix: doesn't work with the current implementation

export default function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const id = url.searchParams.get("id"); // id
    const name = searchParams.get("name"); //file.pdf
    const clusterId = searchParams.get("clusterId"); // cluster id
    const type = searchParams.get("type"); // pdf

    let filters: Filters = {};

    if (id) {
      filters["id"] = id;
    } else if (name) {
      filters["name"] = name;
    } else if (clusterId) {
      filters["clusterId"] = clusterId;
    } else if (type) {
      filters["type"] = type as Type;
    } else {
      filters = {};
    }

    const documents = prisma.document.findMany({
      where: filters,
      orderBy: {
        name: "asc",
      },
    });

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
    const body: { id: string, name: string; clusterId: string; type: Type; url: string } = await request.json(); //handle in the client side
    const { id, name, clusterId, type, url } = body;
    const document = await prisma.document.create({
      data: {
        id,
        name,
        clusterId,
        type,
        url,
      },
    });

    return NextResponse.json(
      { message: "Document Created!", document },
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
