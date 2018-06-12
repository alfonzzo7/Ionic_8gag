import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

// import { AngularFireDatabase } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';

import { SocialSharing } from '@ionic-native/social-sharing';

import { CargaArchivoProvider } from '../../providers/carga-archivo/carga-archivo';

import { SubirPage } from '../subir/subir';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // posts: Observable<any[]>;
  masImagenes:boolean = true;

  constructor(public modalCtrl: ModalController,
              private _cargaArchivoProvider: CargaArchivoProvider,
              private socialSharing: SocialSharing
              //, private afDB: AngularFireDatabase
            ) {
    // this.posts = afDB.list('post').valueChanges();
  }

  mostrarModal(){
    let modal = this.modalCtrl.create(SubirPage) ;
    modal.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    this._cargaArchivoProvider.cargarImagenes().then(
        (masImagenes:boolean) => {
          this.masImagenes = masImagenes;
          infiniteScroll.complete();
        }
    );
  }

  compartir( post:any ){
    console.log(JSON.stringify(post));
    this.socialSharing.shareViaFacebook( post.titulo, post.img, post.img )
      .then( ()=>{} ) // se pudo compartir
      .catch( (error)=>{} ) // si sucede un error
  }

}
