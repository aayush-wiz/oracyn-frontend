export const processPresentationFile = async (arrayBuffer, fileName) => {
  try {
    console.log("=== Visual PPTX Processing ===");
    console.log("File name:", fileName);
    console.log("ArrayBuffer size:", arrayBuffer.byteLength);

    // Check if it's a .ppt file
    if (fileName.endsWith(".ppt")) {
      console.log("PPT files require conversion");
      return createPresentationConversionRecommendation(
        fileName,
        "unsupported_format"
      );
    }

    // For PPTX files, extract both visual slides and text
    console.log("Processing PPTX file for visual display...");

    try {
      // Import JSZip for text extraction
      const JSZip = (await import("jszip")).default;
      console.log("JSZip imported successfully");

      // Load the PPTX file as a ZIP archive
      const zip = await JSZip.loadAsync(arrayBuffer);
      console.log("PPTX loaded as ZIP archive");

      const fileNames = Object.keys(zip.files);
      console.log("Files in PPTX:", fileNames.length);

      // Extract slide images and text
      const slideData = await extractSlidesAndText(zip, fileNames);

      if (slideData.slides.length === 0) {
        console.log("No slides found in PPTX");
        return createPresentationConversionRecommendation(
          fileName,
          "minimal_content"
        );
      }

      // Process the extracted content
      const processedPresentation = createVisualPresentationStructure(
        slideData,
        fileName
      );

      // Assess content quality
      const contentQuality = assessPresentationQuality(slideData.fullText);
      processedPresentation.contentQuality = contentQuality;

      // Add processing messages
      processedPresentation.processingMessages = [
        {
          type: "success",
          message: `Successfully processed ${slideData.slides.length} slides with visual preview.`,
        },
      ];

      if (slideData.hasImages) {
        processedPresentation.processingMessages.push({
          type: "info",
          message: "Slide images and embedded content detected.",
        });
      }

      if (slideData.speakerNotes > 0) {
        processedPresentation.processingMessages.push({
          type: "info",
          message: `Found speaker notes in ${slideData.speakerNotes} slides.`,
        });
      }

      // Update metadata
      processedPresentation.metadata.extractionMethod = "visual-zip";
      processedPresentation.metadata.slidesProcessed = slideData.slides.length;
      processedPresentation.metadata.hasVisualContent = slideData.hasImages;

      console.log("Visual PPTX processing successful:", {
        slides: slideData.slides.length,
        textLength: slideData.fullText.length,
        quality: contentQuality,
      });

      return processedPresentation;
    } catch (zipError) {
      console.error("Visual processing failed:", zipError);
      return createPresentationConversionRecommendation(
        fileName,
        "extraction_failed"
      );
    }
  } catch (error) {
    console.error("Presentation processing error:", error);
    return createPresentationConversionRecommendation(
      fileName,
      "processing_failed"
    );
  }
};

// Extract slides with visual thumbnails and text
const extractSlidesAndText = async (zip, fileNames) => {
  const slideData = {
    slides: [],
    fullText: "",
    hasImages: false,
    speakerNotes: 0,
  };

  // Find slide files
  const slideFiles = fileNames
    .filter(
      (name) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
    )
    .sort();

  // Find slide relationship files to get images
  const slideRelFiles = fileNames
    .filter(
      (name) =>
        name.startsWith("ppt/slides/_rels/slide") && name.endsWith(".xml.rels")
    )
    .sort();

  // Find slide images
  const slideImages = fileNames.filter(
    (name) =>
      name.startsWith("ppt/media/") && name.match(/\.(png|jpg|jpeg|gif|bmp)$/i)
  );

  if (slideImages.length > 0) {
    slideData.hasImages = true;
  }

  console.log("Found:", {
    slides: slideFiles.length,
    relations: slideRelFiles.length,
    images: slideImages.length,
  });

  // Process each slide
  for (let i = 0; i < slideFiles.length; i++) {
    const slideFile = slideFiles[i];
    try {
      // Extract text from slide
      const slideXml = await zip.files[slideFile].async("string");
      const slideText = extractTextFromPowerPointXML(slideXml);

      // Try to extract slide image/thumbnail if available
      let slideImageData = null;

      // Look for slide preview images
      const slideNumber = i + 1;
      const possibleImageNames = [
        `ppt/media/image${slideNumber}.png`,
        `ppt/media/image${slideNumber}.jpg`,
        `ppt/media/image${slideNumber}.jpeg`,
        `ppt/slides/slide${slideNumber}.png`,
        `ppt/slides/slide${slideNumber}.jpg`,
      ];

      for (const imageName of possibleImageNames) {
        if (zip.files[imageName]) {
          try {
            const imageBlob = await zip.files[imageName].async("blob");
            slideImageData = URL.createObjectURL(imageBlob);
            console.log(`Found slide image: ${imageName}`);
            break;
          } catch (imageError) {
            console.warn(`Error loading slide image ${imageName}:`, imageError);
          }
        }
      }

      // If no dedicated slide image, try to render from content
      if (!slideImageData) {
        slideImageData = await generateSlidePreview(slideText, slideNumber);
      }

      const slide = {
        slideNumber: slideNumber,
        text: slideText.trim(),
        imageData: slideImageData,
        hasVisualContent: slideImages.some((img) =>
          img.includes(`image${slideNumber}`)
        ),
        wordCount: slideText.split(/\s+/).filter((word) => word.length > 0)
          .length,
      };

      slideData.slides.push(slide);
      slideData.fullText += `\n\n=== Slide ${slideNumber} ===\n${slideText.trim()}\n`;
    } catch (slideError) {
      console.warn(`Error processing slide ${slideFile}:`, slideError.message);
    }
  }

  // Extract speaker notes
  const notesFiles = fileNames.filter(
    (name) =>
      name.startsWith("ppt/notesSlides/notesSlide") && name.endsWith(".xml")
  );

  for (const notesFile of notesFiles) {
    try {
      const notesXml = await zip.files[notesFile].async("string");
      const notesText = extractTextFromPowerPointXML(notesXml);

      if (notesText.trim()) {
        slideData.fullText += `\n--- Speaker Notes ---\n${notesText.trim()}\n`;
        slideData.speakerNotes++;
      }
    } catch (notesError) {
      console.warn(`Error processing notes ${notesFile}:`, notesError.message);
    }
  }

  return slideData;
};

// Generate a visual preview for slides without images
const generateSlidePreview = async (slideText, slideNumber) => {
  try {
    // Create a canvas to render slide preview
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size (PowerPoint slide ratio 16:9)
    canvas.width = 800;
    canvas.height = 450;

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Add slide number in corner
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Slide ${slideNumber}`, canvas.width - 20, 30);

    // Add slide content
    if (slideText && slideText.trim()) {
      const lines = slideText
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      let y = 80;

      // Title (first line)
      if (lines.length > 0) {
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "left";
        const titleText =
          lines[0].substring(0, 60) + (lines[0].length > 60 ? "..." : "");
        ctx.fillText(titleText, 40, y);
        y += 60;
      }

      // Content lines
      ctx.fillStyle = "#374151";
      ctx.font = "16px Arial";

      for (let i = 1; i < Math.min(lines.length, 8); i++) {
        const line =
          lines[i].substring(0, 80) + (lines[i].length > 80 ? "..." : "");
        ctx.fillText(line, 60, y);
        y += 30;
      }

      // Show if there's more content
      if (lines.length > 8) {
        ctx.fillStyle = "#9ca3af";
        ctx.font = "italic 14px Arial";
        ctx.fillText("...", 60, y);
      }
    } else {
      // No text content
      ctx.fillStyle = "#9ca3af";
      ctx.font = "italic 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Visual content only", canvas.width / 2, canvas.height / 2);
      ctx.fillText(
        "(Images, charts, or graphics)",
        canvas.width / 2,
        canvas.height / 2 + 30
      );
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.warn("Error generating slide preview:", error);
    return null;
  }
};

// Enhanced text extraction from PowerPoint XML
const extractTextFromPowerPointXML = (xmlString) => {
  try {
    let extractedText = "";

    // Extract text from <a:t> tags
    const textMatches = xmlString.match(/<a:t[^>]*>(.*?)<\/a:t>/gs);
    if (textMatches) {
      textMatches.forEach((match) => {
        const text = match
          .replace(/<a:t[^>]*>/, "")
          .replace(/<\/a:t>/, "")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&apos;/g, "'")
          .trim();

        if (text && text.length > 0) {
          extractedText += text + " ";
        }
      });
    }

    return extractedText.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.warn("Error extracting text from PowerPoint XML:", error.message);
    return "";
  }
};

// Create visual presentation structure
const createVisualPresentationStructure = (slideData, fileName) => {
  const { slides, fullText } = slideData;

  // Calculate statistics
  const words = fullText.split(/\s+/).filter((word) => word.length > 0);
  const sentences = fullText
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 5);
  const meaningfulWords = words.filter((word) => word.length > 3);

  // Word frequency analysis
  const wordCount = {};
  meaningfulWords.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
    if (cleanWord) {
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });

  return {
    type: "presentation",
    subType: "pptx",
    content: fullText,
    visualSlides: slides, // This contains the visual slide data
    statistics: {
      totalCharacters: fullText.length,
      totalWords: words.length,
      meaningfulWords: meaningfulWords.length,
      totalSentences: sentences.length,
      confirmedSlides: slides.length,
      estimatedPresentationTime: Math.ceil(slides.length * 1.5),
      uniqueWords: Object.keys(wordCount).length,
    },
    structure: {
      slides: slides.map((slide) => slide.text),
      detectedSlides: slides,
    },
    wordAnalysis: {
      topWords: Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 30)
        .map(([word, count]) => ({ word, count })),
      wordFrequency: wordCount,
      wordDiversity:
        Object.keys(wordCount).length / Math.max(meaningfulWords.length, 1),
    },
    processingMessages: [],
    metadata: {
      fileName: fileName,
      processingNote: "Visual PPTX processing completed",
      extractionMethod: "visual-zip",
    },
  };
};

// Quality assessment remains the same
const assessPresentationQuality = (content) => {
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const meaningfulWords = words.filter((word) => word.length > 3);
  const uniqueWords = [
    ...new Set(meaningfulWords.map((word) => word.toLowerCase())),
  ];
  const wordDiversityRatio =
    uniqueWords.length / Math.max(meaningfulWords.length, 1);

  if (content.length > 2000 && wordDiversityRatio > 0.5 && words.length > 200) {
    return "excellent";
  } else if (
    content.length > 1000 &&
    wordDiversityRatio > 0.4 &&
    words.length > 100
  ) {
    return "good";
  } else if (
    content.length > 500 &&
    wordDiversityRatio > 0.3 &&
    words.length > 50
  ) {
    return "fair";
  } else {
    return "poor";
  }
};

// Conversion recommendation helper remains the same
const createPresentationConversionRecommendation = (fileName, reason) => {
  const reasonMessages = {
    unsupported_format:
      "PPT files are not supported. Please convert to PPTX or PDF format.",
    minimal_content: "No slides or content found in this presentation.",
    extraction_failed:
      "PPTX processing failed. PDF conversion recommended for reliable analysis.",
    processing_failed:
      "The presentation file could not be processed due to technical limitations.",
  };

  return {
    type: "presentation",
    subType: fileName.endsWith(".pptx") ? "pptx" : "ppt",
    error: null,
    conversionRecommended: true,
    conversionReason: reason,
    content: "",
    visualSlides: [],
    statistics: {
      totalCharacters: 0,
      totalWords: 0,
      meaningfulWords: 0,
      totalSentences: 0,
      confirmedSlides: 0,
      estimatedPresentationTime: 0,
      uniqueWords: 0,
    },
    structure: {
      slides: [],
      detectedSlides: [],
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
          "Presentation format needs conversion for better support.",
      },
    ],
    metadata: {
      fileName: fileName,
      processingNote: "Conversion recommended",
      extractionMethod: "none",
    },
  };
};
