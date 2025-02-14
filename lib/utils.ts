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