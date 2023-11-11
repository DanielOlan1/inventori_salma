import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Encoding, Directory } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  async exportToExcel(inventoryData: { productName: string; quantity: number }[], fileName: string): Promise<{ blob: Blob, fileUri: string }> {
    try {
      const header = ['Producto', 'Cantidad'];
      const data = inventoryData.map((item) => [item.productName, item.quantity]);
  
      const content = [header, ...data];
  
      const csvData = this.arrayToCSV(content);
  
      // Guardamos el archivo con el nombre deseado
      const result = await Filesystem.writeFile({
        path: `${fileName}.xlsx`,
        data: csvData,
        directory: this.getDirectory(),
        encoding: Encoding.UTF8,
      });
  
      console.log('File written successfully. Uri:', result.uri);
  
      // Introducimos un pequeño delay (puedes ajustar el tiempo según tus necesidades)
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Leemos el archivo utilizando el nombre del archivo
      const readFileResult = await Filesystem.readFile({
        path: `${fileName}.xlsx`, // Usamos el mismo nombre del archivo
        directory: this.getDirectory(),
        encoding: Encoding.UTF8,
      });
  
      // Extraemos la propiedad 'data' que contiene el contenido del archivo
      const fileContent = readFileResult.data;
  
      // Convertimos el contenido del archivo en un Blob
      const blob = new Blob([fileContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Devolvemos tanto el Blob como la URI del archivo
      return { blob, fileUri: result.uri };
    } catch (error) {
      console.error('Error writing/reading file:', error);
      throw error;
    }
  }
  
  private arrayToCSV(data: any[][]): string {
    return data.map((row) => row.join(',')).join('\n');
  }

  private getDirectory() {
    return Capacitor.isNative ? Directory.Documents : Directory.Data as any;
  }
}
