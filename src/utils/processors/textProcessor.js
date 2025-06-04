export const processTextFile = async (content, fileName) => {
  try {
    console.log("Processing TXT file:", fileName);

    // Clean up the text content
    const cleanedContent = cleanTextContent(content);

    console.log("TXT content analysis:", {
      originalLength: content.length,
      cleanedLength: cleanedContent.length,
      preview: cleanedContent.substring(0, 100),
    });

    // Check if the text file has sufficient content for analysis
    if (cleanedContent.length < 50) {
      console.log("TXT file too short, showing improvement recommendation");
      return createTextImprovementRecommendation(fileName, "too_short");
    }

    // Basic content analysis
    const lines = cleanedContent.split("\n").filter((line) => line.trim());
    const words = cleanedContent.split(/\s+/).filter((word) => word.length > 0);
    const meaningfulWords = words.filter((word) => word.length > 3);

    // Check for very low word diversity or repetitive content
    const uniqueWords = [
      ...new Set(meaningfulWords.map((word) => word.toLowerCase())),
    ];
    const wordDiversityRatio =
      uniqueWords.length / Math.max(meaningfulWords.length, 1);

    if (meaningfulWords.length < 20) {
      console.log(
        "TXT file has too few meaningful words, showing improvement recommendation"
      );
      return createTextImprovementRecommendation(
        fileName,
        "insufficient_content"
      );
    }

    if (wordDiversityRatio < 0.3) {
      console.log(
        "TXT file has poor word diversity, showing improvement recommendation"
      );
      return createTextImprovementRecommendation(fileName, "poor_diversity");
    }

    // If content passes quality checks, process normally
    const processedText = createTextStructure(cleanedContent, fileName);

    // Add quality assessment
    const contentQuality = assessTextQuality(cleanedContent, words, lines);
    processedText.contentQuality = contentQuality;

    if (contentQuality === "poor" || contentQuality === "fair") {
      processedText.processingMessages.unshift({
        type: "warning",
        message:
          "Text content quality could be improved. Consider adding more detailed content for better analysis.",
      });
    }

    console.log("TXT processed successfully:", {
      wordCount: words.length,
      lineCount: lines.length,
      quality: contentQuality,
    });

    return processedText;
  } catch (error) {
    console.error("Text processing error:", error);
    return createTextImprovementRecommendation(fileName, "processing_failed");
  }
};

// Helper function to create text structure from content
const createTextStructure = (content, fileName) => {
  const lines = content.split("\n").filter((line) => line.trim());
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const meaningfulWords = words.filter((word) => word.length > 3);
  const sentences = content
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 5);
  const paragraphs = content.split(/\n\s*\n/).filter((para) => para.trim());

  // Word frequency analysis
  const wordCount = {};
  meaningfulWords.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
    if (cleanWord) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });

  // Reading statistics
  const avgWordsPerSentence =
    sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
  const avgSentencesPerParagraph =
    paragraphs.length > 0
      ? Math.round(sentences.length / paragraphs.length)
      : 0;
  const estimatedReadingTime = Math.ceil(words.length / 200);

  return {
    type: "text",
    subType: "txt",
    content: content,
    statistics: {
      totalCharacters: content.length,
      totalWords: words.length,
      meaningfulWords: meaningfulWords.length,
      totalSentences: sentences.length,
      totalParagraphs: paragraphs.length,
      totalLines: lines.length,
      uniqueWords: Object.keys(wordCount).length,
      avgWordsPerSentence: avgWordsPerSentence,
      avgSentencesPerParagraph: avgSentencesPerParagraph,
      estimatedReadingTime: estimatedReadingTime,
    },
    structure: {
      lines: lines,
      paragraphs: paragraphs.slice(0, 50),
      sentences: sentences.slice(0, 100),
    },
    wordAnalysis: {
      topWords: Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50)
        .map(([word, count]) => ({ word, count })),
      wordFrequency: wordCount,
      wordDiversity:
        Object.keys(wordCount).length / Math.max(meaningfulWords.length, 1),
    },
    processingMessages: [],
    metadata: {
      fileName: fileName,
      processingNote: "Text file processed successfully",
    },
  };
};

// Helper function to create improvement recommendation for TXT files
const createTextImprovementRecommendation = (fileName, reason) => {
  const reasonMessages = {
    too_short: "The text file is too short to provide meaningful analysis.",
    insufficient_content:
      "The text file doesn't contain enough meaningful content for analysis.",
    poor_diversity:
      "The text content appears to be very repetitive with low word diversity.",
    processing_failed:
      "The text file could not be processed due to technical issues.",
  };

  console.log(
    "Creating text improvement recommendation for:",
    fileName,
    "reason:",
    reason
  );

  return {
    type: "text",
    subType: "txt",
    error: null,
    improvementRecommended: true, // Key flag for TXT files
    improvementReason: reason,
    content: "",
    contentQuality: "insufficient",
    statistics: {
      totalCharacters: 0,
      totalWords: 0,
      meaningfulWords: 0,
      totalSentences: 0,
      totalParagraphs: 0,
      totalLines: 0,
      uniqueWords: 0,
      avgWordsPerSentence: 0,
      avgSentencesPerParagraph: 0,
      estimatedReadingTime: 0,
    },
    structure: {
      lines: [],
      paragraphs: [],
      sentences: [],
    },
    wordAnalysis: {
      topWords: [],
      wordFrequency: {},
      wordDiversity: 0,
    },
    processingMessages: [
      {
        type: "info",
        message:
          reasonMessages[reason] ||
          "Text content needs improvement for better analysis.",
      },
      {
        type: "recommendation",
        message:
          "Consider improving your text content using the suggestions below:",
      },
    ],
    metadata: {
      fileName: fileName,
      processingNote: "Content improvement recommended for better analysis",
    },
  };
};

// Helper function to clean text content
const cleanTextContent = (text) => {
  return (
    text
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Remove excessive whitespace but preserve paragraph structure
      .replace(/[ \t]+/g, " ")
      .replace(/\n{4,}/g, "\n\n\n")
      // Remove control characters but keep basic formatting
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
      .trim()
  );
};

// Helper function to assess text quality
const assessTextQuality = (content, words, lines) => {
  const meaningfulWords = words.filter((word) => word.length > 3);
  const uniqueWords = [
    ...new Set(meaningfulWords.map((word) => word.toLowerCase())),
  ];
  const wordDiversityRatio =
    uniqueWords.length / Math.max(meaningfulWords.length, 1);
  const avgWordsPerLine = words.length / Math.max(lines.length, 1);

  // Quality assessment criteria
  if (
    content.length > 2000 &&
    wordDiversityRatio > 0.6 &&
    avgWordsPerLine > 8
  ) {
    return "excellent";
  } else if (
    content.length > 1000 &&
    wordDiversityRatio > 0.5 &&
    avgWordsPerLine > 6
  ) {
    return "good";
  } else if (
    content.length > 500 &&
    wordDiversityRatio > 0.4 &&
    avgWordsPerLine > 4
  ) {
    return "fair";
  } else {
    return "poor";
  }
};
