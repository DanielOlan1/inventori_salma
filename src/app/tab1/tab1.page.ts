import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TimerService } from '../time.service';
import { ExcelService } from '../excel.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private modalController: ModalController, 
    private alertController: AlertController, 
    private timerService: TimerService, 
    private excelService: ExcelService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone) {}

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

  agregarProducto() {
    if ((this.productName.trim() === '' && !this.newOption) || this.quantity <= 0) {
      return;
    }
    const existingProductIndex = this.inventoryData.findIndex(item => item.productName === this.productName);

    if (existingProductIndex !== -1) {
      this.inventoryData[existingProductIndex].quantity += this.quantity;
    } else {
      this.inventoryData.push({ productName: this.productName, quantity: this.quantity });
    }

    const expirationTimestamp = Date.now() + 24 * 60 * 60 * 1000; 
    const dataToSave = { data: this.inventoryData, expirationTimestamp };
    localStorage.setItem('inventory', JSON.stringify(dataToSave));

    this.productName = '';

    this.newOption = '';
    this.quantity = 0;
    this.showAddOption = false;

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

  agregarNuevaOpcion() {
    if (this.newOption.trim() !== '') {
      this.productOptions.push(this.newOption);
      this.showAddOption = false;
    }
  }

  private file: File | undefined;

  handleFileInput(event: any): void {
    this.file = event.target.files[0];
  }

  exportarAExcel(): Promise<Blob> {
    return this.excelService.exportToExcel(this.inventoryData, 'nombre_archivo');
  }
  

  toggleAddOption() {
    // Cambia el valor de showAddOption
    this.showAddOption = !this.showAddOption;
    
    // Limpiar el valor de newOption cuando se desactiva el toggle
    if (!this.showAddOption) {
      this.newOption = '';
    }
  
    // Aplica detección de cambios y ejecuta en la zona Angular
    this.zone.run(() => {
      this.cdr.markForCheck();
    });
  }
  

}
