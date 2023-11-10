import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  productName: string = '';
  quantity: number = 0;
  inventoryData: { productName: string, quantity: number, photoDataUrl: string }[] = [];

  constructor(private modalController: ModalController, private alertController: AlertController, private camera: Camera) {}

  ngOnInit() {
    const savedData = localStorage.getItem('inventory');
    if (savedData) {
      this.inventoryData = JSON.parse(savedData);
    }
  }

  async tomarFoto() {
    try {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      const imageData = await this.camera.getPicture(options);

      if (imageData) {
        // Validar los datos antes de agregarlos al Local Storage
        if (this.productName.trim() === '' || this.quantity <= 0) {
          return;
        }

        // Agregar el nuevo producto con la foto
        this.inventoryData.push({
          productName: this.productName,
          quantity: this.quantity,
          photoDataUrl: 'data:image/jpeg;base64,' + imageData,
        });

        // Guardar la información actualizada en el Local Storage
        localStorage.setItem('inventory', JSON.stringify(this.inventoryData));

        // Limpiar los campos del formulario
        this.productName = '';
        this.quantity = 0;
      }
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
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