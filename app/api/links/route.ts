/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { generateLink } from "../../../lib/utils";
import axiosInstance from "../../../lib/axios";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required!" },
        { status: 400 }
      );
    }
    const links = await prisma.link.findMany({
      where: {
        user: {
          some: {
            userId,
          },
        },
      },
      include:{
        cluster:{
          select:{
            name:true
          }
        }
      }
    });

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
    const body: { clusterId: string; username: string; userId: string } =
      await request.json();
    const { clusterId, username, userId } = body;

    // username should be from clerk
    // const cluster = await axiosInstance.get(`/api/clusters/${clusterId}`);

    // get short id
    const response = await fetch(
      `${process.env.TRACKIFY_BASE_URL}/api/shorten`,
      {
        method: "POST",
        body: JSON.stringify({
          original: await generateLink(username, clusterId),
        }),
        headers: {
          "Content-Type": "application/json",
          ...(process.env.TRACKIFY_API_KEY && {
            "x-api-key": process.env.TRACKIFY_API_KEY,
          }),
          ...(process.env.TRACKIFY_ACCESS_TOKEN && {
            Authorization: `Bearer ${process.env.TRACKIFY_ACCESS_TOKEN}`,
          }),
        },
      }
    );

    const data: {
      success: boolean;
      shortUrl: string;
    } = await response.json();

    const link = await prisma.link.create({
      data: {
        id: clusterId,
        url: await generateLink(username, clusterId),
        trackingId: data.success === true ? data.shortUrl : null,
        cluster: {
          connect: {
            id: clusterId,
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json(
        {
          message: "Link creation failed!",
        },
        {
          status: 400,
        }
      );
    }

    const linkUser = await prisma.linkUser.create({
      data: {
        userId,
        linkId: link.id,
      },
    });

    if (!linkUser) {
      return NextResponse.json(
        { message: "linkUser creation failed!" },
        { status: 400 }
      );
    }

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
