type CsvCell = string | number | boolean | null | undefined;

function escapeCsvCell(value: CsvCell) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, headers: string[], rows: CsvCell[][]) {
  const csv = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtmlCell(value: CsvCell) {
  const text = value === null || value === undefined ? "" : String(value);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function downloadExcel(filename: string, title: string, headers: string[], rows: CsvCell[][]) {
  const tableHeaders = headers
    .map((header) => `<th style="background:#111827;color:#ffffff;font-weight:700;border:1px solid #d9e2ef;padding:8px;text-align:left;">${escapeHtmlCell(header)}</th>`)
    .join("");
  const tableRows = rows
    .map((row) => (
      `<tr>${row
        .map((cell) => `<td style="border:1px solid #d9e2ef;padding:8px;mso-number-format:'\\@';">${escapeHtmlCell(cell)}</td>`)
        .join("")}</tr>`
    ))
    .join("");
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; }
    h1 { font-size: 18px; color: #111827; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>
  <h1>${escapeHtmlCell(title)}</h1>
  <table>
    <thead><tr>${tableHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;
  const blob = new Blob([`\uFEFF${html}`], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
