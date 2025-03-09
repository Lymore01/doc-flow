/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CloudUpload, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getFileIcon } from "../lib/utils";
import { toast } from "../hooks/use-toast";
import { upload } from "../supabase/storage/client";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  children?: React.ReactNode;
  form?: any;
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [],
  "application/msword": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    [],
  "application/vnd.ms-excel": [],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
  "text/plain": [],
  "text/markdown": [],
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, children, form }) => {
  const [mediaPreview, setMediaPreview] = useState<any | null>(null);

  //! fix: remove this function
  const documentUploadCallback = useCallback(
    async (file: File) => {
      const fileName: string = file.name;

      if(!fileName){
        return;
      }

      console.log("Document url from dropzone", fileName); //debug
    },
    []
  );

  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);

      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];

        setMediaPreview(file);

        documentUploadCallback(file);
      }
    },
    [documentUploadCallback, onDrop]
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: ACCEPTED_FILE_TYPES
  });

  const removeMedia = async () => {
    //    remove from supabase
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
                  accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
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
