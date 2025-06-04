// Main file processor that routes to specialized processors
import { processCSVFile } from "./processors/csvProcessor";
import { processExcelFile } from "./processors/excelProcessor";
import { processDocumentFile } from "./processors/documentProcessor";
// In src/utils/fileProcessors.js
import { processPresentationFile } from "./processors/presentationProcessor";
import { processTextFile } from "./processors/textProcessor";
import { processPDFFile } from "./processors/pdfProcessor";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((pdfjsLib) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  });
}

export const processFiles = async (uploadedFiles) => {
  const results = [];

  for (const file of uploadedFiles) {
    const fileData = await processFileContent(file);
    results.push({
      name: file.name,
      type: file.type,
      size: file.size,
      data: fileData,
    });
  }

  return results;
};

const processFileContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;

      try {
        // Route to appropriate processor based on file type
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          const result = await processCSVFile(content, file.name);
          resolve(result);
        } else if (
          file.name.endsWith(".xls") ||
          file.name.endsWith(".xlsx") ||
          file.type === "application/vnd.ms-excel" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          const result = await processExcelFile(content, file.name);
          resolve(result);
        } else if (
          file.name.endsWith(".doc") ||
          file.name.endsWith(".docx") ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await processDocumentFile(content, file.name);
          resolve(result);
        } else if (
          file.name.endsWith(".ppt") ||
          file.name.endsWith(".pptx") ||
          file.type === "application/vnd.ms-powerpoint" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ) {
          const result = await processPresentationFile(content, file.name);
          resolve(result);
        } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          const result = await processTextFile(content, file.name);
          resolve(result);
        } else if (
          file.type === "application/pdf" ||
          file.name.endsWith(".pdf")
        ) {
          const result = await processPDFFile(content, file.name);
          resolve(result);
        } else {
          // For unsupported file types
          resolve({
            type: "unknown",
            name: file.name,
            size: file.size,
            content: "Unsupported file type - specialized processor needed",
            error: `File type ${
              file.type || "unknown"
            } is not currently supported`,
          });
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        resolve({
          type: "error",
          name: file.name,
          size: file.size,
          error: `Failed to process file: ${error.message}`,
        });
      }
    };

    reader.onerror = (error) => {
      console.error(`Error reading ${file.name}:`, error);
      resolve({
        type: "error",
        name: file.name,
        size: file.size,
        error: "Failed to read file",
      });
    };

    // Use appropriate reader method based on file type
    if (
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx") ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/pdf" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx") ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".ppt") ||
      file.name.endsWith(".pptx") ||
      file.type === "application/vnd.ms-powerpoint" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};
