// excel.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  downloadExcel(data: any[], fileName: string, sheetName: string): Blob {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Genera un Blob desde el libro
    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' as 'string' });

    return blob;
  }
}
