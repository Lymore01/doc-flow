/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Todo: add more file types

export function getFileIcon (file: any){
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
};

export async function generateLink(username: string, clusterId: string){
  return `http://192.168.17.243:3000/d/${username}/${clusterId}`; //todo: update this after deployment
}

export async function getDocumentData({fileUrl}: {fileUrl: string}){
    const bucketAndPathString = fileUrl.split("/storage/v1/object/public/")[1];

    const bucketName = bucketAndPathString.split("/")[0];
    const path = decodeURIComponent(bucketAndPathString.split("/")[1]);

    const fileExtension = path.split(".").pop()?.toLowerCase() || '';

    return {bucketName, path, fileExtension};
}