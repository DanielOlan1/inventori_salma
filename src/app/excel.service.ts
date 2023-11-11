import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  exportToExcelFile(file: File, data: any[], sheetName: string): void {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const workbook: XLSX.WorkBook = XLSX.read(uint8Array, { type: 'array' });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = worksheet;

      // Create a blob from the workbook
      const blob = XLSX.write(workbook, { bookType: 'xlsx' });

      // Create a download link and trigger a click event
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    reader.readAsArrayBuffer(file);
  }
}
