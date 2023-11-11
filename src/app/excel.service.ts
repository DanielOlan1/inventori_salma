import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  async exportToExcel(data: any[], fileName: string, sheetName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Agrega tus datos al worksheet
    worksheet.addRows(data);

    // Crea un blob a partir del workbook
    const blob = await workbook.xlsx.writeBuffer();

    // Crea un objeto Blob y descarga el archivo
    const file = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName + '.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
