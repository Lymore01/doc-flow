/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CloudUpload, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getFileIcon } from "../lib/utils";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept: any;
  children?: React.ReactNode;
  form?: any;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, accept, children }) => {
  const [mediaPreview, setMediaPreview] = useState<any>(null);

  const documentDropCallback = useCallback((_: any) => {
    //upload document to supabase
  }, []);

  // Todo: validate the type of file uploaded
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
      if (acceptedFiles[0]) {
        setMediaPreview(acceptedFiles[0]);
        documentDropCallback(acceptedFiles[0]);
      }
    },
    [documentDropCallback, onDrop]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      [accept]: [],
    },
  });

  const removeMedia = async () => {
    //    remove from supaase
    setMediaPreview(null);
  };


  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
        isDragActive ? "border-primary" : "border"
      }`}
    >
      {children ? (
        children
      ) : (
        <div className="rounded-lg border p-6">
          <div className="flex flex-col items-center">
            {mediaPreview ? (
              <div className="relative flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-gray-100">
                <Image
                  src={`/images/${getFileIcon(mediaPreview)}`}
                  alt="File Icon"
                  width={100}
                  height={100}
                  className="w-12 h-12"
                />

                {/* File Info */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {mediaPreview.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(mediaPreview.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute -top-2 -right-2 bg-red-500 p-1 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center">
                <CloudUpload size={48} className="text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload document
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onDropCallback([file]);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
