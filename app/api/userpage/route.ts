import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const linkId = searchParams.get("linkId");

    if (!linkId) {
      return NextResponse.json(
        {
          message: "Please provide link id",
        },
        {
          status: 400,
        }
      );
    }

    const userPageDetails = await prisma.linkUser.findMany({
        where: {
            linkId
        },
        include: {
            user:true,
            link: {
                select: {
                    cluster: {
                        select: {
                            documents: {
                                include: {
                                    document:true
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if(!userPageDetails){
        return NextResponse.json({
            message:"Fetching User details failed!"
        }, {
            status: 400
        })
    }

    return NextResponse.json({
        message: "User Page details Fetched!",
        userPageDetails
    }, {
        status: 200
    })

  } catch (error) {
    console.error("Error fetching user page:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
