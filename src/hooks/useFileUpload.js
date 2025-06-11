// hooks/useFileUpload.js
import { useState, useCallback } from "react";
import { fileUtils } from "../utils/helpers.js";
import { errorUtils } from "../utils/errorHandler.js";

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const validateFile = useCallback((file) => {
    const validation = fileUtils.validateFile(file);
    if (!validation.isValid) {
      const error = errorUtils.handleFileValidation(file, validation.errors);
      setUploadError(error);
      return false;
    }
    return true;
  }, []);

  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
  }, []);

  const uploadFile = useCallback(
    async (file, uploadFn) => {
      if (!validateFile(file)) {
        return null;
      }

      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      try {
        // Simulate progress for user feedback
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const result = await uploadFn(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Keep at 100% briefly before resetting
        setTimeout(() => {
          resetUpload();
        }, 1000);

        return result;
      } catch (error) {
        setUploadError(errorUtils.parse(error));
        setIsUploading(false);
        setUploadProgress(0);
        throw error;
      }
    },
    [validateFile, resetUpload]
  );

  return {
    uploadProgress,
    isUploading,
    uploadError,
    uploadFile,
    resetUpload,
    validateFile,
  };
};
