import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//Plugins
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { SocialSharing } from '@ionic-native/social-sharing';

//Pipes
import { PipesModule } from '../pipes/pipes.module';

export const firebaseConfig = {
  apiKey: "AIzaSyBjkDIqzSK5EH_OeQKFwM3pMMwbV-w68Kw",
  authDomain: "gag-d9766.firebaseapp.com",
  databaseURL: "https://gag-d9766.firebaseio.com",
  projectId: "gag-d9766",
  storageBucket: "gag-d9766.appspot.com",
  messagingSenderId: "56109880100"
};

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SubirPage } from '../pages/subir/subir';

import { CargaArchivoProvider } from '../providers/carga-archivo/carga-archivo';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SubirPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SubirPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    Camera,
    ImagePicker,
    SocialSharing,
    CargaArchivoProvider
  ]
})
export class AppModule {}
