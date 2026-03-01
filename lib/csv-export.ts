/**
 * CSV Export Utility
 * 
 * Utilities for exporting registration data to CSV format.
 */

export interface RegistrationRecord {
  id: string;
  event_id: string;
  name: string;
  email: string;
  usn?: string | null;
  branch?: string | null;
  created_at: string;
  event_title?: string;
}

/**
 * Convert registration records to CSV string
 * @param records - Array of registration records
 * @param eventTitle - Optional event title to include in header
 * @returns CSV formatted string
 */
export function registrationsToCSV(
  records: RegistrationRecord[],
  eventTitle?: string
): string {
  if (records.length === 0) {
    return "No registrations found";
  }

  // CSV Header
  const headers = ["Name", "Email", "USN", "Branch", "Registered On"];
  const csvHeaders = headers.join(",");

  // CSV Data Rows
  const csvRows = records.map((record) => {
    // Escape quotes and wrap in quotes if contains comma
    const escapeField = (field: string | null | undefined) => {
      if (field === null || field === undefined) {
        return "";
      }
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Format date
    const registeredDate = new Date(record.created_at).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    return [
      escapeField(record.name),
      escapeField(record.email),
      escapeField(record.usn),
      escapeField(record.branch),
      escapeField(registeredDate),
    ].join(",");
  });

  // Combine with optional metadata
  let csv = "";
  if (eventTitle) {
    csv += `"Event: ${eventTitle}"\n`;
    csv += `"Exported: ${new Date().toLocaleDateString("en-IN")}\n`;
    csv += `"Total Registrations: ${records.length}"\n\n`;
  }

  csv += csvHeaders + "\n" + csvRows.join("\n");

  return csv;
}

/**
 * Download CSV file
 * @param csvContent - CSV string content
 * @param filename - Name of file to download (without .csv extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}

/**
 * Export registrations to CSV file
 * @param records - Array of registration records
 * @param eventTitle - Event title for filename and metadata
 */
export function exportRegistrationsToCSV(
  records: RegistrationRecord[],
  eventTitle: string
): void {
  const csvContent = registrationsToCSV(records, eventTitle);
  const filename = `${eventTitle.toLowerCase().replace(/\s+/g, "-")}-registrations-${new Date().getTime()}`;
  downloadCSV(csvContent, filename);
}
