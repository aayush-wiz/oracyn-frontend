export const processDocumentFile = async (arrayBuffer, fileName) => {
  try {
    // Check if it's a .doc file and provide conversion recommendation
    if (fileName.endsWith(".doc")) {
      console.log("Processing DOC file:", fileName);

      // Still attempt processing but with a clear message about limitations
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({
          arrayBuffer: arrayBuffer,
        });
        const extractedText = cleanExtractedText(result.value || "");

        console.log("DOC extraction result:", {
          textLength: extractedText.length,
          preview: extractedText.substring(0, 100),
        });

        // If extraction is very poor or empty, return conversion message
        if (extractedText.length < 100) {
          console.log("DOC extraction poor, showing conversion recommendation");
          return createConversionRecommendation(fileName, "poor_extraction");
        }

        // If we got some text but it's likely poor quality, process it but warn user
        const processedDoc = createDocumentStructure(extractedText, fileName);
        processedDoc.extractionQuality = "poor";
        processedDoc.processingMessages.unshift({
          type: "warning",
          message:
            "DOC files have limited support. For best results, convert to DOCX or PDF format.",
        });

        console.log("DOC processed with warning");
        return processedDoc;
      } catch (error) {
        console.log("DOC processing failed:", error.message);
        return createConversionRecommendation(fileName, "processing_failed");
      }
    }

    // For DOCX files, process normally with full feature set
    console.log("Processing DOCX file:", fileName);
    const mammoth = await import("mammoth");

    let result;
    let htmlResult;

    // Process DOCX files - try both text and HTML extraction
    result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    try {
      htmlResult = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    } catch (htmlError) {
      console.warn("HTML extraction failed:", htmlError);
      htmlResult = { value: "", messages: [] };
    }

    let extractedText = result.value || "";
    const messages = result.messages || [];
    const htmlContent = htmlResult.value || "";
    const allMessages = [...messages, ...(htmlResult.messages || [])];

    // Clean up the extracted text
    extractedText = cleanExtractedText(extractedText);

    // If raw text extraction failed or returned poor results, try to extract from HTML
    if (extractedText.length < 50 && htmlContent) {
      extractedText = extractTextFromHtml(htmlContent);
    }

    // Process the extracted text
    const lines = extractedText.split("\n").filter((line) => line.trim());
    const paragraphs = extractedText
      .split(/\n\s*\n/)
      .filter((para) => para.trim())
      .map((para) => para.replace(/\s+/g, " ").trim());

    const words = extractedText
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.replace(/[^\w\s]/g, "").trim())
      .filter((word) => word.length > 0);

    const sentences = extractedText
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 5);

    // Word frequency analysis
    const wordCount = {};
    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (cleanWord && cleanWord.length > 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });

    // Document structure analysis - improved heading detection
    const headings = detectHeadings(lines, htmlContent);

    // Reading statistics
    const avgWordsPerSentence =
      sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
    const avgSentencesPerParagraph =
      paragraphs.length > 0
        ? Math.round(sentences.length / paragraphs.length)
        : 0;
    const estimatedReadingTime = Math.ceil(words.length / 200); // 200 words per minute average

    // Determine if extraction was successful
    const extractionQuality = determineExtractionQuality(
      extractedText,
      words.length,
      allMessages
    );

    console.log("DOCX processed successfully:", {
      textLength: extractedText.length,
      wordCount: words.length,
      quality: extractionQuality,
    });

    return {
      type: "document",
      subType: "docx",
      content: extractedText,
      htmlContent: htmlContent,
      extractionQuality: extractionQuality,
      statistics: {
        totalCharacters: extractedText.length,
        totalWords: words.length,
        totalSentences: sentences.length,
        totalParagraphs: paragraphs.length,
        totalLines: lines.length,
        uniqueWords: Object.keys(wordCount).length,
        avgWordsPerSentence: avgWordsPerSentence,
        avgSentencesPerParagraph: avgSentencesPerParagraph,
        estimatedReadingTime: estimatedReadingTime,
      },
      structure: {
        paragraphs: paragraphs.slice(0, 50), // First 50 paragraphs for analysis
        headings: headings.slice(0, 20), // Detected headings
        lines: lines.slice(0, 100), // First 100 lines
      },
      wordAnalysis: {
        topWords: Object.entries(wordCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 50)
          .map(([word, count]) => ({ word, count })),
        wordFrequency: wordCount,
      },
      processingMessages: allMessages.map((msg) => ({
        type: msg.type || "info",
        message: msg.message,
      })),
      metadata: {
        fileName: fileName,
        processingNote: generateProcessingNote(
          extractionQuality,
          allMessages.length
        ),
      },
    };
  } catch (error) {
    console.error("Document processing error:", error);

    // If it's a DOC file that failed, show conversion recommendation
    if (fileName.endsWith(".doc")) {
      console.log(
        "DOC file failed completely, showing conversion recommendation"
      );
      return createConversionRecommendation(fileName, "processing_failed");
    }

    return {
      type: "document",
      subType: fileName.endsWith(".docx") ? "docx" : "doc",
      error: `Unable to process document file: ${error.message}. This may be due to encryption, corruption, or unsupported format.`,
      content: "",
      extractionQuality: "failed",
      statistics: {
        totalCharacters: 0,
        totalWords: 0,
        totalSentences: 0,
        totalParagraphs: 0,
        totalLines: 0,
        uniqueWords: 0,
        avgWordsPerSentence: 0,
        avgSentencesPerParagraph: 0,
        estimatedReadingTime: 0,
      },
      structure: {
        paragraphs: [],
        headings: [],
        lines: [],
      },
      wordAnalysis: {
        topWords: [],
        wordFrequency: {},
      },
      processingMessages: [
        {
          type: "error",
          message: `Processing failed: ${error.message}`,
        },
      ],
      metadata: {
        fileName: fileName,
        processingNote: "Processing failed",
      },
    };
  }
};

// Helper function to create document structure from extracted text
const createDocumentStructure = (extractedText, fileName) => {
  // Process the extracted text
  const lines = extractedText.split("\n").filter((line) => line.trim());
  const paragraphs = extractedText
    .split(/\n\s*\n/)
    .filter((para) => para.trim())
    .map((para) => para.replace(/\s+/g, " ").trim());

  const words = extractedText
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.replace(/[^\w\s]/g, "").trim())
    .filter((word) => word.length > 0);

  const sentences = extractedText
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 5);

  // Word frequency analysis
  const wordCount = {};
  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
    if (cleanWord && cleanWord.length > 3) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });

  // Document structure analysis
  const headings = detectHeadings(lines, "");

  // Reading statistics
  const avgWordsPerSentence =
    sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
  const avgSentencesPerParagraph =
    paragraphs.length > 0
      ? Math.round(sentences.length / paragraphs.length)
      : 0;
  const estimatedReadingTime = Math.ceil(words.length / 200);

  return {
    type: "document",
    subType: "doc",
    content: extractedText,
    htmlContent: "",
    statistics: {
      totalCharacters: extractedText.length,
      totalWords: words.length,
      totalSentences: sentences.length,
      totalParagraphs: paragraphs.length,
      totalLines: lines.length,
      uniqueWords: Object.keys(wordCount).length,
      avgWordsPerSentence: avgWordsPerSentence,
      avgSentencesPerParagraph: avgSentencesPerParagraph,
      estimatedReadingTime: estimatedReadingTime,
    },
    structure: {
      paragraphs: paragraphs.slice(0, 50),
      headings: headings.slice(0, 20),
      lines: lines.slice(0, 100),
    },
    wordAnalysis: {
      topWords: Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50)
        .map(([word, count]) => ({ word, count })),
      wordFrequency: wordCount,
    },
    processingMessages: [],
    metadata: {
      fileName: fileName,
      processingNote: "Document processed",
    },
  };
};

// Helper function to create conversion recommendation for DOC files
const createConversionRecommendation = (fileName, reason) => {
  const reasonMessages = {
    poor_extraction:
      "The text extraction quality is too poor to display reliably.",
    processing_failed:
      "The document could not be processed due to format limitations.",
  };

  console.log(
    "Creating conversion recommendation for:",
    fileName,
    "reason:",
    reason
  );

  return {
    type: "document",
    subType: "doc",
    error: null,
    conversionRecommended: true, // This is the key flag
    conversionReason: reason,
    content: "",
    extractionQuality: "unsupported",
    statistics: {
      totalCharacters: 0,
      totalWords: 0,
      totalSentences: 0,
      totalParagraphs: 0,
      totalLines: 0,
      uniqueWords: 0,
      avgWordsPerSentence: 0,
      avgSentencesPerParagraph: 0,
      estimatedReadingTime: 0,
    },
    structure: {
      paragraphs: [],
      headings: [],
      lines: [],
    },
    wordAnalysis: {
      topWords: [],
      wordFrequency: {},
    },
    processingMessages: [
      {
        type: "info",
        message: reasonMessages[reason] || "DOC format has limited support.",
      },
      {
        type: "recommendation",
        message:
          "For the best experience, please convert your document to one of these formats:",
      },
    ],
    metadata: {
      fileName: fileName,
      processingNote: "Conversion recommended for better results",
    },
  };
};

// Helper function to clean extracted text
const cleanExtractedText = (text) => {
  return (
    text
      // Remove excessive whitespace
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      // Remove weird characters that might come from formatting
      .replace(
        new RegExp(
          `[${String.fromCharCode(0)}-${String.fromCharCode(
            8
          )}${String.fromCharCode(11)}${String.fromCharCode(
            12
          )}${String.fromCharCode(14)}-${String.fromCharCode(
            31
          )}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`,
          "g"
        ),
        ""
      )
      // Clean up spaces
      .replace(/[ \t]{2,}/g, " ")
      // Remove lines that are just whitespace
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .trim()
  );
};

// Helper function to extract text from HTML (fallback)
const extractTextFromHtml = (html) => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Get text content and clean it up
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return cleanExtractedText(text);
};

// Helper function to detect headings
const detectHeadings = (lines, htmlContent) => {
  const headings = [];

  // Method 1: From HTML content if available
  if (htmlContent) {
    const headingMatches = htmlContent.match(
      /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi
    );
    if (headingMatches) {
      headings.push(
        ...headingMatches.map((match) => match.replace(/<[^>]+>/g, "").trim())
      );
    }
  }

  // Method 2: From text patterns
  const textHeadings = lines.filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      trimmed.length < 100 &&
      // All caps (potential heading)
      (trimmed.match(/^[A-Z\s\d\-_:]+$/) ||
        // Numbered sections
        trimmed.match(/^\d+\.?\s+[A-Z]/) ||
        // Short lines that might be headings
        (trimmed.length < 50 && trimmed.match(/^[A-Z]/)))
    );
  });

  headings.push(...textHeadings);

  // Remove duplicates and return
  return [...new Set(headings)];
};

// Helper function to determine extraction quality
const determineExtractionQuality = (text, wordCount, messages) => {
  const errorMessages = messages.filter((msg) => msg.type === "error");
  const warningMessages = messages.filter((msg) => msg.type === "warning");

  if (errorMessages.length > 0) {
    return "poor";
  }

  if (text.length < 100 || wordCount < 20) {
    return "poor";
  }

  if (
    warningMessages.length > 5 ||
    text.includes("???") ||
    text.includes("□")
  ) {
    return "fair";
  }

  if (warningMessages.length > 0) {
    return "good";
  }

  return "excellent";
};

// Helper function to generate processing note
const generateProcessingNote = (quality, messageCount) => {
  const qualityMessages = {
    excellent: "Document processed successfully with high fidelity",
    good: "Document processed successfully with minor formatting issues",
    fair: "Document processed with some formatting issues",
    poor: "Document processed with significant issues - consider converting to a different format",
    failed: "Document processing failed",
  };

  let note = qualityMessages[quality] || qualityMessages["fair"];

  if (messageCount > 0) {
    note += ` (${messageCount} processing messages)`;
  }

  return note;
};
