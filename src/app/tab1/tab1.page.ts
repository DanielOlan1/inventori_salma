import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
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
  'BARRAS MAGNETICAS'];

  constructor(private modalController: ModalController, private alertController: AlertController, ) {}

  ngOnInit() {
    const savedData = localStorage.getItem('inventory');
    if (savedData) {
      this.inventoryData = JSON.parse(savedData);
    }
  }

  agregarProducto() {
    // Validar los datos antes de agregarlos al Local Storage
    if (this.productName.trim() === '' || this.quantity <= 0) {
      return;
    }

    // Agregar el nuevo producto
    this.inventoryData.push({ productName: this.productName, quantity: this.quantity });

    // Guardar la información actualizada en el Local Storage
    localStorage.setItem('inventory', JSON.stringify(this.inventoryData));

    // Limpiar los campos del formulario
    this.productName = '';
    this.quantity = 0;
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
            this.inventoryData.splice(index, 1); // Elimina el producto del arreglo local.
            localStorage.setItem('inventory', JSON.stringify(this.inventoryData)); // Actualiza Local Storage.
          },
        },
      ],
    });

    await confirmDelete.present();
  }

 

  
}