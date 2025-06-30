"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload"; // Assuming this is the correct path
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";

export const DocumentUploadView = ({
  onUploadConfirm,
  isUploading,
  uploadError,
}: {
  onUploadConfirm: (file: File) => void;
  isUploading: boolean;
  uploadError: string | null;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onUploadConfirm(selectedFile);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center">
      {!selectedFile ? (
        <>
          <h2 className="text-2xl font-bold text-white mb-2">
            Start a New Chat
          </h2>
          <p className="text-zinc-400 mb-6">
            First, please upload a document to begin the conversation.
          </p>
          <FileUpload onChange={handleFileSelect} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8 bg-zinc-900 rounded-xl border border-zinc-800 max-w-lg">
          <IconAlertTriangle className="w-10 h-10 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Confirm Document</h3>
          <p className="text-zinc-400">
            You are about to upload{" "}
            <span className="font-bold text-blue-400">{selectedFile.name}</span>
            . This document will be permanently associated with this chat. Are
            you sure you want to proceed?
          </p>
          {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={isUploading}
            >
              {isUploading ? <IconLoader2 className="animate-spin" /> : null}
              {isUploading ? "Uploading..." : "Confirm & Upload"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
