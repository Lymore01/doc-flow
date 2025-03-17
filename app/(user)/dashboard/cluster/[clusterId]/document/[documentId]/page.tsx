"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function Document() {
  const { documentId } = useParams();

  const { data: fetchedDocuments, isLoading, error } = useQuery({
    queryKey: ["Document", documentId],
    queryFn: async () => {
      if (documentId) {
        const response = await fetch(`/api/documents/${documentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document.");
        }
        return response.json();
      }
      throw new Error("Document ID is undefined.");
    },
    enabled: !!documentId,
  });

  if (error) return <p>Error loading document.</p>;

  return (
    <div className="w-full h-full">
      {isLoading && (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Loader2 className="animate-spin stroke-blue-600" size={36} />
        </div>
      )}
      <iframe
        className="pdf"
        src={`https://view.officeapps.live.com/op/view.aspx?src=${decodeURIComponent(fetchedDocuments?.document.url)}`}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allowFullScreen
      ></iframe>
    </div>
  );
}

// https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fhadtozrdfpxfhiyjfdln.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fdocx%2F%2FLecture%25203%2520Entrepreneurship%2520and%2520Technology.pdf&wdOrigin=BROWSELINK

// https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fhadtozrdfpxfhiyjfdln.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fdocx%2F%2FAssignment.pptx&wdOrigin=BROWSELINK
