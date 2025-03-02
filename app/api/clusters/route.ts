import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

/* 
get all clusters
post a cluster
*/

interface Filter {
  userId?: string;
  id?: string;
  name?: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name");

    let filter: Filter = {};

    if (id) {
      filter["id"] = id;
    } else if (name) {
      filter["name"] = name;
    } else if(userId){
        filter["userId"] = userId;
    }else {
      filter = {};
    }
    const clusters = await prisma.cluster.findMany({
      where: filter,
      include: {
        user: true,
        documents: true,
        link: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      { message: "Clusters Fetched!", clusters },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body: { name: string; userId: string } = await request.json();
  const { name, userId } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const cluster = await prisma.cluster.create({
      data: {
        name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Cluster Created!", cluster },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cluster:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
