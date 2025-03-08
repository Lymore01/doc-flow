// import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { deleteDocument, upload } from "../../../supabase/storage/client";

export async function POST(request: Request){
    try {
        const body: {file: File , bucket: string} = await request.json();
        const {file, bucket} = body;

        const {data, publicURL, error} = await upload({file, bucket});

        return NextResponse.json({data, publicURL, error}, {status: 200});

    } catch (error) {
        console.error("Error uploading document:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}

export async function DELETE(request: Request){
    try {
        const body: {fileUrl: string} = await request.json();
        const {fileUrl} = body;

        const {message, data, error} = await deleteDocument({fileUrl});

        return NextResponse.json({message, data, error}, {status: 200});

    } catch (error) {
        console.error("Error deleting document:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
}