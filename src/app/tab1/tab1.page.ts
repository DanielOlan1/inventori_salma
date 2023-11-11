// tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TimerService } from '../time.service';
import { ExcelService } from '../excel.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  productName: string = '';
  quantity: number = 1;
  quantityOptions: number[] = Array.from({ length: 100 }, (_, i) => i + 1); // Opciones de 1 a 10

  inventoryData: { productName: string, quantity: number }[] = [];
  productOptions: string[] = [
    'GPS TRACTO', 
    'GPS TANQUES', 
    'SENSOR COMBUSTIBLE',
    'SENSOR PUERTA OPERADOR',
    'SENSOR PUERTA CHOFER',
    'SENSOR BUZZER',
    'SENSOR SIRENA',
    'PARO DE MOTOR',
    'CAMARA OPERADOR',
    'CAMARA CARRETERA',
    'TABLETA',
    'BARRAS MAGNETICAS',
    'CABLE 7 HILOS',
    'DISPOSITIVO TELEMETRIA'

  ];
  showAddOption: boolean = false;
  newOption: string = '';
  expirationTime: number = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  remainingTime: number = 0;

  constructor(private modalController: ModalController, private alertController: AlertController, private timerService: TimerService, private excelService: ExcelService) {}

  ngOnInit() {
    this.loadInventoryData();
    this.timerService.startExpirationCountdown(this.expirationTime);
  }
  formatRemainingTime(): string {
    const hours = Math.floor(this.remainingTime / (60 * 60 * 1000));
    const minutes = Math.floor((this.remainingTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((this.remainingTime % (60 * 1000)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
  loadInventoryData() {
    const savedData = localStorage.getItem('inventory');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
  
        // Verificar si parsedData tiene una propiedad 'data' que es un array
        if (Array.isArray(parsedData.data)) {
          this.inventoryData = parsedData.data;
        } else {
          this.inventoryData = [];
        }
      } catch (error) {
        console.error('Error parsing inventory data from localStorage:', error);
        this.inventoryData = [];
      }
    }
  }
  

  startExpirationCountdown() {
    const expirationDate = new Date().getTime() + this.expirationTime;

    setInterval(() => {
      const now = new Date().getTime();
      this.remainingTime = Math.max(expirationDate - now, 0);

      if (this.remainingTime <= 0) {
        localStorage.removeItem('inventory');
        this.inventoryData = [];
        this.remainingTime = 0;
      }
    }, 1000);
  }

// tab1.page.ts
agregarProducto() {
  // Validar los datos antes de agregarlos al Local Storage
  if ((this.productName.trim() === '' && !this.newOption) || this.quantity <= 0) {
    return;
  }

  // Buscar el producto en el inventario
  const existingProductIndex = this.inventoryData.findIndex(item => item.productName === this.productName);

  if (existingProductIndex !== -1) {
    // Si el producto ya existe, actualizar la cantidad
    this.inventoryData[existingProductIndex].quantity += this.quantity;
  } else {
    // Si el producto no existe, agregarlo al inventario
    this.inventoryData.push({ productName: this.productName, quantity: this.quantity });
  }

  // Guardar la información actualizada en el Local Storage junto con la marca de tiempo
  const expirationTimestamp = Date.now() + 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  const dataToSave = { data: this.inventoryData, expirationTimestamp };
  localStorage.setItem('inventory', JSON.stringify(dataToSave));

  // Restablecer el valor del nombre del producto
  this.productName = '';

  // Limpiar los campos del formulario
  this.newOption = '';
  this.quantity = 0;
  this.showAddOption = false;

  // Reiniciar el contador
  this.startExpirationCountdown();
}



  async eliminarProducto(index: number) {
    const confirmDelete = await this.alertController.create({
      header: 'Eliminar Producto',
      message: '¿Seguro que deseas eliminar este producto?',
      mode: 'ios',
      buttons: [
        'Cancelar',
        {
          text: 'Eliminar',
          handler: () => {
            this.inventoryData.splice(index, 1);
            localStorage.setItem('inventory', JSON.stringify(this.inventoryData));
          },
        },
      ],
    });

    await confirmDelete.present();
  }

  toggleAddOption() {
    this.showAddOption = true;
  }

  agregarNuevaOpcion() {
    if (this.newOption.trim() !== '') {
      this.productOptions.push(this.newOption);
      this.showAddOption = false;
    }
  }

  downloadLink: string | null = null; 
  async downloadAndShowLink(dataToExport: any[], fileName: string, sheetName: string) {
    // Descarga el archivo Excel y obtén el Blob del servicio
    const blob = this.excelService.downloadExcel(dataToExport, fileName, sheetName);

    // Crea una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Muestra el enlace en la interfaz de usuario
    this.downloadLink = url;
  }
  

  async confirmarDescarga() {
    const confirmAlert = await this.alertController.create({
      header: 'Confirmar Descarga',
      message: '¿Deseas descargar el archivo?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Descargar',
          handler: () => {
            this.descargarArchivo();
          },
        },
      ],
    });

    await confirmAlert.present();
  }

  async descargarArchivo() {
    if (this.downloadLink) {
      const link = document.createElement('a');
      link.href = this.downloadLink;
      link.download = 'nombre-del-archivo.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

