import { getDocumentData } from "../../lib/utils";
import { createSupabaseClient } from "../client";

function getStorage() {
  const supabase = createSupabaseClient();
  return supabase.storage;
}

type uploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export async function upload({ file, bucket, folder}: uploadProps) {
  const storage = getStorage();
  const fileName: string = file.name;

  //   validate file type
  const allowedExtensions = ["pdf", "docx", "xlsx", "pptx", "txt"];
  const fileExtension = fileName
    ? (fileName.split(".").pop() || "").toLowerCase()
    : "";
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Unsupported file type!");
  }

  const { data, error } = await storage
    .from(bucket)
    .upload(`${folder ? folder + "/" : ""}${fileName}`, file, {
      upsert: true, //! fix: change to true
    });

  //   if (error) throw error;
  if (error) {
    return { publicURL: "", error: error.message };
  }

  //   get the document public url
  const publicURL = storage
    .from(bucket)
    .getPublicUrl(`${folder ? folder + "/" : ""}${fileName}`);

  return { data, publicURL, error: "" };
}

// delete document
export async function deleteDocument({ fileUrl }: { fileUrl: string }) {
  const storage = getStorage();

  const { bucketName, path } = await getDocumentData({ fileUrl });

  const { data, error } = await storage.from(bucketName).remove([path]);

  if (error) throw error;


  console.log("Data after deleting: ", data)

  return { message: "File deleted successfully!", data, error: "" };
}

// download file
export async function downloadDocument({ fileUrl }: { fileUrl: string }){
  const storage = getStorage();

  const { bucketName, path } = await getDocumentData({ fileUrl });

  const { data, error } = await storage.from(bucketName).download(path);

  if (error) throw error;

  // Convert the file data to a Blob for downloading
  const blob = new Blob([data], { type: data.type });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = path.split("/").pop() || "default_filename";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log("File downloaded successfully!");
 
}

//?  uncomment this function when the update document feature is needed
// export async function updateDocument({
//   fileUrl,
//   name,
// }: {
//   fileUrl: string;
//   name: string;
// }) {
//   const storage = getStorage();

//   const { bucketName, path } = await getDocumentData({ fileUrl });

//   const { data, error } = await storage
//     .from(bucketName)
//     .update(path, { metadata: { name } });

//   if (error) throw error;

//   return { message: "File updated successfully!", data, error: "" };
// }
