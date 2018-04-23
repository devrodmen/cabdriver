import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';


import { IonicStorageModule } from '@ionic/storage';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

import { MyApp } from './app.component';

/**
 * Pages
 */
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { MessagePage } from '../pages/message/message';
import { InfoPage } from '../pages/info/info';
import { TabsPage } from '../pages/tabs/tabs';

/** 
 * Proiders
 */
import { LoginProvider } from '../providers/login';
import { ReservaProvider } from '../providers/reserva/reserva';
import { MessagePageModule } from '../pages/message/message.module';
import { LoginPageModule } from '../pages/login/login.module';


@NgModule({
  declarations: [
    MyApp/*,
    PerfilPage,
    InfoPage*/
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MessagePageModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PerfilPage,
    MessagePage,
    InfoPage,
    TabsPage
  ],
  providers: [
    ConferenceData,
    UserData,
    LoginProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ReservaProvider
  ]
})
export class AppModule {}
