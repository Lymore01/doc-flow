"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

// import DocumentViewer from "../../../../../../../components/document-viewer";

export default function Document() {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="w-full h-[500px] flex justify-center items-center">
          <Loader2 className="animate-spin stroke-blue-600" size={36} />
        </div>
      )}
      <iframe
        className="pdf"
        src="https://hadtozrdfpxfhiyjfdln.supabase.co/storage/v1/object/public/docx//Lecture%203%20Entrepreneurship%20and%20Technology.pdf"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allowFullScreen
        onLoad={handleLoad}
      ></iframe>
    </div>
  );
}

// https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fhadtozrdfpxfhiyjfdln.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fdocx%2F%2FLecture%25203%2520Entrepreneurship%2520and%2520Technology.pdf&wdOrigin=BROWSELINK

// https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fhadtozrdfpxfhiyjfdln.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fdocx%2F%2FAssignment.pptx&wdOrigin=BROWSELINK
