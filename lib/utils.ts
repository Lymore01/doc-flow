/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Todo: add more file types

export function getFileIcon(file: any) {
  const fileType = file.name.split(".").pop().toLowerCase();
  switch (fileType) {
    case "pdf":
      return "pdf_9496432.png";
    case "doc":
    case "rtf":
    case "docx":
      return "Microsoft_Word-Logo.wine.png";
    case "xls":
    case "xlsx":
      return "Microsoft_Excel-Logo.wine.png";
    case "pptx":
      return "Microsoft_PowerPoint-Logo.wine.png";
    default:
      return "Microsoft_Word-Logo.wine.png";
  }
}

export async function generateLink(username: string, clusterId: string) {
  const queryParam = encodeURIComponent(username);
  return `${process.env.NEXT_PUBLIC_NETWORK_BASE_URL}/d/${queryParam}/${clusterId}`; //todo: update this after deployment to be dynamic
}

export async function getDocumentData({ fileUrl }: { fileUrl: string }) {
  const bucketAndPathString = fileUrl.split("/storage/v1/object/public/")[1];

  const bucketName = bucketAndPathString.split("/")[0];
  const path = decodeURIComponent(bucketAndPathString.split("/")[1]);

  const fileExtension = path.split(".").pop()?.toLowerCase() || "";

  return { bucketName, path, fileExtension };
}

export const generateHMAC: (secret: string, payload: any) => string = (
  secret,
  payload
) => {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
};

export function formatDate(date: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(date));
}

