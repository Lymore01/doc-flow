import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // user_29w83sxmDNGwOuEthce5gg56FcC

    // const [clustersCount, docsCount, linksCount] = await Promise.all([
    //   prisma.cluster.count({
    //     where: {
    //       id: userId,
    //     },
    //   }),
    //   prisma.document.count({
    //     where: {
    //       id: userId,
    //     },
    //   }),
    //   prisma.link.count({
    //     where: {
    //       id: userId,
    //     },
    //   }),
    // ]);

    const clusters = await prisma.cluster.findMany({
      where: {
        userId: userId,
      },
      include: {
        documents: true,
        link: true,
      },
    });

    // Check if all data is retrieved
    // if (!clustersCount || !docsCount || !linksCount) {
    //   return NextResponse.json(
    //     { message: "One or more entities could not be found." },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(
      {
        message: "Dashboard data fetched fetched!",
        data: {
          totalClusters: clusters.length,
          totalDocuments: clusters.reduce(
            (acc, cluster) => acc + cluster.documents.length,
            0
          ),
          totalLinks: clusters.reduce(
            (acc, cluster) => acc + (cluster.link ? 1 : 0),
            0
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
