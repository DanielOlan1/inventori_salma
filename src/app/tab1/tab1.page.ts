// tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TimerService } from '../time.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  productName: string = '';
  quantity: number = 0;
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
    'BARRAS MAGNETICAS'
  ];
  showAddOption: boolean = false;
  newOption: string = '';
  expirationTime: number = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  remainingTime: number = 0;

  constructor(private modalController: ModalController, private alertController: AlertController, private timerService: TimerService) {}

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
      this.inventoryData = JSON.parse(savedData);
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

  // Agregar el nuevo producto
  const selectedOption = this.newOption ? this.newOption : this.productName;
  this.inventoryData.push({ productName: selectedOption, quantity: this.quantity });

  // Guardar la información actualizada en el Local Storage junto con la marca de tiempo
  const expirationTimestamp = Date.now() + 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  const dataToSave = { data: this.inventoryData, expirationTimestamp };
  localStorage.setItem('inventory', JSON.stringify(dataToSave));

  // Limpiar los campos del formulario
  this.productName = '';
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
}
