/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import PdfSkeleton from "./pdf-skeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfReactPdf({ src }: any) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  function nextPage() {
    setPageNumber((v) => ++v);
  }
  function prevPage() {
    setPageNumber((v) => --v);
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="flex justify-between items-center">
        <Button
          variant={"outline"}
          onClick={prevPage}
          disabled={pageNumber <= 1}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          onClick={nextPage}
          disabled={pageNumber >= (numPages ?? -1)}
        >
          Next
        </Button>
      </div>
      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<PdfSkeleton />}
        className="mt-4"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}


