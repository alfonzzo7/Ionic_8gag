import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';

import { ToastController } from 'ionic-angular';

@Injectable()
export class CargaArchivoProvider {

  imagenes:Archivo[] = [];
  lastKey:string = null;

  constructor(public http: HttpClient,
              public toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {
    console.log('Hello CargaArchivoProvider Provider');
    this.cargarUltimoKey().subscribe(() => {
      this.cargarImagenes();
    });
  }

  private cargarUltimoKey(){
    return this.afDB.list("/post", ref => ref.orderByKey().limitToLast(1))
             .valueChanges()
             .map((posts:any) => {
               this.lastKey = posts[0].key;
               this.imagenes.push(posts[0]);
             });
  }

  cargarImagenes(){
    let promesa = new Promise((resolve, reject) => {
      this.afDB.list("/post",
        ref => ref.limitToLast(3)
                  .orderByKey()
                  .endAt(this.lastKey)
               ).valueChanges()
                .subscribe((posts:any) => {

                 posts.pop();

                 if(posts.length == 0){
                   console.log("Ya no hay más registros");
                   resolve(false);
                   return;
                 }

                 this.lastKey = posts[0].key;

                 for(let i = posts.length-1; i>=0; i--){
                   let post = posts[i];
                   this.imagenes.push(post);
                 }

                 resolve(true);
               });
    });

    return promesa;
  }

  cargarArchivoFirebase(archivo:Archivo){
    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast("Cargando...");

      let storage = firebase.storage().ref();

      let nombreArchivo:string = new Date().valueOf().toString();

      let uploadTask:firebase.storage.UploadTask =
          storage.child(`img/${nombreArchivo}`)
                 .putString(archivo.img, 'base64', {contentType: 'image/jpeg'});

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                  () => {},//saber porcentaje upload
                  (error) => {
                      console.error("Error en la carga", JSON.stringify(error));
                      this.mostrarToast(JSON.stringify(error));
                      reject();
                  },
                  () => { // Todo bien
                      console.log("Archivo Subido");
                      this.mostrarToast("Post Creado");

                      let url = uploadTask.snapshot.downloadURL;

                      this.crearPost(archivo.titulo, url, nombreArchivo);

                      resolve();
                  }
      );
    });

    return promesa;
  }

  private crearPost(titulo:string, url:string, nombreArchivo:string){
    let post:Archivo = {
      titulo:titulo,
      img:url,
      key:nombreArchivo
    };

    this.afDB.object(`/post/${nombreArchivo}`).update(post);

    // this.imagenes.unshift(post);
    this.imagenes.push(post);
  }

  mostrarToast(mensaje:string){
    this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    }).present();
  }

}

interface Archivo {
  titulo:string;
  img:string;
  key?:string;
}
