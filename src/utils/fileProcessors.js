import * as d3 from "d3";
import * as XLSX from "xlsx";

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

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        // Parse CSV data
        const csvData = d3.csvParse(content);
        resolve({
          type: "csv",
          rows: csvData.length,
          columns: csvData.columns || [],
          data: csvData,
          summary: generateCSVSummary(csvData),
        });
      } else if (
        file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx") ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        try {
          // Parse Excel file using SheetJS
          const data = new Uint8Array(content);
          const workbook = XLSX.read(data, { type: "array" });

          // Get the first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length === 0) {
            resolve({
              type: "excel",
              name: file.name,
              size: file.size,
              rows: 0,
              columns: [],
              data: [],
              error: "Empty Excel file",
            });
            return;
          }

          // First row as headers, rest as data
          const headers = jsonData[0] || [];
          const rows = jsonData.slice(1);

          // Convert to object format similar to CSV
          const formattedData = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header || `Column ${index + 1}`] = row[index] || "";
            });
            return obj;
          });

          resolve({
            type: "excel",
            rows: formattedData.length,
            columns: headers.map((h) => h || "Unnamed"),
            data: formattedData,
            summary: generateCSVSummary(formattedData),
            sheetName: sheetName,
            totalSheets: workbook.SheetNames.length,
            allSheets: workbook.SheetNames,
          });
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          resolve({
            type: "excel",
            name: file.name,
            size: file.size,
            error: "Failed to parse Excel file: " + error.message,
          });
        }
      } else if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        // Process PDF files using pdfjs-dist with local worker
        try {
          const pdfData = await processPDFFile(content);
          resolve(pdfData);
        } catch (error) {
          console.error("Error processing PDF file:", error);
          resolve({
            type: "pdf",
            name: file.name,
            size: file.size,
            error: "Failed to process PDF file: " + error.message,
          });
        }
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        // Process text data
        const lines = content.split("\n").filter((line) => line.trim());
        const words = content.split(/\s+/).filter((word) => word.length > 3);
        const wordCount = {};
        words.forEach((word) => {
          const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
          if (cleanWord) {
            wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
          }
        });

        resolve({
          type: "text",
          content: content,
          lines: lines,
          wordCount: Object.entries(wordCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 50)
            .map(([word, count]) => ({ word, count })),
          totalWords: words.length,
          uniqueWords: Object.keys(wordCount).length,
        });
      } else {
        // For other document types - would need additional libraries
        resolve({
          type: "document",
          name: file.name,
          size: file.size,
          content:
            "Binary file - would require additional processing libraries",
        });
      }
    };

    // Use appropriate reader method based on file type
    if (
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx") ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/pdf" ||
      file.name.endsWith(".pdf")
    ) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

const processPDFFile = async (arrayBuffer) => {
  try {
    // Import pdfjs-dist and disable worker entirely
    const pdfjsLib = await import("pdfjs-dist");
    
    // Use the matching worker file for version 4.8.69
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    }).promise;

    const numPages = pdf.numPages;
    const pages = [];
    const renderedPages = [];
    let fullText = "";
    let totalTextLength = 0;

    // Extract text from each page (limit to 20 pages for performance)
    const maxPages = Math.min(numPages, 20);
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        
        // Extract text content
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        // Render page to canvas for visual display
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        
        // Convert canvas to data URL for display
        const pageImageData = canvas.toDataURL('image/png');

        pages.push({
          pageNumber: pageNum,
          text: pageText,
          textLength: pageText.length,
        });

        renderedPages.push({
          pageNumber: pageNum,
          imageData: pageImageData,
          width: viewport.width,
          height: viewport.height,
        });

        fullText += pageText + "\n\n";
        totalTextLength += pageText.length;
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError.message);
        pages.push({
          pageNumber: pageNum,
          text: "",
          textLength: 0,
          error: pageError.message,
        });
        renderedPages.push({
          pageNumber: pageNum,
          error: pageError.message,
        });
      }
    }

    // Extract metadata
    let metadata = {
      title: "Not specified",
      author: "Not specified",
      subject: "Not specified",
      creator: "Not specified",
      producer: "Not specified",
      creationDate: "Not specified",
      modificationDate: "Not specified",
      keywords: "Not specified",
      pdfVersion: "Not specified",
    };

    try {
      const pdfMetadata = await pdf.getMetadata();
      if (pdfMetadata && pdfMetadata.info) {
        metadata = {
          title: pdfMetadata.info.Title || "Not specified",
          author: pdfMetadata.info.Author || "Not specified",
          subject: pdfMetadata.info.Subject || "Not specified",
          creator: pdfMetadata.info.Creator || "Not specified",
          producer: pdfMetadata.info.Producer || "Not specified",
          creationDate: pdfMetadata.info.CreationDate
            ? new Date(pdfMetadata.info.CreationDate).toLocaleDateString()
            : "Not specified",
          modificationDate: pdfMetadata.info.ModDate
            ? new Date(pdfMetadata.info.ModDate).toLocaleDateString()
            : "Not specified",
          keywords: pdfMetadata.info.Keywords || "Not specified",
          pdfVersion: pdfMetadata.info.PDFFormatVersion || "Not specified",
        };
      }
    } catch (metadataError) {
      console.warn("Error extracting PDF metadata:", metadataError.message);
    }

    // Calculate statistics
    const wordCount = fullText
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const avgWordsPerPage =
      numPages > 0 ? Math.round(wordCount / numPages) : 0;

    return {
      type: "pdf",
      numPages: numPages,
      pages: pages,
      renderedPages: renderedPages,
      fullText: fullText.trim(),
      textLength: totalTextLength,
      wordCount: wordCount,
      avgWordsPerPage: avgWordsPerPage,
      metadata: metadata,
      processingNote:
        numPages > maxPages
          ? `Processed first ${maxPages} pages of ${numPages} total pages`
          : null,
    };
  } catch (error) {
    console.error("PDF processing error:", error);

    // Return a structured error response
    return {
      type: "pdf",
      error:
        "Unable to process PDF file. This may be due to encryption, corruption, or unsupported format.",
      numPages: 0,
      pages: [],
      renderedPages: [],
      fullText: "",
      textLength: 0,
      wordCount: 0,
      avgWordsPerPage: 0,
      metadata: {
        title: "Processing failed",
        author: "Processing failed",
        subject: "Processing failed",
        creator: "Processing failed",
        producer: "Processing failed",
        creationDate: "Processing failed",
        modificationDate: "Processing failed",
        keywords: "Processing failed",
        pdfVersion: "Processing failed",
      },
    };
  }
};

const generateCSVSummary = (data) => {
  if (!data || data.length === 0) return {};

  const summary = {};
  const columns = Object.keys(data[0]);

  columns.forEach((column) => {
    const values = data
      .map((row) => row[column])
      .filter((val) => val !== "" && val != null);
    const numericValues = values
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val));

    summary[column] = {
      total: values.length,
      numeric: numericValues.length,
      min: numericValues.length > 0 ? Math.min(...numericValues) : null,
      max: numericValues.length > 0 ? Math.max(...numericValues) : null,
      avg:
        numericValues.length > 0
          ? (
              numericValues.reduce((a, b) => a + b, 0) / numericValues.length
            ).toFixed(2)
          : null,
      dataType: numericValues.length / values.length > 0.7 ? "numeric" : "text",
    };
  });

  return summary;
};
