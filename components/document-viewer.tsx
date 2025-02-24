/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Mammoth from "mammoth";
import * as XLSX from "xlsx";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import PdfReactPdf from "./pdf-viewer";
import DocSkeleton from "./doc-skeleton";
import ExcelSkeleton from "./xlsx-skeleton";
import TextSkeleton from "./text-skeleton";
import MarkdownSkeleton from "./markdown-skeleton";

interface DocumentViewerProps {
  fileUrl: string;
  fileType: string;
}

export default function DocumentViewer({
  fileUrl,
  fileType,
}: DocumentViewerProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (fileType === "docx") {
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => Mammoth.convertToHtml({ arrayBuffer: buffer }))
        .then((result) => {
          setContent(result.value);
          setLoading(false);
        });
    } else if (fileType === "txt" || fileType === "md") {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) => {
          setContent(text);
          setLoading(false);
        });
    } else if (fileType === "xlsx" || fileType === "csv") {
      fetch(fileUrl)
        .then((res) => res.arrayBuffer())
        .then((buffer) => {
          const workbook = XLSX.read(buffer, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setContent(jsonData);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [fileUrl, fileType]);

  return (
    <div className="container min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {fileType === "pdf" && (
          <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <PdfReactPdf src={fileUrl} />
          </div>
        )}

        {fileType === "docx" &&
          (loading ? (
            <DocSkeleton />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ))}

        {fileType === "txt" &&
          (loading ? (
            <TextSkeleton />
          ) : (
            <pre className="whitespace-pre-wrap">{content}</pre>
          ))}

        {fileType === "md" &&
          (loading ? (
            <MarkdownSkeleton />
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          ))}

        {["xlsx", "csv"].includes(fileType) &&
          (loading ? (
            <ExcelSkeleton />
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  {Array.isArray(content) ? (
                    content.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex} className="border border-gray-200">
                        {Object.values(row).map(
                          (cell: any, cellIndex: number) => (
                            <td
                              key={cellIndex}
                              className="p-2 border border-gray-300"
                            >
                              <span>{cell}</span>
                            </td>
                          )
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-2 border border-gray-300">
                        <pre>{String(content)}</pre>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}

        {["png", "jpg", "jpeg", "gif", "svg"].includes(fileType) && (
          <div className="flex justify-center">
            <Image
              src={fileUrl}
              alt="Document Image"
              width={800}
              height={600}
            />
          </div>
        )}
      </div>
    </div>
  );
}
