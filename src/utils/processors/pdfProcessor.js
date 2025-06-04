export const processPDFFile = async (arrayBuffer, fileName) => {
  try {
    console.log("Processing PDF file:", fileName);

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

    console.log(`PDF loaded with ${numPages} pages`);

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
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to data URL for display
        const pageImageData = canvas.toDataURL("image/png");

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
    const avgWordsPerPage = numPages > 0 ? Math.round(wordCount / numPages) : 0;

    console.log("PDF processed successfully:", {
      pages: numPages,
      processedPages: maxPages,
      wordCount: wordCount,
    });

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
      fileName: fileName,
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
      fileName: fileName,
    };
  }
};
