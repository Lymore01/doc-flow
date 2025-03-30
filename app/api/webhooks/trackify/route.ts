import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateHMAC } from "../../../../lib/utils";
import { prisma } from "../../../../lib/prisma";

enum Event {
  "link.clicked" = "link.clicked",
  "link.updated" = "link.updated",
  "link.created" = "link.created",
  "link.deleted" = "link.deleted",
}

export async function POST(request: Request) {
  try {
    // check signature
    const SIGNING_SECRET = process.env.TRACKIFY_SECRET;

    if (!SIGNING_SECRET) {
      throw new Error("Error: Please add SIGNING_SECRET from trackify .env");
    }

    const headerPayload = await headers();
    const signature = headerPayload.get("x-webhook-signature") as string;
    const userId = headerPayload.get("X-User-ID") as string;

    if (!signature) {
      return new Response("Error: Missing Signature headers", {
        status: 400,
      });
    }

    const body: {
      event: Event;
      data: {
        shortId: string;
        ip: string;
        country: string;
        userAgent: string;
      };
    } = await request.json();

    const payload = JSON.stringify(body);

    // verify webhook
    const hash = generateHMAC(SIGNING_SECRET || "", payload);

    if (hash !== signature) {
      return new Response("Error: Invalid Signature", {
        status: 400,
      });
    }

    const { data, event } = body;

    if (!data || !event) {
      return new Response("Error: Missing Event and Data", {
        status: 400,
      });
    }

    switch (event) {
      case Event["link.clicked"]:
        const { country, ip, shortId, userAgent } = data;
        // get the link
        const link = await prisma.link.findUnique({
          where: {
            trackingId: shortId,
            user:{
              some:{
                userId: userId
              }
            }
          },
          select: {
            id: true,
          },
        });

        if (!link?.id) {
          return new Response("Error: Link not found", {
            status: 404,
          });
        }

        const clicks = await prisma.clicks.create({
          data: {
            ip,
            country,
            userAgent,
            linkId: link.id,
          },
        });

        if (!clicks) {
          return new Response("Error: Failed to create click!", {
            status: 400,
          });
        }

        console.log("Click created Succesfully!");
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error)?.message || "Internal Server Error!",
      },
      {
        status: 500,
      }
    );
  }
}
