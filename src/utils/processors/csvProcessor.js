import * as d3 from "d3";

export const processCSVFile = async (content, fileName) => {
  try {
    console.log("Processing CSV file:", fileName);

    // Parse CSV data using d3
    const csvData = d3.csvParse(content);

    if (!csvData || csvData.length === 0) {
      return {
        type: "csv",
        name: fileName,
        rows: 0,
        columns: [],
        data: [],
        error: "Empty CSV file or invalid format",
      };
    }

    const summary = generateCSVSummary(csvData);

    console.log("CSV processed successfully:", {
      rows: csvData.length,
      columns: csvData.columns?.length || 0,
    });

    return {
      type: "csv",
      rows: csvData.length,
      columns: csvData.columns || [],
      data: csvData,
      summary: summary,
      metadata: {
        fileName: fileName,
        processingNote: "CSV file processed successfully",
      },
    };
  } catch (error) {
    console.error("CSV processing error:", error);
    return {
      type: "csv",
      name: fileName,
      error: `Failed to parse CSV file: ${error.message}`,
      rows: 0,
      columns: [],
      data: [],
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
