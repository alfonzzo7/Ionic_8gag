import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';

@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {

  titulo:string = "";
  imagenPrev:string = "";
  imagen64:string;

  constructor(private viewCtrl: ViewController,
              private camera: Camera,
              private imagePicker: ImagePicker,
              private _cargaArchivoProvider: CargaArchivoProvider) {}

  cerrarModal(){
    this.viewCtrl.dismiss();
  }

  camara(){
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.imagenPrev = 'data:image/jpeg;base64,' + imageData;
     this.imagen64 = imageData;
    }, (err) => {
     // Handle error
     console.error("Error en cámara", JSON.stringify(err));
    });
  }

  seleccionar(){
    const options: ImagePickerOptions = {
      quality: 30,
      outputType: 1,
      maximumImagesCount: 1
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          // console.log('Image URI: ' + results[i]);
          this.imagenPrev = 'data:image/jpeg;base64,' + results[i];
          this.imagen64 = results[i];
      }
    }, (err) => {
      console.error("Error en selector", JSON.stringify(err));
    });
  }

  crearPost(){
    let archivo = {
      titulo: this.titulo,
      img: this.imagen64
    };

    this._cargaArchivoProvider.cargarArchivoFirebase(archivo).then(() => this.cerrarModal());
  }

}
