import * as XLSX from "xlsx";

export const processExcelFile = async (arrayBuffer, fileName) => {
  try {
    console.log("Processing Excel file:", fileName);

    // Parse Excel file using SheetJS
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      return {
        type: "excel",
        name: fileName,
        rows: 0,
        columns: [],
        data: [],
        error: "Empty Excel file",
      };
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

    const summary = generateExcelSummary(formattedData);

    console.log("Excel processed successfully:", {
      rows: formattedData.length,
      columns: headers.length,
      sheets: workbook.SheetNames.length,
    });

    return {
      type: "excel",
      rows: formattedData.length,
      columns: headers.map((h) => h || "Unnamed"),
      data: formattedData,
      summary: summary,
      sheetName: sheetName,
      totalSheets: workbook.SheetNames.length,
      allSheets: workbook.SheetNames,
      metadata: {
        fileName: fileName,
        processingNote: `Excel file processed successfully (${workbook.SheetNames.length} sheets)`,
      },
    };
  } catch (error) {
    console.error("Excel processing error:", error);
    return {
      type: "excel",
      name: fileName,
      error: `Failed to parse Excel file: ${error.message}`,
      rows: 0,
      columns: [],
      data: [],
    };
  }
};

const generateExcelSummary = (data) => {
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
