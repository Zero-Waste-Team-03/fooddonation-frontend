import { buildCsv } from "@/lib/csv";
import { downloadBlob } from "@/lib/downloadBlob";

export function downloadListCsv(
  headers: string[],
  rows: string[][],
  fileName: string
): void {
  const csv = buildCsv(headers, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, fileName);
}
