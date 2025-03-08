import axiosInstance from "../../lib/axios";
import { getDocumentData } from "../../lib/utils";
import { createSupabaseClient } from "../client";

function getStorage() {
  const supabase = createSupabaseClient();
  return supabase.storage;
}

type uploadProps = {
  file: string; //! fix: revert to File type
  bucket: string;
  folder?: string;
};

export async function upload({ file, bucket, folder }: uploadProps) {
  const storage = getStorage();
  const fileName: string = file; //! fix: revert to file.name

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

  if (publicURL) {
    axiosInstance
      .post("/api/documents", {
        id: data.id,
        name: fileName,
        clusterId: "492d22cd-124c-474b-902f-90d9a330c00a",
        type: fileExtension,
        url: publicURL.data.publicUrl,
      })
      .then((res) => {
        console.log("Document uploaded successfully!", res.data);
      })
      .catch((error) => {
        console.error("Error uploading document!", error);
      });
  }

  return { data, publicURL, error: "" };
}

// delete document
export async function deleteDocument({ fileUrl }: { fileUrl: string }) {
  const storage = getStorage();

  const { bucketName, path } = await getDocumentData({ fileUrl });

  const { data, error } = await storage.from(bucketName).remove([path]);

  if (data) {
    console.log("Deleted document data id: ", data[0].id);
    //   delete document from database
    axiosInstance
      .delete(`/api/documents/${data[0].id}`)
      .then((res) => {
        console.log("Document deleted successfully!", res.data);
      })
      .catch((error) => {
        console.error("Error deleting document!", error);
      });
  }

  if (error) throw error;

  return { message: "File deleted successfully!", data, error: "" };
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
