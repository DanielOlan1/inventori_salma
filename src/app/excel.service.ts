import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  exportToExcel(inventoryData: { productName: string, quantity: number }[], fileName: string): void {
    const header = ['Producto', 'Cantidad'];
    const data = inventoryData.map(item => [item.productName, item.quantity]);

    const content = [header, ...data];

    const blob = new Blob([this.arrayToCSV(content)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private arrayToCSV(data: any[][]): string {
    return data.map(row => row.join(',')).join('\n');
  }
}
