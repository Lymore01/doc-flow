/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { generateLink } from "../../../lib/utils";

export async function GET(request: Request) {
  try {
    const links = await prisma.link.findMany();
    return NextResponse.json(
      { message: "Links Fetched!", links },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    const body: { clusterId: string, username: string } = await request.json();
    const { clusterId, username } = body;

    // username should be from clerk

    const link = await prisma.link.create({
      data: {
        url: await generateLink(username, clusterId),
        cluster: {
          connect: {
            id: clusterId,
          },
        },
      },
    });
    return NextResponse.json(
      { message: "Link Created!", link },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
